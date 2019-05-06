import React, {ReactNode, useState} from 'react';
import {Table} from 'antd';
import {ColumnProps} from 'antd/lib/table';
import {DomainEntity} from "../domain/Domain";

export interface TableViewProps<T extends DomainEntity>  {
    columns?: ColumnProps<T>[];
    title?: string;
    verboseToolbar?: boolean;
    multipleSelection?: boolean;
    dataSource?: T[];
    children?: ReactNode;
}

export type OnInsertCallback<T extends DomainEntity> = (item?: T) => T | undefined;
export type OnUpdateCallback<T extends DomainEntity> = (item: T)  => T | undefined;
export type OnRemoveCallback<T extends DomainEntity> = (item: T, onCompletion: (success: boolean)=>void )  => void;

export interface TableViewContext<T extends DomainEntity> {
    selectedRowKeys: string[] | number[];
    verboseToolbar?: boolean;
    insertSelectedItem: (onInsert: OnInsertCallback<T>) => void
    updateSelectedItem: (onUpdate: OnUpdateCallback<T>) => void
    removeSelectedItem: (onRemove: OnRemoveCallback<T>) => void
}

export const TableViewContext = React.createContext<any>({});

export function TableView<T extends DomainEntity>( props: TableViewProps<T> ) {

    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]|number[]>([]);
    const [dataSource, setDataSource]= useState(props.dataSource? props.dataSource: []);
    const [verboseToolbar]= useState(props.verboseToolbar);

    function setSelection(selection: string[] | number[]) {
        console.log('selection updated: ', selection);
        setSelectedRowKeys(selection);
    }

    function selectRow(row: T) {
        setSelection(row? [row.key]: []);
    }

    function isSelectionEmpty() {
       return selectedRowKeys === undefined || selectedRowKeys.length == 0;
    }

    function getItemByKey( key: string | number ): T | undefined {
        return dataSource.find(e => e.key == key);
    }

    function insertSelectedItem( onInsert: OnInsertCallback<T> ) {
        const selectedItem = isSelectionEmpty()? undefined: getItemByKey(selectedRowKeys[0]);
        const insertedItem = onInsert(selectedItem);
        if ( insertedItem ) {
            setDataSource([...dataSource, insertedItem]);
            selectRow(insertedItem)
        }
    }

    function updateSelectedItem( onUpdate: OnUpdateCallback<T>) {
        if ( isSelectionEmpty() ) return;
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

        if ( isSelectionEmpty() ) return;

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
                dataSource={dataSource}
                rowSelection={{
                    selectedRowKeys: selectedRowKeys,
                    type: props.multipleSelection ? 'checkbox': 'radio',
                    onChange: setSelection
                }}
                onRow={(record) => ({
                    //FIXME take selection type in consideration
                    onClick: () => isSelectionEmpty()? selectRow(record): setSelection([]) ,
                })}
            />
        </TableViewContext.Provider>
    )

}

export default TableView;