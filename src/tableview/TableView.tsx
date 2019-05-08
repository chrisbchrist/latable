import React, {useState} from 'react';
import {Table} from 'antd';
import {DomainEntity, Key} from "../domain/Domain";
import SelectionModel, {getSelectionModel} from "./SelectionModel";
import {TableProps} from "antd/es/table";

export interface TableViewProps<T extends DomainEntity> extends TableProps<T> {
    verboseToolbar?: boolean;     // show titles of the action buttons
    multipleSelection?: boolean;  // allow mutiple selection
    loadData?: () => T[];         // function to load data into the table
}

export type InsertCallback<T extends DomainEntity> = (item?: T) => Promise<T | undefined>;
export type UpdateCallback<T extends DomainEntity> = (item: T)  => Promise<T | undefined>;
export type RemoveCallback<T extends DomainEntity> = (item: T)  => Promise<boolean>;

export type Keys = string[] | number[];

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

    const [selectedRowKeys, setSelectedRowKeys] = useState<Keys>([] as Keys);
    const [dataSource, setDataSource]           = useState<T[]>(props.loadData? props.loadData(): []);
    const [verboseToolbar]                      = useState(props.verboseToolbar);
    const [loading, setLoading]                 = useState(false);

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
                selectRow(insertedItem)
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
                    selectRow(updatedItem);
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
                    setSelectedRowKeys(selection);
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

    //TODO pass down table actionProps
    return (

        <TableViewContext.Provider value={context}>
            <Table
                {... props}
                columns={props.columns}
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
                })}
            />
        </TableViewContext.Provider>
    )

}

export default React.memo(TableView);