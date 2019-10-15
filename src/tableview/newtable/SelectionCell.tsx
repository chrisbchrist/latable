import React, { FunctionComponent } from 'react';
import { Checkbox } from "antd";
import {CheckboxChangeEvent} from "antd/lib/checkbox";
import whyDidYouRender from "@welldone-software/why-did-you-render";

whyDidYouRender(React);

interface SelectionCellProps {
    rowData: any;
    rowIndex: any;
    column: any;
    selected: boolean;
    whyDidYouRender?: any;
}

export const SelectionCell: FunctionComponent<SelectionCellProps> = ({ rowData, rowIndex, column, selected }) => {

    const handleChange = (e: CheckboxChangeEvent) => {
        console.log(e.target.checked);
        const { onChange } = column;
        onChange(rowIndex, rowData);
    };

    return (<div style={{ display: 'flex', justifyContent: 'center' }}>
        <Checkbox checked={selected} onChange={handleChange}/>
    </div>)
};

SelectionCell.whyDidYouRender = true;

export const MemoizedSelectionCell = React.memo(SelectionCell);
