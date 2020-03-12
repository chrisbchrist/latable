/* Experiment to integrate react-base-table into the library in place of AntD's table and maintain as much
    of the same functionality as possible.  Missing several built-in features that would need to be added from scratch:
    Selection cells, responsive columns, loading animations
 */

import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { DomainEntity, Key, Keys } from "../domain/Domain";
import SelectionModel, { getSelectionModel } from "./SelectionModel";
import { MemoizedSelectionCell } from "./newtable/SelectionCell";
import { SelectionHeader } from "./newtable/SelectionHeader";
import { ColumnProps } from "antd/es/table";
import Menu from "antd/es/menu";
import Spin from "antd/es/spin";
import { ContextMenuDropdown } from "./ContextMenuDropdown";
import { TableAction } from "./Actions";
import { measureTime } from "../Tools";
import uuid from "uuid";
import "react-base-table/styles.css";
import "../indigo.css";
import "./newtable/NewTable.css";
import BaseTable from "react-base-table";
import { TableSearch } from "../search/TableSearch";
import whyDidYouRender from "@welldone-software/why-did-you-render";
import Icon from "antd/es/icon";

whyDidYouRender(React);

type TableViewChild = TableAction | React.ReactNode;

export interface BaseTableProps<T> {
  columns: Array<any>;
  width?: number;
  height?: number;
  fixed?: boolean;
}

export interface NewTableProps<T extends DomainEntity>
  extends BaseTableProps<T> {
  disableContextMenu?: boolean; // disables context action menu
  verboseToolbar?: boolean; // show titles of the action buttons
  multipleSelection?: boolean; // allow multiple selection
  bulkDelete?: boolean; // allows deletion of multiple records at once in concert with multiple selection
  loadData?: () => T[]; // function to load data into the table
  children?: TableViewChild | TableViewChild[];
  onRowSelect?: (selectedRowKeys: Keys) => any; //Callback function run when selected row keys change to expose
  // keys for additional functionality until custom table actions can be implemented
  search?: boolean; // enables search dialog to filter data
  loading?: boolean;
  title?: any;
  rowSelection?: "single" | "multiple";
  onRow?: any;
}

// In following API fulfilled promise defines success, rejected promise defines failure
export type InsertCallback<T extends DomainEntity> = (item?: T) => Promise<T>;
export type UpdateCallback<T extends DomainEntity> = (item: T) => Promise<T>;
export type RemoveCallback<T extends DomainEntity> = (
  keys: Keys
) => Promise<boolean>;

export interface TableViewContext<T extends DomainEntity> {
  selectedRowKeys: Keys;
  verboseToolbar?: boolean;
  refreshData: () => void;
  insertSelectedItem: (onInsert: InsertCallback<T>) => void;
  updateSelectedItem: (onUpdate: UpdateCallback<T>) => void;
  removeSelectedItem: (onRemove: RemoveCallback<T>) => void;
}

export const TableViewContext = React.createContext<any>({});

