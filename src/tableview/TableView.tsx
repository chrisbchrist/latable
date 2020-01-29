import React, {useCallback, useEffect, useMemo, useState} from "react";
import { Select, Table } from "antd";
import { DomainEntity, Key, Keys } from "../domain/Domain";
import SelectionModel, { getSelectionModel } from "./SelectionModel";
import { ColumnProps, TableProps } from "antd/es/table";
import Menu from "antd/es/menu";
import { ContextMenuDropdown } from "./ContextMenuDropdown";
import { TableAction } from "./Actions";
import { TableSearch } from "../search/TableSearch";
import { Omit } from "antd/es/_util/type";
import { measureTime } from "../Tools";
import uuid from "uuid";

type TableViewChild = TableAction | React.ReactNode;

export interface TableViewColumn<T extends DomainEntity>
  extends ColumnProps<T> {
  disableClick?: boolean; // Prevents event bubbling to disable row selection on click for cells that need to be
  // interacted with
}

export interface TableViewProps<T extends DomainEntity>
  extends Omit<TableProps<T>, "dataSource" | "columns"> {
  columns: TableViewColumn<T>[]; // AntD columns with custom props
  disableContextMenu?: boolean; // disables context action menu
  verboseToolbar?: boolean; // show titles of the action buttons
  multipleSelection?: boolean; // allow multiple selection
  bulkDelete?: boolean; // allows deletion of multiple records at once in concert with multiple selection
  loadData?: () => T[]; // function to load data into the table
  children?: TableViewChild | TableViewChild[];
  onRowSelect?: (selectedRowKeys: Keys) => any; //Callback function run when selected row keys change to expose
  // keys for additional functionality until custom table actions can be implemented
  search?: boolean; // enables search dialog to filter data
  filters?: Array<{ label: string; condition: (record: T) => boolean }>; // Array of global filters with labels and filter functions
  // disableRowSelection?: boolean; //Disables selection completely
}

// In following API fulfilled promise defines success, rejected promise defines failure
export type InsertCallback<T extends DomainEntity> = (item?: T) => Promise<T>;
export type UpdateCallback<T extends DomainEntity> = (item: T) => Promise<T>;
export type RemoveCallback<T extends DomainEntity> = (
  keys: Keys
) => Promise<boolean>;
export type RemoveMultipleCallback = (keys: Keys) => Promise<boolean>;

export interface TableViewContext<T extends DomainEntity> {
  selectedRowKeys: Keys;
  verboseToolbar?: boolean;
  refreshData: () => void;
  insertSelectedItem: (onInsert: InsertCallback<T>) => void;
  updateSelectedItem: (onUpdate: UpdateCallback<T>) => void;
  removeSelectedItem: (onRemove: RemoveCallback<T>) => void;
}

export const TableViewContext = React.createContext<any>({});

