import React, {ReactNode, useState} from 'react';
import {Table} from 'antd';
import {ColumnProps} from 'antd/lib/table';

export interface DomainEntity {
    key: string
}

export interface TableViewProps<T extends DomainEntity>  {

    columns?: ColumnProps<T>[];
    title?: string;
    verboseToolbar?: boolean;
    dataSource?: T[];
    children?: ReactNode;
}

export interface TableViewState<T extends DomainEntity> {
    verboseToolbar?: boolean;
    selectedRowKeys: string[] | number[];
    dataSource: T[];
}

export interface TableViewContext<T extends DomainEntity> extends TableViewState<T> {
    setSelectedRowKeys: ( selection: string[] | number[]) => void
    setDataSource: ( data: T[]) => void
}

export const TableViewContext = React.createContext<any>({});

export function TableView<T extends DomainEntity>( props: TableViewProps<T> ) {

    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]|number[]>([]);
    const [verboseToolbar]= useState(props.verboseToolbar);
    const [dataSource, setDataSource]= useState(props.dataSource? props.dataSource: []);

    const setSelection = (selection: string[] | number[]) => {
        console.log('selectedRowKeys changed: ', selection);
        setSelectedRowKeys(selection);
    };

    const selectRow = (row: T) => {
        setSelection([row.key]);
    };

    const context = {
        selectedRowKeys: selectedRowKeys,
        verboseToolbar: verboseToolbar,
        dataSource: dataSource,
        setSelectedRowKeys: setSelectedRowKeys,
        setDataSource: setDataSource,
    };

    //TODO pass down table actionProps
    return (
        <TableViewContext.Provider value={context}>
            <Table
                columns={props.columns}
                bordered
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