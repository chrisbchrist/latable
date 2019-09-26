import React, {useEffect, useState} from 'react';
import {Table} from 'antd';
import {DomainEntity, Key, Keys} from "../domain/Domain";
import SelectionModel, {getSelectionModel} from "./SelectionModel";
import {ColumnProps, TableProps} from "antd/es/table";
import Menu from "antd/es/menu";
import {ContextMenuDropdown} from "./ContextMenuDropdown";
import {TableAction} from "./Actions";
import {TableSearch} from "../search/TableSearch";
import {Omit} from "antd/es/_util/type";
import {measureTime} from "../Tools";
import uuid from "uuid";

type TableViewChild = TableAction | React.ReactNode

export interface TableViewProps<T extends DomainEntity> extends Omit<TableProps<T>, 'dataSource'> {
    disableContextMenu?: boolean  // disables context action menu
    verboseToolbar?: boolean;     // show titles of the action buttons
    multipleSelection?: boolean;  // allow multiple selection
    loadData?: () => T[];         // function to load data into the table
    children?: TableViewChild | TableViewChild[],
    onRowSelect?: (selectedRowKeys: Keys) => any; //Callback function run when selected row keys change to expose
                                                  // keys for additional functionality until custom table actions can be implemented
    search?: boolean, // enables search dialog to filter data
}

// In following API fulfilled promise defines success, rejected promise defines failure
export type InsertCallback<T extends DomainEntity> = (item?: T) => Promise<T>;
export type UpdateCallback<T extends DomainEntity> = (item: T)  => Promise<T>;
export type RemoveCallback<T extends DomainEntity> = (item: T)  => Promise<boolean>;

export interface TableViewContext<T extends DomainEntity> {
    selectedRowKeys: Keys;
    verboseToolbar?: boolean;
    refreshData: () => void;
    insertSelectedItem: (onInsert: InsertCallback<T>) => void;
    updateSelectedItem: (onUpdate: UpdateCallback<T>) => void;
    removeSelectedItem: (onRemove: RemoveCallback<T>) => void;
}

export const TableViewContext = React.createContext<any>({});

