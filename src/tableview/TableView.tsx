import React, {useEffect, useState} from 'react';
import {Table} from 'antd';
import {DomainEntity, Key, Keys} from "../domain/Domain";
import SelectionModel, {getSelectionModel} from "./SelectionModel";
import {ColumnProps, TableProps} from "antd/es/table";
import Menu from "antd/es/menu";
import {ContextMenuDropdown} from "./ContextMenuDropdown";
import {TableAction} from "./Actions";

export interface TableViewProps<T extends DomainEntity> extends TableProps<T> {
    disableContextMenu?: boolean  // disables context action menu
    verboseToolbar?: boolean;     // show titles of the action buttons
    multipleSelection?: boolean;  // allow multiple selection
    loadData?: () => T[];         // function to load data into the table
    children?: (TableAction | React.ReactNode)[]
}

export type InsertCallback<T extends DomainEntity> = (item?: T) => Promise<T | undefined>;
export type UpdateCallback<T extends DomainEntity> = (item: T)  => Promise<T | undefined>;
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

    const [selectedRowKeys, setSelectedRowKeys] = useState<Keys>([]);
    const [dataSource, setDataSource]           = useState<T[]>(props.loadData? props.loadData(): []);
    const [verboseToolbar, setVerboseToolbar]   = useState(props.verboseToolbar);
    const [loading, setLoading]                 = useState(false);

    // Make sure toolbar verbosity can be changed dynamically
    // Since verboseToolbar state is never called in the TableView component
    // we have to force it on change of related prop
    useEffect(() => {setVerboseToolbar(props.verboseToolbar)},[props.verboseToolbar]);


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
        return dataSource.find(e => e.key == key);
    }

    function refreshData() {
        if ( props.loadData ) {
            try {
                setLoading(true);
                setDataSource(props.loadData());
            } finally {
                setLoading(false);
            }
        }
    }

    function insertSelectedItem( onInsert: InsertCallback<T> ) {
        const selectedItem = selectionModel.isEmpty()? undefined: getItemByKey(selectedRowKeys[0] as Key);
        onInsert(selectedItem).then( insertedItem => {
            if (insertedItem) {
                setDataSource([...dataSource, insertedItem]);
                // select newly inserted item
                selectionModel.set([insertedItem.key])
            }
        });
    }

    function updateSelectedItem( onUpdate: UpdateCallback<T>) {
        if ( selectionModel.isEmpty()) return;
        let selectedIndex = dataSource.findIndex( item => item.key === selectedRowKeys[0]);
        if ( selectedIndex >= 0 ) {
            onUpdate(dataSource[selectedIndex]).then( updatedItem => {
                if (updatedItem) {
                    let data = [...dataSource];
                    data[selectedIndex] = updatedItem;
                    setDataSource(data);

                    // make sure selection stays on the same item
                    selectionModel.set([updatedItem.key])
                }
            });
        }
    }

    function removeSelectedItem( onRemove: RemoveCallback<T> ) {

        if ( selectionModel.isEmpty() ) return;

        let itemIndex = dataSource.findIndex( item => item.key === selectedRowKeys[0]);
        if ( itemIndex >= 0 ) {

            onRemove( dataSource[itemIndex] ).then( shouldRemove => {
                if ( shouldRemove) {
                    let data = [...dataSource];
                    data.splice(itemIndex, 1);
                    setDataSource(data);

                    // calculate appropriate selection index
                    itemIndex = itemIndex >= data.length ? itemIndex - 1 : itemIndex;
                    let selection = itemIndex < 0 || data.length == 0 ? [] : [data[itemIndex].key];
                    selectionModel.set(selection);
                }
            })
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


    // TODO Find a more reliable way to check the type
    function isTableAction( c: any ): boolean {
        // important c has to be of type `any` for compiler to be happy
        return c.type.name.endsWith("TableAction")
    }


    function buildMenu() {

        return (
            <Menu>
                {
                    React.Children.map(props.children,c => {
                        // TODO Show dividers, but only one if there multiple in the row
                        return isTableAction(c) ? React.cloneElement((c as TableAction), {}) : null;//<Menu.Divider/>;
                    })
                }
            </Menu>
        )
    }

    // Renders values of table with context menu
    function renderCell(value:any) {
        return <ContextMenuDropdown value={value} buildMenu={buildMenu}/>
    }

    function decoratedColumns(): ColumnProps<T>[] | undefined {
        if ( props.disableContextMenu ) return props.columns;
        // Replace rendering of the table values to show context menu
        return props.columns && props.columns.map( c => ({ ...c, render: renderCell}) )
    }

    return (

        <TableViewContext.Provider value={context}>
            <Table
                {... props}
                columns={decoratedColumns()}
                pagination={false}
                loading={loading}
                title={() =>
                    <div>
                        {props.title}
                        {props.children}
                    </div>
                }
                dataSource={dataSource}
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

export default React.memo(TableView);