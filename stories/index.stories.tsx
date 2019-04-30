import React from 'react';

import {storiesOf} from '@storybook/react';
// import {linkTo} from '@storybook/addon-links';

import TableView from '../src/tableview/TableView';
import {TableAction, TableActions} from "../src/tableview/Actions";

import '../src/indigo.css';

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
    TableActions.insert<string>(s => s )
                .description("Insert Item")
                .buttonProps({ type: "primary", shape: "round"}).build(),
    TableActions.insert<string>(s => s )
                .text('Edit')
                .icon('edit')
                .description("Edit Item")
                .buttonProps({ type: "dashed"}).build(),
    TableActions.insert<string>(s => s )
                .text('Delete')
                .icon('delete')
                .description("Delete Item")
                .buttonProps({ type: "danger"}).build(),
];


// storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

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
    .add(' - with standard toolbar', () => {
        return <TableView columns={columns} actions={actions} />
    })
    .add(' - with verbose toolbar', () => {
        return <TableView columns={columns} actions={actions} verboseToolbar={true}/>
    })
