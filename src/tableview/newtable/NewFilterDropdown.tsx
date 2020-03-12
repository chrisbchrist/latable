import React, {FunctionComponent } from 'react';
import {Select} from "antd";

export const NewFilterDropdown: FunctionComponent<any> = ({activeFilter, onChange, filters}) => {

    return (
        <Select
            placeholder="Filter By"
            value={activeFilter}
            onChange={onChange}
            style={{ minWidth: 175 }}
        >
            <Select.Option value={"All"}>
                All
            </Select.Option>
            {filters.map((filter: any, i: number) => (
                <Select.Option value={i} key={filter.label}>
                    {filter.label}
                </Select.Option>
            ))}
        </Select>
    )
}