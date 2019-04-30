import React, { Component, Fragment } from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import {TableAction} from "./Actions";
import ActionButton from "../ActionButton";
import {ActionProps} from "../Action";

interface TableViewProps<T> {
    columns?: ColumnProps<T>[];
    actions: TableAction<T>[];
    title?: string;
    verboseToolbar?: boolean;
}

export class TableView<T> extends Component<TableViewProps<T>, any> {

    // private readonly tableRef: React.RefObject<Table<T>> = React.createRef();

    render() {
        return (
            <Fragment>
                <Table
                    // ref={this.tableRef}
                    columns={this.props.columns}
                    bordered
                    //loading={true}
                    title={ () =>
                        <div>
                            {this.props.title}
                            {
                                this.props.actions.map(a => {
                                    a.source = this;
                                    return <ActionButton {...a as ActionProps} verbose={this.props.verboseToolbar}/>
                                })
                            }
                        </div>
                    }
                />
            </Fragment>
        )
    }

}

export default TableView;