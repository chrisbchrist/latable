import React, {ReactNode, useState} from 'react';
import {Table} from 'antd';
import {ColumnProps} from 'antd/lib/table';
import {DomainEntity} from "../domain/Domain";

export interface TableViewProps<T extends DomainEntity>  {
    columns?: ColumnProps<T>[];
    title?: string;
    verboseToolbar?: boolean;
    dataSource?: T[];
    children?: ReactNode;
}

export type OnInsertCallback<T extends DomainEntity> = (item?: T) => T | undefined;
export type OnUpdateCallback<T extends DomainEntity> = (item: T)  => T | undefined;
export type OnRemoveCallback<T extends DomainEntity> = (item: T)  => boolean;

export interface TableViewContext<T extends DomainEntity> {
    selectedRowKeys: string[] | number[];
    verboseToolbar?: boolean;
    insertSelectedItem: (onInsert: OnInsertCallback<T>) => void
    updateSelectedItem: (onUpdate: OnUpdateCallback<T>) => void
    removeSelectedItem: () => void
}

export const TableViewContext = React.createContext<any>({});

export function TableView<T extends DomainEntity>( props: TableViewProps<T> ) {

    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]|number[]>([]);
    const [dataSource, setDataSource]= useState(props.dataSource? props.dataSource: []);
    const [verboseToolbar]= useState(props.verboseToolbar);

    function setSelection(selection: string[] | number[]) {
        console.log('selectedRowKeys changed: ', selection);
        setSelectedRowKeys(selection);
    }

    function selectRow(row: T) {
        setSelection([row.key]);
    }

    function getItemByKey( key: string | number ): T | undefined {
        return dataSource.find(e => e.key == key);
    }

    function insertSelectedItem( onInsert: OnInsertCallback<T> ) {
        const selectedItem = selectedRowKeys.length == 0? undefined: getItemByKey(selectedRowKeys[0]);
        const insertedItem = onInsert(selectedItem);
        if ( insertedItem ) {
            dataSource.push(insertedItem)
            // setDataSource(dataSource)
            console.log(dataSource)
            selectRow(insertedItem)
        }
    }

    function updateSelectedItem( onUpdate: OnUpdateCallback<T>) {
        //TODO find index first for faster search
        const selectedItem = selectedRowKeys.length == 0? undefined: getItemByKey(selectedRowKeys[0]);
        if (selectedItem) {
            const selectedIndex = selectedRowKeys.length == 0 ? -1 : dataSource.indexOf(selectedItem);
            const updatedItem = onUpdate(selectedItem);
            if (updatedItem) {
                let data = [...dataSource];
                data[selectedIndex] = updatedItem;
                setDataSource(data);
                selectRow(updatedItem)
            }
        }
    }

    function removeSelectedItem() {
        // console.log("Preparing to remove item with key=" + selectedRowKeys[0])
        const item = dataSource.find(e => e.key === selectedRowKeys[0]);
        // console.log("item = " + item)

        if (item) {
            // console.log("Removing item with key=" + item.key)
            const itemIndex = dataSource.indexOf(item);
            let data = dataSource; // should the data be copied?
            data.splice(itemIndex, 1);
            setDataSource(data);
            setSelectedRowKeys([]);
        }
    }

    const context = {
        selectedRowKeys: selectedRowKeys,
        verboseToolbar: verboseToolbar,
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
                //loading={true}
                title={() =>
                    <div>
                        {props.title}
                        {props.children}
                    </div>
                }
                dataSource={props.dataSource}
                rowSelection={{
                    selectedRowKeys: selectedRowKeys,
                    onChange: setSelection
                }}
                onRow={record => ({
                    onClick: () => selectRow(record),
                })}
            />
        </TableViewContext.Provider>
    )

}

export default TableView;