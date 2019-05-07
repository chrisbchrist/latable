import React, {ReactNode, useState} from 'react';
import {Table} from 'antd';
import {ColumnProps} from 'antd/lib/table';
import {DomainEntity, Key} from "../domain/Domain";
import SelectionModel, {getSelectionModel} from "./SelectionModel";

export interface TableViewProps<T extends DomainEntity>  {
    columns?: ColumnProps<T>[];
    title?: string;
    verboseToolbar?: boolean;
    multipleSelection?: boolean;
    dataSource?: () => T[];
    children?: ReactNode;
}

export type OnInsertCallback<T extends DomainEntity> = (item?: T) => T | undefined;
export type OnUpdateCallback<T extends DomainEntity> = (item: T)  => T | undefined;
export type OnRemoveCallback<T extends DomainEntity> = (item: T, onComplete: (success: boolean)=>void )  => void;

export type Keys = string[] | number[];

export interface TableViewContext<T extends DomainEntity> {
    selectedRowKeys: Keys;
    verboseToolbar?: boolean;
    refreshData: () => void;
    insertSelectedItem: (onInsert: OnInsertCallback<T>) => void;
    updateSelectedItem: (onUpdate: OnUpdateCallback<T>) => void;
    removeSelectedItem: (onRemove: OnRemoveCallback<T>) => void;
}

export const TableViewContext = React.createContext<any>({});

export function TableView<T extends DomainEntity>( props: TableViewProps<T> ) {

    const [selectedRowKeys, setSelectedRowKeys] = useState<Keys>([] as Keys);
    const [dataSource, setDataSource]           = useState<T[]>(props.dataSource? props.dataSource(): []);
    const [verboseToolbar]                      = useState(props.verboseToolbar);
    const [loading, setLoading]                 = useState(false);

    const selectionModel: SelectionModel<Key> = getSelectionModel<Key>(
        props.multipleSelection != undefined && props.multipleSelection, selectedRowKeys as Key[], setSelectedRowKeys);

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
        if ( props.dataSource ) {
            try {
                setLoading(true);
                setDataSource(props.dataSource());
            } finally {
                setLoading(false);
            }
        }
    }

    function insertSelectedItem( onInsert: OnInsertCallback<T> ) {
        const selectedItem = selectionModel.isEmpty()? undefined: getItemByKey(selectedRowKeys[0] as Key);
        const insertedItem = onInsert(selectedItem);
        if ( insertedItem ) {
            setDataSource([...dataSource, insertedItem]);
            selectRow(insertedItem)
        }
    }

    function updateSelectedItem( onUpdate: OnUpdateCallback<T>) {
        if ( selectionModel.isEmpty()) return;
        let selectedIndex = dataSource.findIndex( item => item.key === selectedRowKeys[0]);
        if ( selectedIndex >= 0 ) {
            const updatedItem = onUpdate(dataSource[selectedIndex]);
            if (updatedItem) {
                let data = [...dataSource];
                data[selectedIndex] = updatedItem;
                setDataSource(data);
                selectRow(updatedItem);
            }
        }
    }

    function removeSelectedItem( onRemove: OnRemoveCallback<T> ) {

        if ( selectionModel.isEmpty() ) return;

        let itemIndex = dataSource.findIndex( item => item.key === selectedRowKeys[0]);
        if ( itemIndex >= 0 ) {

            onRemove( dataSource[itemIndex], ( success) => {
                if ( success) {
                    let data = [...dataSource];
                    data.splice(itemIndex, 1);
                    setDataSource(data);

                    // calculate appropriate selection index
                    itemIndex = itemIndex >= data.length ? itemIndex - 1 : itemIndex;
                    let selection = itemIndex < 0 || data.length == 0 ? [] : [data[itemIndex].key];
                    setSelectedRowKeys(selection);
                }
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

    //TODO pass down table actionProps
    return (
        <TableViewContext.Provider value={context}>
            <Table
                columns={props.columns}
                bordered
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
                    //FIXME take selection type in consideration
                    onClick: () => selectRow(record),
                })}
            />
        </TableViewContext.Provider>
    )

}

export default React.memo(TableView);