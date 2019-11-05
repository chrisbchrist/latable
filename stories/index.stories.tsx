import React from "react";
const uuid4 = require("uuid/v4");
//@ts-ignore
import {generateData } from 'react-base-table'

// const sampleData = generateData(10000);
// console.log(sampleData)
import { storiesOf } from "@storybook/react";
import { withKnobs, boolean } from "@storybook/addon-knobs";

import { Divider } from "antd";
import {NewTable} from "../src/tableview/NewTable";

import TableView from "../src/tableview/TableView";
import {
  InsertTableAction,
  RefreshTableAction,
  RemoveTableAction,
  UpdateTableAction
} from "../src/tableview/Actions";

import "../src/indigo.css";
import PersonForm from "./PersonForm";
import Modals from "../src/modal/ModalContaner";
import { Person } from "./PersonFormik";
import { Country, CountrySupport } from "./Countries";
import { useQuery } from "@apollo/react-hooks";
import { ApolloTableView } from "../src/tableview/ApolloTableView";
import {Keys} from "../src/domain/Domain";
import {ResizeWrapper} from "../src/tableview/newtable/ResizeWrapper";
import { VirtualizedTable } from "../src/tableview/virtualizedtable/VirtualizedTable";
import "antd/dist/antd.min.css";


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
  }
];

//TODO derive columns from domain entity
const columns = [
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName"
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName"
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age"
  },
  {
    title: "Profession",
    dataIndex: "profession",
    key: "profession"
  }
];

const virtualColumns = [
  {
    title: "Name",
    dataIndex: "name",
    width: 200,
  },
  {
    title: "Job",
    dataIndex: "description",
    width: 400,
  }
];

const virtualData = [
  { name: 'Brian Vaughn', description: 'Software engineer' },
  { name: 'Joe Sklorp', description: 'Software engineer' },
  { name: 'Sally Findow', description: 'Software engineer' },
  { name: 'Mac Attax', description: 'Software engineer' },
  { name: 'Bilbo Silverworth', description: 'Software engineer' }
  // And so on...
];

function age(bd: Date): number {
  let diff = (new Date().getTime() - bd.getTime()) / 1000 / (60 * 60 * 24);
  return Math.abs(Math.floor(diff / 365.25));
}

const data: Person[] = [
  {
    key: uuid4(),
    firstName: "Jason",
    lastName: "Rocco",
    age: age(new Date(1971, 9, 15)),
    profession: "Director"
  },
  {
    key: uuid4(),
    firstName: "Roman",
    lastName: "Vorobiev",
    age: age(new Date(1966, 7, 7)),
    profession: "Software Developer"
  },
  {
    key: uuid4(),
    firstName: "Vladimir",
    lastName: "Birbrier",
    age: age(new Date(1978, 9, 15)),
    profession: "Software Developer"
  }
];


function confirmRemoval(personIds: Keys): Promise<boolean> {
  return Modals.confirm({
    title: "Delete selected Item?",
    content: "Some descriptions here",
    okType: "primary"
  });
}

async function insertItem(person?: Person): Promise<Person> {
  return new Promise<Person>((resolve, reject) => {
    let newPerson = person
      ? { ...person, key: uuid4(), firstName: person!.firstName + " +" }
      : {
          key: uuid4(),
          firstName: "Unknown",
          lastName: "Unknown",
          age: 0,
          profession: "Unknown"
        };

    Modals.show(<PersonForm {...person} />, {
      title: "Insert Person",
      okText: "Create",
      onOk: () => resolve(newPerson),
      onCancel: () => reject()
    });
  });
}

function updateItem(person: Person): Promise<Person> {
  return new Promise<Person>((resolve, reject) => {
    let updatedPerson = {
      ...person,
      age: person.age + 10,
      firstName: person.firstName + " ^"
    };

    Modals.show(<PersonForm {...person} />, {
      title: "Update Person",
      okText: "Update",
      onOk: () => resolve(updatedPerson),
      onCancel: () => reject()
    });
  });
}

const retrieveData: () => Person[] = () => data;

const verboseToolbarTitle = "Verbose Toolbar";
const multipleSelectionTitle = "Multiple Selection";
const disableContextMenuTitle = "Disable Context Menu";

function UseTableViewWithGraphQL() {
  const { loading, /*error,*/ data } = useQuery(CountrySupport.query, {
    client: CountrySupport.client
  });

  return (
    <TableView
      columns={CountrySupport.columns}
      pagination={false}
      bordered
      scroll={{ y: 300 }}
      loading={loading}
      loadData={() => data.countries as Country[]}
      verboseToolbar={true}
      multipleSelection={boolean(multipleSelectionTitle, false)}
      disableContextMenu={boolean(disableContextMenuTitle, false)}
    >
      <RefreshTableAction />
      <Divider type="vertical" dashed={true} />
      <InsertTableAction customText="Ard;ebarg" onInsert={CountrySupport.insertItem} />
      <UpdateTableAction customText="Update" onUpdate={CountrySupport.updateItem} />
      <RemoveTableAction onRemove={CountrySupport.confirmRemoval} />
    </TableView>
  );
}

