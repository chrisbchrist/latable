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
export type OnRemoveCallback<T extends DomainEntity> = (item: T, onComplete: (success: boolean)=>void )  => void;

export type Keys = string[] | number[];
export type Key  = string & number;

export interface TableViewContext<T extends DomainEntity> {
    selectedRowKeys: Keys;
    verboseToolbar?: boolean;
    insertSelectedItem: (onInsert: OnInsertCallback<T>) => void
    updateSelectedItem: (onUpdate: OnUpdateCallback<T>) => void
    removeSelectedItem: (onRemove: OnRemoveCallback<T>) => void
}

export const TableViewContext = React.createContext<any>({});

export function TableView<T extends DomainEntity>( props: TableViewProps<T> ) {

    const [selectedRowKeys, setSelectedRowKeys] = useState<Keys>([]);
    const [dataSource, setDataSource]= useState(props.dataSource? props.dataSource: []);
    const [verboseToolbar]= useState(props.verboseToolbar);

    const selectionModel = props.multipleSelection?
        new MultipleSelectionModel( selectedRowKeys, setSelectedRowKeys):
        new SingleSelectionModel( selectedRowKeys, setSelectedRowKeys);

    function selectRow(row?: T) {
        let selection = row? row.key: undefined;
        if ( selection ) {
            selectionModel.toggle(selection as Key)
        }
    }

    function getItemByKey( key: string | number ): T | undefined {
        return dataSource.find(e => e.key == key);
    }

    function insertSelectedItem( onInsert: OnInsertCallback<T> ) {
        const selectedItem = selectionModel.isEmpty()? undefined: getItemByKey(selectedRowKeys[0]);
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
                    onChange: (keys) => selectionModel.set(keys)
                }}
                onRow={(record) => ({
                    //FIXME take selection type in consideration
                    onClick: () => selectRow(record),
                })}
            />
        </TableViewContext.Provider>
    )

}

export default TableView;

interface SelectionModel {

    isEmpty(): boolean
    clear(): void
    contains(test: Key): boolean
    get(): Keys
    set(newSelection: Keys): void
    add(newSelection: Keys): void
    remove(selection: Keys): void

}



class MultipleSelectionModel implements SelectionModel {

    constructor( protected current: Keys, protected setter: (s: Keys) => void ){}

    isEmpty(): boolean  {
        return this.current.length == 0;
    }

    contains(key: Key): boolean {
        return this.current.indexOf(key) >= 0;
    }

    get(): Keys {
        return this.current
    }

    clear(): void {
        this.setter([])
    }

    set(newSelection: Keys): void {
        this.setter( newSelection )
    }

    add(newSelection: Keys): void {
        this.setter( ([...this.current, ...newSelection]) as Keys)
    }

    remove(selection: Keys): void {
        let data = [...this.current];
        this.setter( (data.filter( e => selection.indexOf(e as Key) < 0)) as Keys )
    }

    toggle( key: Key) {
        if (this.contains(key)) {
            this.remove([key])
        } else {
            this.add([key])
        }
    }

}


class SingleSelectionModel extends MultipleSelectionModel {

    constructor( current: Keys, setter: (s: Keys) => void ){
        super(current, setter)
    }

    set(newSelection: Keys): void {
        this.setter( (newSelection && newSelection.length > 0? [newSelection[0]]: []) as Keys )
    }

    add(newSelection: Keys): void {
        this.set(newSelection)
    }

}