export function TableView<T extends DomainEntity>(props: TableViewProps<T>) {
  const {
    columns,
    loading,
    title,
    filters,
    onRow,
    loadData,
    onRowSelect,
    verboseToolbar,
    ...otherProps
  } = props;

  const getTableData = useMemo(() => {
    return loadData ? loadData() : [];
  }, [
    loadData
  ]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<Keys>([]);
  const [tableData, setTableData] = useState<T[]>(getTableData);
  const [filteredData, setFilteredData] = useState<T[]>([]); // Results of search/filter
  const [useVerboseToolbar, setVerboseToolbar] = useState(verboseToolbar);
  const [isLoading, setLoading] = useState(loading);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchColumn, setSearchColumn] = useState<string | undefined>(
    undefined
  ); // Column to search in if specified
  const [activeFilter, setActiveFilter] = useState<any>(undefined);

  // Make sure certain properties can be changed dynamically can be changed dynamically
  // Since verboseToolbar & loading state is never called in the TableView component
  // we have to force it on change of related prop
  useEffect(() => {
    setVerboseToolbar(verboseToolbar);
  }, [verboseToolbar]);
  useEffect(() => {
    setLoading(loading);
  }, [loading]);
  useEffect(() => {
    console.log("Get table data");
    setTableData(getTableData);
  }, [getTableData]);

  const selectionModel: SelectionModel<Key> = getSelectionModel<Key>(
    props.multipleSelection !== undefined && props.multipleSelection,
    selectedRowKeys as Key[],
    setSelectedRowKeys
  );

  const filterDataByCondition = useCallback(
    (data: Array<T>) => {
        // activeFilter is an index, and since 0 is a falsy value but still valid, we need to explicitly check for undefined
      if (filters && activeFilter !== undefined) {
        return data.filter(filters[activeFilter].condition);
      }
      return data;
    },
    [activeFilter, filters]
  );

  const filterData = ( searchValue: any, columnToSearch?: string) => {
    let allTableData = Array.from(tableData);
    if (!searchValue) {
      const filterResults = filterDataByCondition(allTableData);
      const availableKeys = filterResults.map(r => r.key);
      selectionModel.set(selectionModel.get().filter(s => availableKeys.includes(s)));
      setFilteredData(filterResults);
    } else if (columnToSearch && searchValue) {
      setFilteredData(
        filterDataByCondition(allTableData).filter(d =>
          d[columnToSearch]
            .toString()
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        )
      );
    } else if (!columnToSearch && searchValue) {
      // Working, but probably not the most performant solution
      measureTime("Search all data", () => {
        // Limit searched columns to those with searchable data values
        const columnsWithData = columns!
          .filter((col: any) => col.dataIndex)
          .map((col: any) => col.dataIndex);
        let searchAllResults: any[] = [];
        for (let i = 0; i < allTableData.length; i++) {
          for (let j = 0; j < columnsWithData.length; j++) {
            const columnValue = allTableData[i][columnsWithData[j]];
            if (columnValue) {
              if (
                columnValue
                  .toString()
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
              ) {
                searchAllResults.push(allTableData[i]);
                // Break loop when one column matches to prevent duplicate results
                break;
              }
            }
          }
        }
        let filteredResults = filterDataByCondition(searchAllResults);
        // Removing row selections for now, as they may not exist in the results,
        // but it shouldn't be too difficult to preserve them if necessary
        selectionModel.set([]);
        setFilteredData(filteredResults);
      });
    }
  };

  // Updates search/filter results when a new search is run, filter is changed, or when a search/filter is active & the dataset is altered
  useEffect(() => {
      console.log("Running filter");
      filterData(searchValue, searchColumn && searchColumn);
  }, [searchValue, searchColumn, activeFilter, tableData]);

  // Runs optional callback on selected row keys when they change to expose them to external components
  useEffect(() => {
    onRowSelect && onRowSelect(selectedRowKeys);
  }, [selectedRowKeys, onRowSelect]);

  function selectRow(row?: T) {
    let selection = row ? row.key : undefined;
    if (selection) {
      selectionModel.toggle(selection);
    }
  }

  function getItemByKey(key: Key): T | undefined {
    return tableData.find(e => e.key == key);
  }

  function refreshData() {
    if (loadData) {
      try {
        setLoading(true);
        setTableData(loadData());
      } finally {
        setLoading(false);
      }
    }
  }

  function insertSelectedItem(onInsert: InsertCallback<T>) {
    const selectedItem = selectionModel.isEmpty()
      ? undefined
      : getItemByKey(selectedRowKeys[0] as Key);
    onInsert(selectedItem).then(insertedItem => {
      if (insertedItem) {
        // setTableData([...tableData, insertedItem]);

        // Seems to work fine with hooks
        tableData.push(insertedItem);

        // select newly inserted item
        selectionModel.set([insertedItem.key]);
      }
    });
  }

  function updateSelectedItem(onUpdate: UpdateCallback<T>) {
    if (selectionModel.isEmpty()) return;
    let selectedIndex = tableData.findIndex(
      item => item.key === selectedRowKeys[0]
    );
    if (selectedIndex >= 0) {
      onUpdate(tableData[selectedIndex]).then(updatedItem => {
        if (updatedItem) {
          // let data = [...tableData];
          // data[selectedIndex] = updatedItem;
          // setTableData(data);

          // Seems to work fine with the hooks
          tableData[selectedIndex] = updatedItem;

          // make sure selection stays on the same item
          selectionModel.set([updatedItem.key]);
        }
      });
    }
  }

  function removeSelectedItem(onRemove: RemoveCallback<T>) {
    if (selectionModel.isEmpty()) return;

    let itemIndex = tableData.findIndex(
      item => item.key === selectedRowKeys[0]
    );
    if (itemIndex < 0) return;

    onRemove(selectedRowKeys).then(res => {
      // If confirmation is cancelled, response will be false
      if (res) {
        // Copy data to prevent direct state mutation
        let newTableData = Array.from(tableData);
        measureTime("Table item removal", () => {
          // let ndata = [...tableData];
          // ndata.splice(itemIndex, 1);
          // setTableData(ndata);

          // Following goes again "no direct state update" rule, but it works fine with hooks and...
          // The removal operation is almost 1000x faster, which makes a huge visual difference for big data sets
          // tableData.splice(itemIndex, 1);

          // Using splice prevents React from listening to changes in tableData when an item is removed/changed, so
          // any operation that's dependent upon that state change to trigger an update will not execute. Not as
          // performant, but now listens to data changes.
          if (selectedRowKeys.length > 1) {
            newTableData = newTableData.filter(
              d => !selectedRowKeys.includes(d.key)
            );
          } else {
            newTableData.splice(itemIndex, 1);
          }

          setTableData(newTableData);
        });

        // Calculate appropriate selection index.  If table is displaying a filtered list of data, ensure the new index
        // exists in the current dataset. Since setState is async, tableData may not be
        // updated when this is calculated, so we can use the new cloned data.
        const currentData =
          searchValue && filteredData ? filteredData : newTableData;
        //console.log(itemIndex);
        itemIndex = itemIndex >= currentData.length ? itemIndex - 1 : itemIndex;
        let selection =
          itemIndex < 0 || currentData.length == 0
            ? []
            : [currentData[itemIndex].key];
        //console.log(itemIndex, selection);
        selectionModel.set(selection);
      }
    });
  }

  function onChangeFilter(value: any) {
      if (value === "All") {
          setActiveFilter(undefined);
      } else {
          setActiveFilter(value);
      }

  }

  const context = {
    selectedRowKeys,
    verboseToolbar: useVerboseToolbar,
    refreshData,
    insertSelectedItem,
    updateSelectedItem,
    removeSelectedItem,
    columns: columns && columns,
    tableData
  };

  function buildContextMenu() {
    return (
      <Menu>
        {React.Children.toArray(props.children).reduce(reduceToMenu, [])}
      </Menu>
    );
  }

  // Renders values of table with context menu
  function renderCell(value: any) {
    return <ContextMenuDropdown value={value} buildMenu={buildContextMenu} />;
  }

  function mapColumns(col: any) {
    return {
      ...col,
      // If column has a custom render function, pass the result as the value to be wrapped by the context menu
      render: col.render
        ? (value: any) => (
            <ContextMenuDropdown
              value={col.render(value)}
              buildMenu={buildContextMenu}
            />
          )
        : renderCell
    };
  }

  function decoratedColumns(): ColumnProps<T>[] | undefined {
    if (props.disableContextMenu) return props.columns;
    return props.columns && props.columns.map(mapColumns);
  }

  return (
    <TableViewContext.Provider value={context}>
      <Table
        {...otherProps}
        columns={decoratedColumns()}
        loading={isLoading}
        title={currentPageData => (
          <div>
            <div>{props.title && props.title(currentPageData)}</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {props.children}
              {filters && (
                <Select
                  placeholder="Filter By"
                  value={activeFilter}
                  onChange={onChangeFilter}
                  style={{ minWidth: 175, marginLeft: "1mm" }}
                >
                  <Select.Option value={"All"}>
                    All
                  </Select.Option>
                  {filters.map((filter, i) => (
                    <Select.Option value={i} key={i}>
                      {filter.label}
                    </Select.Option>
                  ))}
                </Select>
              )}
              {props.search && (
                <TableSearch
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  columns={columns}
                  searchColumn={searchColumn}
                  setSearchColumn={setSearchColumn}
                />
              )}
            </div>
          </div>
        )}
        dataSource={
          (searchValue && filteredData) || activeFilter !== undefined
            ? filteredData
            : tableData
        }
        rowSelection={{
          selectedRowKeys: selectedRowKeys as string[] | number[],
          type: props.multipleSelection
            ? ("checkbox" as any)
            : ("radio" as any),
          onChange: (keys: Keys) => selectionModel.set(keys as Key[])
        }}
        onRow={record => ({
          onClick: () => selectRow(record),
          onContextMenu: () => selectRow(record)
        })}
      />
    </TableViewContext.Provider>
  );
}

// Checks if child is an action
function isTableAction(child: TableViewChild): boolean {
  // TODO Find a more reliable way to check the type
  return (child as any).type.name.endsWith("TableAction");
}

// Reduces table view children to menu items
// Makes sure that only one sequential divider shown
function reduceToMenu(
  children: TableViewChild[],
  child: TableViewChild
): TableViewChild[] {
  switch (true) {
    case isTableAction(child): {
      children.push(React.cloneElement(child as TableAction, { key: uuid() }));
      break;
    }
    case children.length == 0 || isTableAction(children[children.length - 1]): {
      children.push(<Menu.Divider key={uuid()} />);
      break;
    }
  }
  return children;
}

export default React.memo(TableView);
