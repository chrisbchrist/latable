import React, { Component, Fragment } from 'react';
import { Table, Button, Row, Col } from 'antd';
import { ColumnProps } from 'antd/lib/table';

interface Action {
    text: string,
    perform: () => void
}

interface TableViewProps<T> {
    columns?: ColumnProps<T>[];
    actions?: Action[];
}

export class TableView<T> extends Component<TableViewProps<T>, any> {

    constructor( props: TableViewProps<T> ) {
        super(props)
    }

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
                    <Button className="toolbar-button">{a.text}</Button> 
                ): null
        )
    }

}

export default TableView;