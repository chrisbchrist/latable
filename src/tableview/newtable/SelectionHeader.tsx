import React, { FunctionComponent } from 'react';
import { Checkbox } from "antd";
import {CheckboxChangeEvent} from "antd/lib/checkbox";

export const SelectionHeader: FunctionComponent<any> = ({ rowData, rowIndex, column }) => {

    const handleChange = (e: CheckboxChangeEvent) => {
        console.log(e.target.checked);
    };

    return (<div>
        <Checkbox onChange={handleChange}/>
    </div>)
}