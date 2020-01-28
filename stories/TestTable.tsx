import React, {FunctionComponent, useState} from 'react';
import {TableView} from "../src";
import {Keys} from "../src/domain/Domain";
import {Badge, Button} from "antd";
import {ExportTableAction} from "../src/tableview/Actions";

const columns = [
    {title: "ID", dataIndex: "key"},
    {title: "Name", dataIndex: "name"}
];

const testData = [
    { key: 1, name: "Jimbo Williamson"},
    {key: 2, name: "Mr. Funnyface"},
    {key: 3, name: "Bilbo Thriftworth"},
    { key: 4, name: "Rutherford Wonkington"},
    { key: 5, name: "Constance Bunker"},
    { key: 6, name: "Widdlepop Silversmith"}
]

export const TestTable: FunctionComponent<any> = (props) => {
    const {data, ...rest} = props;

    const [selectedRowKeys, setSelectedRowKeys] = useState<Keys>([]);

    const onRowSelect = (selectedKeys: Keys) => {
        setSelectedRowKeys(selectedKeys)
    };

    return (<TableView
        columns={columns}
        loading={false}
        loadData={() => testData || []}
        verboseToolbar={true}
        scroll={{ x: 1400 }}
        disableContextMenu={true}
        onRowSelect={onRowSelect}
        multipleSelection={true}
        search={true}
        filters={[
            {
                label: "Contains W",
                condition: (record: any) => record.name.includes("W")
            }
        ]}
        pagination={false}
        {...rest}
    >
        <Button
            style={{ marginRight: "1mm" }}
            disabled={selectedRowKeys.length === 0}
            type="primary"
            icon="sync"
            onClick={(e: any) => console.log(selectedRowKeys)}
        >
            Selected
            {selectedRowKeys.length > 0 && (
                <Badge
                    count={selectedRowKeys.length}
                    style={{
                        backgroundColor: "#fff",
                        color: "#999",
                        boxShadow: "1px 1px 4px #d9d9d9 inset",
                        marginLeft: 7
                    }}
                />
            )}
        </Button>
        <ExportTableAction
            fileName={"I am Excel, my friends call me XL"}
        />
    </TableView>)
}