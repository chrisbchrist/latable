import React from 'react';

import {storiesOf} from '@storybook/react';
// import {linkTo} from '@storybook/addon-links';


import TableView from '../src/tableview/TableView';
import {InsertTableAction,
        RefreshTableAction,
        RemoveTableAction,
        UpdateTableAction} from "../src/tableview/Actions";

import '../src/indigo.css';
import {Divider, Modal} from "antd";
import {DomainEntity} from "../src/domain/Domain";
const uuid4 = require('uuid/v4');

const columns = [{
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName',
}, {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName',
}, {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
}];

const data = [
    {
        key:  uuid4(),
        firstName: "Jason",
        lastName: "Rocco",
        age :47
    },
    {
        key: uuid4(),
        firstName: "Roman",
        lastName: "Vorobiev",
        age :52
    },
    {
        key: uuid4(),
        firstName: "Vladimir",
        lastName: "Birbrier",
        age :40
    },

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

function confirm( onComplete: ( success: boolean) => void): void {
    Modal.confirm({
        title: 'Delete selected Item?',
        content: 'Some descriptions here',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: () => onComplete(true) ,
        onCancel: () => onComplete(false),
    });

}

const getData: () => DomainEntity[] = () => data;

storiesOf('TableView', module)

    .addDecorator(story => <div style={{ padding: '1rem' }}>{story()}</div>)

    .add('with standard toolbar', () => {
        return (
            <TableView columns={columns} dataSource={getData}>
                <RefreshTableAction />
                <Divider type="vertical" dashed={true}/>
                <InsertTableAction onInsert={item => {return { ...item, key: uuid4()}}}/>
                <UpdateTableAction onUpdate={item => item}/>
                <RemoveTableAction onRemove={(item, onCompletion) => confirm(onCompletion) }/>
            </TableView>
        )
    })

    .add('with verbose toolbar', () => {
        return (
            <TableView columns={columns} verboseToolbar={true} dataSource={getData}>
                <RefreshTableAction />
                <Divider type="vertical" dashed={true}/>
                <InsertTableAction onInsert={item => {return { ...item, key: uuid4()}}}/>
                <UpdateTableAction onUpdate={item => item}/>
                <RemoveTableAction onRemove={(item, onCompletion) => confirm(onCompletion) }/>
            </TableView>
        )
    })

    .add('with custom toolbar button properties', () => {

        return (
            <TableView columns={columns} verboseToolbar={true} dataSource={getData}>
                <RefreshTableAction iconProps={{spin:true}}/>
                <Divider type="vertical" dashed={true}/>
                <InsertTableAction text={'Create'}
                                   icon={'plus-circle'}
                                   buttonProps={{ type: 'primary', shape: 'round'}}
                                   onInsert= {item => {return { ...item, key: uuid4()}} } />
                <UpdateTableAction onUpdate= {item => item } buttonProps={{ type: 'dashed' }}/>
                <RemoveTableAction onRemove={(item, onCompletion) => confirm(onCompletion) }
                                   buttonProps={{ type: 'danger' }}/>
            </TableView>
        )

    })

    .add('with multiple row selection', () => {
        return (
            <TableView columns={columns} dataSource={getData} multipleSelection={true}>
                <RefreshTableAction />
                <Divider type="vertical" dashed={true}/>
                <InsertTableAction onInsert={item => {return { ...item, key: uuid4()}}}/>
                <UpdateTableAction onUpdate={item => item}/>
                <RemoveTableAction onRemove={(item, onCompletion) => confirm(onCompletion) }/>
            </TableView>
        )
    })

;
