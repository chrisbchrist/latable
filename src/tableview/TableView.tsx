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
    verboseToolbar?: boolean
    selectedRowKeys: string[] | number[];
}

export const TableViewContext = React.createContext<any>({});

export function TableView<T extends DomainEntity>( props: TableViewProps<T> ) {

//    const [state, setState] = useState<TableViewState<T>>({ selectedRowKeys:[], verboseToolbar: props.verboseToolbar});
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]|number[]>([]);
    const [verboseToolbar]= useState(props.verboseToolbar);

    const setSelection = (selection: string[] | number[]) => {
        console.log('selectedRowKeys changed: ', selection);
        setSelectedRowKeys(selection);
    };

    const selectRow = (row: T) => {
        setSelection([row.key]);
    };

    const context = { selectedRowKeys: selectedRowKeys, verboseToolbar: verboseToolbar};

    //TODO pass down table props
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