import React, { Component, Fragment } from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import ToolbarButton, {ActionProps} from "./ActionButton";

interface TableViewProps<T> {
    columns?: ColumnProps<T>[];
    actions?: ActionProps[];
}

export class TableView<T> extends Component<TableViewProps<T>, any> {

    render() {
        return (
            <Fragment>
                <Table columns={this.props.columns} 
                    bordered 
                    title={ () => this.renderToolbar() }
                />
            </Fragment>
        )
    }

    private renderToolbar() {
        return (
            this.props.actions? 
                this.props.actions.map( a =>
                    //text={a.text} icon={a.text} extended={a.extended} perform={a.perform}
                    <ToolbarButton {...a} />)
                : null
        )
    }

}

export default TableView;