import React, {Component} from 'react';
import {Table} from 'antd';
import {ColumnProps} from 'antd/lib/table';
import {TableRowSelection} from "antd/es/table";

export interface DomainEntity {
    id: string
}

export interface TableViewProps<T extends DomainEntity> {

    columns?: ColumnProps<T>[];
    title?: string;
    verboseToolbar?: boolean;
    data?: T[];
}

export type Keys = string[] | number[];

export interface TableViewState<T extends DomainEntity> {
    verboseToolbar?: boolean
    selectedRowKeys: Keys;
}

export const TableViewContext = React.createContext<any>({});

export class TableView<T extends DomainEntity> extends Component<TableViewProps<T>, TableViewState<T>> {

    constructor(props:TableViewProps<T>) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            verboseToolbar: this.props.verboseToolbar
        }

    }

    onSelectChange = (selectedRowKeys: string[] | number[]) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    render() {

        const rowSelection: TableRowSelection<T> = {
            selectedRowKeys: [],
            onChange: this.onSelectChange
        };

        //TODO pass down table props
        return (
            <TableViewContext.Provider value={ this.state}>
                <Table
                    columns={this.props.columns}
                    bordered
                    //loading={true}
                    title={() =>
                        <div>
                            {this.props.title}
                            {this.props.children}
                        </div>
                    }
                    // data={this.props.data}
                    rowSelection={rowSelection}
                />
            </TableViewContext.Provider>
        )
    }

}

export default TableView;