function UseApolloTableView(props: any) {
  return (
    <ApolloTableView
      client={CountrySupport.client}
      entityName="Country"
      queryName="countries"
      columnDefs={props.columnDefs}
      query={props.query}
      pagination={{ pageSize: 50 }}
      bordered
      // scroll={{y: 500, x: 1100}}
      verboseToolbar={boolean(verboseToolbarTitle, false)}
      multipleSelection={boolean(multipleSelectionTitle, false)}
      disableContextMenu={boolean(disableContextMenuTitle, false)}
      {...props}
    >
      <RefreshTableAction />
      <Divider type="vertical" dashed={true} />
      <InsertTableAction customText="New" onInsert={CountrySupport.insertItem} />
      <UpdateTableAction onUpdate={CountrySupport.updateItem} />
      <RemoveTableAction onRemove={CountrySupport.confirmRemoval} multiple={true}/>
    </ApolloTableView>
  );
}

storiesOf("New Table", module)
    .add("Test", () => {
      return <NewTable
                columns={newColumns}
                loadData={() => data}
                rowSelection={"multiple"}
                onRowSelect={(keys) => console.log(keys)}
                multipleSelection={true}
                search={true}
      />
    })
    .add("Resize Wrapper", () => {
      const testStyles = (w: any, h: any) => {
        return {
        width: w + 'px',
        height: h + 'px',
        background: 'blue',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      };
        }
      return (
          <ResizeWrapper>
            {(width: any, height: any) => {
              return <div style={testStyles(width, height)}>{`I am a blue dude and I am ${width} by ${height}`}</div>
            }}
          </ResizeWrapper>
      )
    });

storiesOf("Virtualized Table", module)
    .add("Test", () => {
      return <VirtualizedTable columns={virtualColumns} loadData={() => virtualData}/>
    })

storiesOf("TableView", module)
  .addDecorator(withKnobs)
  .addDecorator(story => <div style={{ padding: "1rem" }}>{story()}</div>)

  .add("with standard toolbar", () => {
    return (
      <TableView
        columns={columns}
        pagination={false}
        loadData={retrieveData}
        verboseToolbar={boolean(verboseToolbarTitle, false)}
        multipleSelection={boolean(multipleSelectionTitle, false)}
        disableContextMenu={boolean(disableContextMenuTitle, false)}
      >
        <RefreshTableAction />
        <Divider type="vertical" dashed={true} />
        <InsertTableAction onInsert={insertItem} />
        <UpdateTableAction onUpdate={updateItem} />
        <RemoveTableAction onRemove={confirmRemoval} />
      </TableView>
    );
  })

  .add("with custom toolbar button properties", () => {
    return (
      <TableView
        columns={columns}
        style={{ userSelect: "none" }}
        pagination={false}
        loadData={retrieveData}
        verboseToolbar={boolean(verboseToolbarTitle, false)}
        multipleSelection={boolean(multipleSelectionTitle, false)}
        disableContextMenu={boolean(disableContextMenuTitle, false)}
      >
        <RefreshTableAction iconProps={{ spin: false }} />
        <Divider type="vertical" dashed={true} />
        <InsertTableAction
          text={"Create"}
          icon={"plus-circle"}
          type={"primary"}
          shape={"round"}
          onInsert={insertItem}
        />
        <UpdateTableAction onUpdate={updateItem} type={"dashed"} />
        <RemoveTableAction onRemove={confirmRemoval} type={"danger"} />
      </TableView>
    );
  })

  .add("with custom table properties", () => {
    return (
      <TableView
        columns={columns}
        pagination={false}
        bordered
        loadData={retrieveData}
        verboseToolbar={boolean(verboseToolbarTitle, false)}
        multipleSelection={boolean(multipleSelectionTitle, false)}
        disableContextMenu={boolean(disableContextMenuTitle, false)}
      >
        <RefreshTableAction />
        <Divider type="vertical" dashed={true} />
        <InsertTableAction onInsert={insertItem} />
        <UpdateTableAction onUpdate={updateItem} />
        <RemoveTableAction onRemove={confirmRemoval} />
      </TableView>
    );
  })

  .add("with only one action", () => {
    return (
      <TableView
        columns={columns}
        pagination={false}
        bordered
        loadData={retrieveData}
        verboseToolbar={boolean(verboseToolbarTitle, false)}
        multipleSelection={boolean(multipleSelectionTitle, false)}
        disableContextMenu={boolean(disableContextMenuTitle, false)}
      >
        <RefreshTableAction />
      </TableView>
    );
  })

  .add("using Apollo Client", () => {
    return <UseTableViewWithGraphQL />;
  })

  .add("using ApolloTableView", () => {
    return (
      <UseApolloTableView
        columnDefs={{ keyColumn: "code" }}
        query="{ countries { key:code }}"
      />
    );
  })

  .add("using ApolloTableView with custom key", () => {
    return (
      <UseApolloTableView
        columnDefs={{
          keyColumn: "code"
        }}
        query="{ countries { key:code }}"
        queryName="countries"
      />
    );
  })

  .add("using ApolloTableView with exclude columns", () => {
    return (
      <UseApolloTableView
        columnDefs={{
          keyColumn: "code",
          excludeColumns: ["languages", "continent"]
        }}
        queryName="countries"
      />
    );
  })

  .add("using ApolloTableView with exclude columns/default sorters", () => {
  return (
      <UseApolloTableView
          columnDefs={{
            keyColumn: "code",
            excludeColumns: ["languages", "continent"],
            defaultSorters: true
          }}
          queryName="countries"
          multipleSelection={true}
          onRowSelect={(keys: Keys) => console.log("Selected Row Keys:", keys)}
          search={true}
      />
  );
});
