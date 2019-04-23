import React, { Component, Fragment } from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import {TableAction} from "./tableview/Actions";
import ActionButton from "./ActionButton";
import {ActionProps} from "./Action";

interface TableViewProps<T> {
    columns?: ColumnProps<T>[];
    actions: TableAction<T>[];
    toolbarExpanded?: boolean
}

export class TableView<T> extends Component<TableViewProps<T>, any> {

    private readonly tableRef: React.RefObject<Table<T>> = React.createRef();

    render() {
        return (
            <Fragment>
                <Table
                    ref={this.tableRef}
                    columns={this.props.columns}
                    bordered 
                    title={ () => this.renderToolbar() }
                />
            </Fragment>
        )
    }

    private renderToolbar() {
        return (
            this.props.actions.map( a => <ActionButton {...a as ActionProps }/> )
        )
    }

}

export default TableView;