export function NewTable<T extends DomainEntity>(
  props: NewTableProps<T>
): ReactElement {
  const {
    loadData,
    columns,
    loading,
    rowSelection,
    width,
    height,
    disableContextMenu,
    children,
    search,
    title,
    verboseToolbar,
    multipleSelection,
    onRowSelect,
    ...rest
  } = props;
  const getTableData = () => (loadData ? loadData() : []);

  const [selectedRowKeys, setSelectedRowKeys] = useState<Keys>([]);
  const [tableData, setTableData] = useState<T[]>(getTableData());
  const [filteredData, setFilteredData] = useState<T[]>([]); // Results of search
  const [verbose, setVerboseToolbar] = useState(verboseToolbar);
  const [isLoading, setLoading] = useState(loading);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchColumn, setSearchColumn] = useState<string | undefined>(
    undefined
  ); // Column to search in if specified

  // All the keys in the tableData
  const allKeys = useMemo(() => {
    const activeData = searchValue && filteredData ? filteredData : tableData;
    return activeData.map(d => d.key);
  }, [searchValue, filteredData, tableData]);

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
    setTableData(getTableData());
  }, [loadData]);

  // Updates search results when a new search is run or when the dataset is altered
  useEffect(() => {
    console.log(searchValue);
    if (searchValue) {
      filterDataBySearch(searchValue, searchColumn && searchColumn);
    }
  }, [searchValue, tableData]);

  useEffect(() => {
    onRowSelect && onRowSelect(selectedRowKeys);
  }, [selectedRowKeys, tableData]);

  useEffect(() => {
    if (rowSelection) {
      const selectionColumn = {
        width: 40,
        cellRenderer: MemoizedSelectionCell,
        key: "__selection__",
        rowKey: "key",
        onChange: (keys: Keys, rowData: T, rowIndex: any) =>
          selectionModel.set(keys as Key[])
      };
      console.log(selectionColumn);
    }
  }, []);

  const selectionModel: SelectionModel<Key> = getSelectionModel<Key>(
    multipleSelection != undefined && multipleSelection,
    selectedRowKeys as Key[],
    setSelectedRowKeys
  );

  function selectRow(row?: T) {
    let selection = row ? row.key : undefined;
    if (selection !== undefined) {
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

  //
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

    onRemove(selectedRowKeys).then(() => {
      // Deep copy data to prevent direct state mutation
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
        // performant, but still not noticeably slow.
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
      console.log(itemIndex);
      itemIndex = itemIndex >= currentData.length ? itemIndex - 1 : itemIndex;
      let selection =
        itemIndex < 0 || currentData.length == 0
          ? []
          : [currentData[itemIndex].key];
      console.log(itemIndex, selection);
      selectionModel.set(selection);
    });
  }

  function filterDataBySearch(searchValue: any, columnToSearch?: string) {
    const allTableData = Array.from(tableData);
    if (!searchValue) {
      setFilteredData([]);
    } else if (columnToSearch && searchValue) {
      //console.log(columnToSearch, searchValue);
      setFilteredData(
        allTableData.filter(d =>
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
          .filter((col: any) => col.dataKey)
          .map((col: any) => col.dataKey);
        let searchAllResults: any[] = [];
        for (let i = 0; i < allTableData.length; i++) {
          for (let j = 0; j < columnsWithData.length; j++) {
            if (
              allTableData[i][columnsWithData[j]]
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
        // Removing row selections for now, as they may not exist in the results,
        // but it shouldn't be too difficult to preserve them if necessary
        selectionModel.set([]);
        console.log("Search Results:", searchAllResults);
        setFilteredData(searchAllResults);
      });
    }
  }

  const context = useMemo(() => {
    return {
      columns,
      tableData,
      selectedRowKeys,
      verbose,
      refreshData,
      insertSelectedItem,
      updateSelectedItem,
      removeSelectedItem,
      selectionModel,
      allKeys
    };
  }, [selectedRowKeys, selectionModel, verbose, columns, tableData]);

  function buildContextMenu() {
    return (
      <Menu>{React.Children.toArray(children).reduce(reduceToMenu, [])}</Menu>
    );
  }

  // Renders values of table with context menu
  function renderCell({ cellData }: any) {
    return (
      <ContextMenuDropdown value={cellData} buildMenu={buildContextMenu} />
    );
  }

  function mapColumns(col: any) {
    return {
      ...col,
      cellRenderer: col.render
        ? ({ cellData }: any) => (
            <ContextMenuDropdown
              value={cellData}
              buildMenu={buildContextMenu}
            />
          )
        : renderCell
    };
  }

  function decoratedColumns(): ColumnProps<T>[] | undefined {
    if (disableContextMenu) return columns;
    if (rowSelection) {
      const selectionColumn = {
        // For SOME reason, the box won't check if this element is returned from a render function, but passing the constructor itself works.
        headerRenderer: SelectionHeader,
        width: 50,
        resizable: false,
        cellRenderer: ({ rowData, column, rowIndex }: any) => {
          return (
            <MemoizedSelectionCell
              rowData={rowData}
              column={column}
              rowIndex={rowIndex}
              selected={selectedRowKeys.includes(rowData.key)}
            />
          );
        },
        key: "__selection__",
        rowKey: "key",
        selectedRowKeys,
        onChange: (rowIndex: any, rowData: any) =>
          selectionModel.toggle(rowData.key as Key)
      };
      return [selectionColumn, ...props.columns.map(mapColumns)];
    }
    // Replace rendering of the table values to show context menu
    return props.columns && props.columns.map(mapColumns);
  }

  const overlayRenderer = useCallback(
    () => (
      <>
        {isLoading && (
          <div className="newtable__loader">
            <Spin tip="Loading..." />
          </div>
        )}
      </>
    ),
    [isLoading]
  );

  const emptyRenderer = useCallback(
    () => (
      <div className="empty__wrapper">
        <Icon type="folder" className="empty__icon" />
        <span>No Data</span>
      </div>
    ),
    []
  );

  return (
    <TableViewContext.Provider value={context}>
      <div className="newtable__wrapper" style={{ width: 1000 }}>
        <div className="newtable__header">
          <div style={{ display: "flex" }}>
            {title && title()}
            {children}
            {search && (
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
        <BaseTable
          data={searchValue && filteredData ? filteredData : tableData}
          width={width || 1000}
          height={height || 600}
          columns={decoratedColumns()}
          rowEventHandlers={{
            onClick: ({ rowData, rowIndex, rowKey, event }: any) => {
              selectRow(rowData);
            },
            onContextMenu: (rowData: T) => selectRow(rowData)
          }}
          overlayRenderer={overlayRenderer}
          emptyRenderer={emptyRenderer}
          {...rest}
        />
      </div>
    </TableViewContext.Provider>
  );
}

// Checks if child is an action
function isTableAction(child: TableViewChild): boolean {
  const existingActions = [
    "RemoveTableAction",
    "InsertTableAction",
    "RefreshTableAction",
    "UpdateTableAction"
  ];
  // Not efficient, but reliable!
  return existingActions.includes((child as any).type.name);
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

NewTable.whyDidYouRender = true;

export default React.memo(NewTable);
