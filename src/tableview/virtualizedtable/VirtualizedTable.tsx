import React, { useCallback, useState } from "react";
import { Column, Table } from "react-virtualized";
import "react-virtualized/styles.css";
import "./VirtualizedTable.css";
import { ResizeWrapper } from "../newtable/ResizeWrapper";

interface VirtualizedTableProps<T> {
  columns: any[];
  loadData?: () => T[];
}

export const VirtualizedTable = <T extends Object>(
  props: VirtualizedTableProps<T>
) => {
  const { columns, loadData } = props;
  const getTableData = () => (loadData ? loadData() : []);

  const [tableData] = useState<T[]>(getTableData());

  // Map AntD ColumnProps to react-virtualized Columns
  const renderColumns = (col: any, index: number) => {
    return (
      <Column
        renderCell={col.renderCell}
        label={col.title}
        dataKey={col.dataIndex}
        width={col.width}
      />
    );
  };

  const getRowClassName = useCallback(({ index }: any) => {
    if (index < 0) {
      return "headerRow";
    } else {
      return index % 2 === 0 ? "evenRow" : "oddRow";
    }
  }, []);

  const rowGetter = useCallback(({ index }: any) => tableData[index], [tableData]);

  return (
    <ResizeWrapper>
      {(width: number, height: number) => (
        <Table
          width={width}
          height={height}
          headerHeight={55}
          rowClassName={getRowClassName}
          headerWidth={200}
          rowHeight={55}
          rowCount={tableData.length}
          rowGetter={rowGetter}
        >
          {columns.map(renderColumns)}
        </Table>
      )}
    </ResizeWrapper>
  );
};
