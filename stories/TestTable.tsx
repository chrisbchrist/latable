import React, {FunctionComponent, useCallback, useState} from "react";
import { TableView } from "../src";
import { Keys } from "../src/domain/Domain";
import { Badge, Button, Checkbox } from "antd";
import { ExportTableAction } from "../src/tableview/Actions";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

//@ts-ignore
// TableView.whyDidYouRender = true;

const columns = [
  { title: "ID", dataIndex: "key" },
  { title: "Name", dataIndex: "name" }
];

// const testData = [
//   { key: 1, name: "Jimbo Williamson" },
//   { key: 2, name: "Mr. Funnyface" },
//   { key: 3, name: "Bilbo Thriftworth" },
//   { key: 4, name: "Rutherford Wonkington" },
//   { key: 5, name: "Constance Bunker" },
//   { key: 6, name: "Widdlepop Silversmith" }
// ];

const otherData = [
  { key: 1, name: "Jimbo Williamson" },
  { key: 7, name: "Different" },
  { key: 8, name: "Data" },
  { key: 9, name: "For" },
  { key: 10, name: "A" },
  { key: 11, name: "Different" },
  { key: 12, name: "Test" }
];

const generateData = (n: number) => {
  let output = [];
  for (let i = 0; i < n; i++) {
    output.push({
      key: i,
      name: `I am person #${i}`
    })
  }
  return output;
}

export const TestTable: FunctionComponent<any> = props => {
  const { data, ...rest } = props;

  const [selectedRowKeys, setSelectedRowKeys] = useState<Keys>([]);
  const [dataFlag, setDataFlag] = useState<boolean>(false);
  const onRowSelect = (selectedKeys: Keys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const onChangeFlag = (e: CheckboxChangeEvent) => {
    setDataFlag(e.target.checked);
  };

  const loadData = useCallback(() => (dataFlag ? otherData : generateData(1000)), [dataFlag]);

  return (
    <div>
      <Checkbox checked={dataFlag} onChange={onChangeFlag} /> Toggle alternate
      data
      <TableView
        columns={columns}
        loading={false}
        loadData={loadData}
        verboseToolbar={true}
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
        <ExportTableAction fileName={"I am Excel, my friends call me XL"} />
      </TableView>
    </div>
  );
};
