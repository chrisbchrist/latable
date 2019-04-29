import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
import TableView from '../src/TableView';
import {TableAction} from "../src/tableview/Actions";
import {InsertAction} from "../src/tableview/InsertAction";

import '../src/indigo.css';
import {ButtonType} from "antd/es/button";

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

const actions: TableAction<string>[] = [
    new InsertAction(),
    new InsertAction( "Edit", "edit", "dashed"),
    new InsertAction("Delete", "delete", "danger"),
];

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

// storiesOf('Button', module)
//   .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
//   .add('with some emoji', () => (
//     <Button onClick={action('clicked')}>
//       <span role="img" aria-label="so cool">
//         😀 😎 👍 💯
//       </span>
//     </Button>
//   ));

storiesOf('TableView', module)
    .add(' - simple', () =>
        <TableView title = {"Eugene"} columns={columns} actions={actions} toolbarExpanded={false}/>);
