import React, {FunctionComponent, useState} from 'react';
import {NewTable} from "../src/tableview/NewTable";
import {NewExportTableAction} from "../src/tableview/newtable/NewActions";
import {Key} from "../src/domain/Domain";
import {Badge, Button} from "antd";

const newColumns = [
    {
        title: "First Name",
        dataKey: "firstName",
        key: "firstName",
        width: 150,
    },
    {
        title: "Last Name",
        dataKey: "lastName",
        key: "lastName",
        width: 150,
    },
    {
        title: "Age",
        dataKey: "age",
        key: "age",
        width: 150,
    },
    {
        title: "Profession",
        dataKey: "profession",
        key: "profession",
        width: 150,
        sortable: true
    }
];

function generatePeople(n: number) {
    const instruments = ['Accordion Virtuoso', 'Hot Pocket Manufacturer', 'Dog Polisher', 'Digital Content Regurgitator', 'Spoon Tycoon', 'Quesadilla Engineer', 'Bridge Salesman'];
    let output = [];
    for (let i = 0; i < n; i++) {
        output.push({
            key: i,
            firstName: "Person",
            lastName: `McPersonface ${i}`,
            age: 45 + i,
            profession: instruments[Math.floor(Math.random() * instruments.length)]
        })
    }
    return output;
};

const loadNewData = () => generatePeople(10000);

export const NewTableTest: FunctionComponent<any> = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

    return (
        <NewTable
            columns={newColumns}
            loadData={loadNewData}
            rowSelection={"multiple"}
            onRowSelect={(keys) => setSelectedRowKeys(keys)}
            multipleSelection={true}
            search={true}
            verboseToolbar={true}
            //loading={true}
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
                        overflowCount={9999}
                        style={{
                            backgroundColor: "#fff",
                            color: "#999",
                            boxShadow: "1px 1px 4px #d9d9d9 inset",
                            marginLeft: 7
                        }}
                    />
                )}
            </Button>
            <NewExportTableAction/>
        </NewTable>
    )
}