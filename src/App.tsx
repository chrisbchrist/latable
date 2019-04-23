import React, { Component } from 'react';
import TableView from './TableView';

import './App.css'
import {TableAction, TableInsertAction} from "./tableview/Actions";

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
}];


class InsertAction extends TableInsertAction<String> {

  insert(item: String): String {
    return "";
  }

}

const actions: TableAction<String>[] = [
  new InsertAction(),
  new InsertAction( "Edit", "edit"),
  new InsertAction("Delete", "delete"),
];


class App extends Component {
  render() {
    return (
      <div>
        <TableView columns={columns} actions={actions}/>
      </div>  
    );
  }
}

export default App;
