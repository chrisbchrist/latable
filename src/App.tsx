import React, { Component } from 'react';
import TableView from './TableView';

import './App.css'
import {ActionProps} from "./ActionButton";

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

const actions: ActionProps[] = [
  { text: "Action1", icon: "plus", perform: () => { console.log("Action1") }, extended: true, type:"primary" },
  { text: "Action2", icon: "edit", perform: () => { console.log("Action2") } },
  { text: "Action3", icon: "delete", perform: () => { console.log("Action3") } }
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
