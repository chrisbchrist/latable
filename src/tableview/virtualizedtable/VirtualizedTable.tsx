import React, {useState} from 'react';
import { Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';
import "./VirtualizedTable.css";
import { ResizeWrapper } from "../newtable/ResizeWrapper";


interface VirtualizedTableProps<T> {
    columns: any[];
    loadData?: () => T[];
}



export const VirtualizedTable = <T extends Object>(props: VirtualizedTableProps<T>) => {

    const { columns, loadData } = props;
    const getTableData = () => loadData ? loadData() : [];

    const [tableData] = useState<T[]>(getTableData());

    // Map AntD ColumnProps to react-virtualized Columns
    const renderColumns = (col: any, index: number) => {
        return <Column label={col.title} dataKey={col.dataIndex} width={col.width}/>;
    };

    return (
        <ResizeWrapper>
            {(width: number, height: number) => (
                <Table
                    width={width}
                    height={height}
                    headerHeight={55}
                    rowClassName={({index}: any) => {
                        if (index < 0) {
                        return "headerRow";
                    } else {
                        return index % 2 === 0 ? "evenRow" : "oddRow";
                    }
                    }}
                    headerWidth={200}
                    rowHeight={55}
                    rowCount={tableData.length}
                    rowGetter={({ index }: any) => tableData[index]}
                >
                    {columns.map(renderColumns)}
                </Table>
            )}

        </ResizeWrapper>
    )
};