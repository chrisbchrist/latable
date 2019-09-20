import React, {
    FunctionComponent,
    useState
} from "react";
import { Input, Dropdown, Icon, Menu } from "antd";
import { ClickParam } from "antd/es/menu";
import {ColumnProps} from "antd/lib/table";

interface TableSearchProps {
    searchValue?: string;
    setSearchValue: (searchValue: string) => void;
    columns?: ColumnProps<any>[];
    searchColumn: string | undefined;
    setSearchColumn: (searchColumn: string | undefined) => void;
}

const Search = Input.Search;

export const TableSearch: FunctionComponent<TableSearchProps> = ({ searchValue, setSearchValue, columns, searchColumn, setSearchColumn, ...props }) => {
    const [columnTitle, setColumnTitle] = useState<string>("All");

    const onClickMenu = (param: ClickParam) => {
        console.log(param.key);
        // AntD does not allow undefined or null menu keys, they will be set as a generic "item_index" string,
        //  so this checks if the first key was selected and then sets the search column as undefined
        setSearchColumn(param.key === "item_0" ? undefined : param.key);
        setColumnTitle(param.item.props.title);
    };

    const columnMenu = columns && (
        <Menu onClick={onClickMenu}>
            <Menu.Item key={undefined} title="All">
                All
            </Menu.Item>
            {columns.map((col: any) => {
                // For now, limit searchable columns to those that have searchable values in table data
                if (col.dataIndex)
                    return (
                        <Menu.Item key={col.dataIndex} title={col.title}>
                            {col.title}
                        </Menu.Item>
                    );
                return true;
            })}
        </Menu>
    );

    const onSearch = (value: any) => {
        setSearchValue(value);
    };

    return (
        <div style={{ marginLeft: "auto" }} {...props}>
            {columns && <Dropdown className="filter" overlay={columnMenu}>
                <a className="ant-dropdown-link" style={{ marginRight: 10 }}>
                    Search In: {columnTitle} <Icon type="down" />
                </a>
            </Dropdown>}
            <Search
                placeholder="Enter Title"
                onSearch={onSearch}
                allowClear
                style={{ width: 200 }}
            />
        </div>
    );
};