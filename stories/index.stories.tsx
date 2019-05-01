import React from 'react';

import {storiesOf} from '@storybook/react';
// import {linkTo} from '@storybook/addon-links';

import TableView from '../src/tableview/TableView';
import {InsertAction, RemoveAction, TableAction, UpdateAction} from "../src/tableview/Actions";

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
    new InsertAction(s => s ),
    new UpdateAction(s => s ),
    new RemoveAction(s => false),
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

    .add(' - with custom toolbar button props', () => {

        const customActions: TableAction<string>[] = [
            new InsertAction(s => s, {buttonProps: { type: 'primary', shape: 'round'}} ),
            new UpdateAction(s => s, {buttonProps: { type: 'dashed'}} ),
            new RemoveAction(s => false, { buttonProps: { type: 'danger'}}),
        ];

        return <TableView columns={columns} actions={customActions} verboseToolbar={true}/>
    });