export function TableView<T extends DomainEntity>( props: TableViewProps<T> ) {

    const {columns, loading, title, rowSelection, onRow, ...otherProps } = props;
    const getTableData = () => props.loadData ? props.loadData() : [];

    const [selectedRowKeys, setSelectedRowKeys] = useState<Keys>([]);
    const [tableData, setTableData]             = useState<T[]>(getTableData());
    const [filteredData, setFilteredData]       = useState<T[]>([]); // Results of search
    const [verboseToolbar, setVerboseToolbar]   = useState(props.verboseToolbar);
    const [isLoading, setLoading]               = useState(props.loading);
    const [searchValue, setSearchValue]         = useState<string>("");
    const [searchColumn, setSearchColumn]       = useState<string | undefined>(undefined); // Column to search in if specified

    // Make sure certain properties can be changed dynamically can be changed dynamically
    // Since verboseToolbar & loading state is never called in the TableView component
    // we have to force it on change of related prop
    useEffect(() => {setVerboseToolbar(props.verboseToolbar)},[props.verboseToolbar]);
    useEffect(() => {setLoading(props.loading)},[props.loading]);
    useEffect(() => {setTableData(getTableData())},[props.loadData]);

    // Updates search results when a new search is run or when the dataset is altered
    useEffect(() => {
        console.log(searchValue);
        if (searchValue) {
            filterDataBySearch(searchValue, searchColumn && searchColumn);
        }

    }, [searchValue, tableData]);

    useEffect(() => {
        props.onRowSelect && props.onRowSelect(selectedRowKeys);
    }, [selectedRowKeys]);

    const selectionModel: SelectionModel<Key> = getSelectionModel<Key>(
        props.multipleSelection != undefined && props.multipleSelection,
        selectedRowKeys as Key[], setSelectedRowKeys);

    function selectRow(row?: T) {
        let selection = row? row.key: undefined;
        if ( selection ) {
            selectionModel.toggle(selection)
        }
    }

    function getItemByKey( key: Key): T | undefined {
        return tableData.find(e => e.key == key);
    }

    function refreshData() {
        if ( props.loadData ) {
            try {
                setLoading(true);
                setTableData(props.loadData());
            } finally {
                setLoading(false);
            }
        }
    }

    //
    function insertSelectedItem( onInsert: InsertCallback<T> ) {
        const selectedItem = selectionModel.isEmpty()? undefined: getItemByKey(selectedRowKeys[0] as Key);
        onInsert(selectedItem).then( insertedItem => {
            if (insertedItem) {

                // setTableData([...tableData, insertedItem]);

                // Seems to work fine with hooks
                tableData.push(insertedItem);

                // select newly inserted item
                selectionModel.set([insertedItem.key])
            }
        });
    }

    function updateSelectedItem( onUpdate: UpdateCallback<T>) {
        if ( selectionModel.isEmpty()) return;
        let selectedIndex = tableData.findIndex( item => item.key === selectedRowKeys[0]);
        if ( selectedIndex >= 0 ) {
            onUpdate(tableData[selectedIndex]).then( updatedItem => {
                if (updatedItem) {

                    // let data = [...tableData];
                    // data[selectedIndex] = updatedItem;
                    // setTableData(data);

                    // Seems to work fine with the hooks
                    tableData[selectedIndex] = updatedItem;

                    // make sure selection stays on the same item
                    selectionModel.set([updatedItem.key])
                }
            });
        }
    }

    function removeSelectedItem( onRemove: RemoveCallback<T> ) {

        if ( selectionModel.isEmpty() ) return;

        let itemIndex = tableData.findIndex( item => item.key === selectedRowKeys[0]);
        if ( itemIndex < 0 ) return;

        onRemove(tableData[itemIndex]).then(() => {

            const newTableData = Array.from(tableData);
            measureTime("Table item removal", () => {

                // let ndata = [...tableData];
                // ndata.splice(itemIndex, 1);
                // setTableData(ndata);

                // Following goes again "no direct state update" rule, but it works fine with hooks and...
                // The removal operation is almost 1000x faster, which makes a huge visual difference for big data sets
                // tableData.splice(itemIndex, 1);
                // Using splice prevents React from registering a change to the tableData when an item is removed, so
                // any operation that's dependent upon that state change to trigger an update will not execute.


                newTableData.splice(itemIndex, 1);
                setTableData(newTableData);

            });

            // Calculate appropriate selection index.  If table is displaying a filtered list of data, ensure the new index
            // exists in the current dataset. Since setState is async, tableData may not be
            // updated when this is calculated, so we can use the new cloned data.
                const currentData = (searchValue && filteredData) ? filteredData : newTableData;
                console.log(itemIndex);
                itemIndex = itemIndex >= currentData.length ? itemIndex - 1 : itemIndex;
                let selection = itemIndex < 0 || currentData.length == 0 ? [] : [currentData[itemIndex].key];
                console.log(itemIndex, selection);
                selectionModel.set(selection);


        })

    }

    function filterDataBySearch(searchValue: any, columnToSearch?: string) {
        const allTableData = Array.from(tableData);
        console.log("Filtering:", searchValue, columnToSearch);
        if (!searchValue) {
            setFilteredData([]);
        } else if (columnToSearch && searchValue) {
            //console.log(columnToSearch, searchValue);
                setFilteredData(allTableData.filter(d =>
                    d[columnToSearch]
                        .toString()
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                ))
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
                console.log(searchAllResults);
                setFilteredData(searchAllResults);
            });
        }
    }


    const context = {
        selectedRowKeys: selectedRowKeys,
        verboseToolbar: verboseToolbar,
        refreshData: refreshData,
        insertSelectedItem: insertSelectedItem,
        updateSelectedItem: updateSelectedItem,
        removeSelectedItem: removeSelectedItem,

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
        // Replace rendering of the table values to show context menu
        return props.columns && props.columns.map(mapColumns);
    }

    return (

        <TableViewContext.Provider value={context}>
            <Table
                {... otherProps}
                columns={decoratedColumns()}
                loading={isLoading}
                title={(currentPageData) => (
                    <div>
                        <div>{props.title && props.title(currentPageData)}</div>
                        <div style={{ display: "flex" }}>
                            {props.children}
                            {props.search && <TableSearch searchValue={searchValue}
                                                          setSearchValue={setSearchValue}
                                                          columns={columns}
                                                          searchColumn={searchColumn}
                                                          setSearchColumn={setSearchColumn}
                            />}
                        </div>
                    </div>
                )}
                dataSource={(searchValue && filteredData) ? filteredData : tableData}
                rowSelection={{
                    selectedRowKeys: selectedRowKeys,
                    type: props.multipleSelection ? 'checkbox': 'radio',
                    onChange: (keys) => selectionModel.set(keys as Key[])
                }}
                onRow={(record) => ({
                    onClick: () => selectRow(record),
                    onContextMenu: () => selectRow(record),
                })}
            />
        </TableViewContext.Provider>
    )

}

// Checks if child is an action
function isTableAction( child: TableViewChild ): boolean {
    // TODO Find a more reliable way to check the type
    return (child as any).type.name.endsWith("TableAction")
}

// Reduces table view children to menu items
// Makes sure that only one sequential divider shown
function reduceToMenu( children: TableViewChild[], child: TableViewChild ): TableViewChild[] {
    switch(true) {
        case isTableAction(child): {
            children.push(React.cloneElement((child as TableAction), {key:uuid()}));
            break;
        }
        case children.length == 0 || isTableAction(children[children.length-1]): {
            children.push(<Menu.Divider key={uuid()} />);
            break;
        }
    }
    return children
}

export default React.memo(TableView);
