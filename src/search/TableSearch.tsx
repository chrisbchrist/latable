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
    const [value, setValue] = useState<string>("");
    const [columnTitle, setColumnTitle] = useState<string>("All");

    const onClickMenu = (param: ClickParam) => {
        console.log(param.key);
        // AntD does not allow undefined or null menu keys, they will be set as a generic "item_[index]" string,
        //  so this checks if the first key (selection checkbox column) was selected and then sets the search column as undefined
        setSearchColumn(param.key === "item_0" ? undefined : param.key);
        setColumnTitle(param.item.props.title);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const columnMenu = columns && (
        <Menu onClick={onClickMenu}>
            <Menu.Item key={undefined} title="All">
                All
            </Menu.Item>
            {columns.map((col: any) => {
                // For now, limit searchable columns to those that have searchable values in table data
                if (col.dataKey)
                    return (
                        <Menu.Item key={col.dataKey} title={col.title}>
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

    const onClear = (e: React.MouseEvent) => {
        // State setters are async, but order doesn't really matter here
        setValue("");
        setSearchValue("");
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
                value={value}
                onChange={onChange}
                suffix={value && <Icon onClick={onClear} type="close-circle" theme="filled" className="search__clear"/>}
                style={{ width: 200 }}
            />
        </div>
    );
};
