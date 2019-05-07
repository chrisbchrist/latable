import React from 'react';

import {storiesOf} from '@storybook/react';
import TableView from '../src/tableview/TableView';
import {InsertTableAction, RefreshTableAction, RemoveTableAction, UpdateTableAction} from "../src/tableview/Actions";

import '../src/indigo.css';
import {Divider, Modal} from "antd";
import {DomainEntity} from "../src/domain/Domain";
// import {linkTo} from '@storybook/addon-links';
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

function age( bd: Date ): number {
    var diff =(new Date().getTime() - bd.getTime()) / 1000 / (60 * 60 * 24);
    return Math.abs(Math.floor(diff/365.25));
}

const data = [
    {
        key:  uuid4(),
        firstName: "Jason",
        lastName: "Rocco",
        age : age( new Date(1971, 9, 15))
    },
    {
        key: uuid4(),
        firstName: "Roman",
        lastName: "Vorobiev",
        age : age( new Date(1966, 7, 7))
    },
    {
        key: uuid4(),
        firstName: "Vladimir",
        lastName: "Birbrier",
        age : age( new Date(1978, 9, 15))
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
            <TableView columns={columns} loadData={getData}>
                <RefreshTableAction />
                <Divider type="vertical" dashed={true}/>
                <InsertTableAction onInsert={item => {return {...item, key: uuid4()} as DomainEntity}}/>
                <UpdateTableAction onUpdate={item => item}/>
                <RemoveTableAction onRemove={(item, onCompletion) => confirm(onCompletion) }/>
            </TableView>
        )
    })

    .add('with verbose toolbar', () => {
        return (
            <TableView columns={columns} verboseToolbar={true} loadData={getData}>
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
            <TableView columns={columns}
                       verboseToolbar={true}
                       loadData={getData} >
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

    .add('with custom table properties', () => {

        return (
            <TableView columns={columns}
                       bordered
                       loadData={getData} >
                <RefreshTableAction />
                <Divider type="vertical" dashed={true}/>
                <InsertTableAction onInsert= {item => {return { ...item, key: uuid4()}} } />
                <UpdateTableAction onUpdate= {item => item } />
                <RemoveTableAction onRemove={(item, onCompletion) => confirm(onCompletion) } />
            </TableView>
        )

    })

    .add('with multiple row selection', () => {
        return (
            <TableView columns={columns} loadData={getData} multipleSelection={true}>
                <RefreshTableAction />
                <Divider type="vertical" dashed={true}/>
                <InsertTableAction onInsert={item => {return { ...item, key: uuid4()}}}/>
                <UpdateTableAction onUpdate={item => item}/>
                <RemoveTableAction onRemove={(item, onCompletion) => confirm(onCompletion) }/>
            </TableView>
        )
    })

;
