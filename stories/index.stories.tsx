import React from 'react';

import {storiesOf} from '@storybook/react';
// import {linkTo} from '@storybook/addon-links';

import TableView from '../src/tableview/TableView';
import {InsertTableAction, RemoveTableAction, UpdateTableAction} from "../src/tableview/Actions";

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
        return <TableView columns={columns} >
                    <InsertTableAction onInsert= {item => item }/>
                    <UpdateTableAction onUpdate= {item => item }/>
                    <RemoveTableAction onRemove= {() => true }/>
               </TableView>
    })

    .add(' - with verbose toolbar', () => {
        return <TableView columns={columns} verboseToolbar={true}>
                    <InsertTableAction onInsert= {item => item }/>
                    <UpdateTableAction onUpdate= {item => item }/>
                    <RemoveTableAction onRemove= {() => true }/>
              </TableView>
    })

    .add(' - with custom toolbar button props', () => {

        return (
            <TableView columns={columns} verboseToolbar={true}>
                <InsertTableAction onInsert= {item => item } buttonProps={{ type: 'primary', shape: 'round'}}/>
                <UpdateTableAction onUpdate= {item => item } buttonProps={{ type: 'dashed'}}/>
                <RemoveTableAction onRemove= {() => true } buttonProps={{type:"danger" }} />
            </TableView>
        )
    });
