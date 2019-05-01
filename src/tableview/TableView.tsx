import React, { Component, Fragment } from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import {TableAction} from "./Actions";
import ActionButton from "../ActionButton";
import {observer} from "mobx-react";

interface TableViewProps<T> {
    columns?: ColumnProps<T>[];
    actions?: TableAction<T>[];
    title?: string;
    verboseToolbar?: boolean;

    data?: T[];
}

@observer
export class TableView<T> extends Component<TableViewProps<T>, any> {

    private readonly tableRef: React.RefObject<Table<T>> = React.createRef();

    state = {
        selectedRowKeys: [], // Check here to configure the default column
    };
    //
    // onSelectChange = (selectedRowKeys: T[]) => {
    //     console.log('selectedRowKeys changed: ', selectedRowKeys);
    //     this.setState({ selectedRowKeys });
    // }

    render() {

        // const rowSelection: RowSelectionType = {
        //     selectedRowKeys: [],
        //     onChange: this.onSelectChange
        // }

        const actions = this.props.actions? this.props.actions: [];

        return (
            <Fragment>
                <Table
                    ref={this.tableRef}
                    columns={this.props.columns}
                    bordered
                    //loading={true}
                    title={ () =>
                        <div>
                            {this.props.title}
                            {
                                actions.map(a => {
                                    a.source = this;
                                    return <ActionButton action={a} verbose={this.props.verboseToolbar}/>
                                })
                            }
                        </div>
                    }

                    // data={this.props.data}
                    // rowSelection={rowSelection}
                />
            </Fragment>
        )
    }

    public selectedRowCount(): number {
        return this.tableRef.current? this.state.selectedRowKeys.length: 0;
    }

}

export default TableView;