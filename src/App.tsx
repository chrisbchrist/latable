import React, { Component } from 'react';
import TableView from './TableView';

import './App.css'

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

const actions = [
  { text: "Action1", perform: () => { console.log("Action1") } },
  { text: "Action2", perform: () => { console.log("Action2") } },
  { text: "Action3", perform: () => { console.log("Action3") } }
]


class App extends Component {
  render() {
    return (
      <div>
        <TableView columns={columns} actions={actions}></TableView>
      </div>  

      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <p>
      //       Edit <code>src/App.tsx</code> and save to reload.
      //     </p>
      //     <a
      //       className="App-link"
      //       href="https://reactjs.org"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       Learn React
      //     </a>
      //   </header>
      // </div>
    );
  }
}

export default App;
