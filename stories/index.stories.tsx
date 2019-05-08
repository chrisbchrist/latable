import React, {useState} from 'react';

import {storiesOf} from '@storybook/react';
import TableView from '../src/tableview/TableView';
import {InsertTableAction, RefreshTableAction, RemoveTableAction, UpdateTableAction} from "../src/tableview/Actions";

import '../src/indigo.css';
import {Divider, Form, Input, Modal, Radio} from "antd";
import {DomainEntity} from "../src/domain/Domain";
import {renderInModal} from "../src/modal/ModalContaner";
// import {linkTo} from '@storybook/addon-links';
const uuid4 = require('uuid/v4');

//TODO derive columns from domain entity
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

interface Person extends DomainEntity{
    firstName: string,
    lastName: string,
    age: number,
}

const data: Person[] = [
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

function confirmRemoval( person: Person): Promise<boolean> {
    return new Promise<boolean>( (resolve) => {
        Modal.confirm({
            title: 'Delete selected Item?',
            content: 'Some descriptions here',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
        })
    });

}

const personForm = (
    <Form layout="vertical">
        <Form.Item label="Title">
            {/*{getFieldDecorator('title', {*/}
            {/*    rules: [{ required: true, message: 'Please input the title of collection!' }],*/}
            {/*})(*/}
            {/*    <Input />*/}
            {/*)}*/}
            <Input />
        </Form.Item>
        <Form.Item label="Description">
            {/*{getFieldDecorator('description')(<Input type="textarea" />)}*/}
            <Input type="textarea" />
        </Form.Item>
        <Form.Item className="collection-create-form_last-form-item">
            {/*{getFieldDecorator('modifier', {*/}
            {/*    initialValue: 'public',*/}
            {/*})(*/}
            {/*    <Radio.Group>*/}
            {/*        <Radio value="public">Public</Radio>*/}
            {/*        <Radio value="private">Private</Radio>*/}
            {/*    </Radio.Group>*/}
            {/*)}*/}
            <Radio.Group>
                <Radio value="public">Public</Radio>
                <Radio value="private">Private</Radio>
            </Radio.Group>
        </Form.Item>
    </Form>
);


function insertItem( person?: Person ): Promise<Person> {

    return new Promise<Person>( (resolve) => {

        let newPerson = person ? {...person, key: uuid4(), firstName: person.firstName + " +"} :
            {key: uuid4(), firstName: "Unknown", lastName: "Unknown", age: 0};

        renderInModal( personForm,{
            title   : 'Insert Person',
            okText  : 'Create',
            onOk    : () => resolve(newPerson),
            onCancel: () => resolve(undefined),
        } )

    });
}

function updateItem( person: Person ): Promise<Person> {

    return new Promise<Person>( (resolve) => {

        let updatedPerson = {...person, age: person.age + 10, firstName: person.firstName + " ^"};

        renderInModal( personForm,{
            title   : 'Update Person',
            okText  : 'Update',
            onOk    : () => resolve(updatedPerson),
            onCancel: () => resolve(undefined),
        } )

    });

}

const retrieveData: () => Person[] = () => data;


storiesOf('TableView', module)

    .addDecorator(story => <div style={{ padding: '1rem' }}>{story()}</div>)

    .add('with standard toolbar', () => {
        return (
            <TableView columns={columns} loadData={retrieveData}>
                <RefreshTableAction />
                <Divider type="vertical" dashed={true}/>
                <InsertTableAction onInsert={insertItem} />
                <UpdateTableAction onUpdate={updateItem}/>
                <RemoveTableAction onRemove={confirmRemoval}/>
            </TableView>
        )
    })

    .add('with verbose toolbar', () => {
        return (
            <TableView columns={columns} verboseToolbar={true} loadData={retrieveData}>
                <RefreshTableAction />
                <Divider type="vertical" dashed={true}/>
                <InsertTableAction onInsert={insertItem}/>
                <UpdateTableAction onUpdate={updateItem}/>
                <RemoveTableAction onRemove={confirmRemoval}/>
            </TableView>
        )
    })

    .add('with custom toolbar button properties', () => {

        return (
            <TableView columns={columns}
                       verboseToolbar={true}
                       loadData={retrieveData} >
                <RefreshTableAction iconProps={{spin:true}}/>
                <Divider type="vertical" dashed={true}/>
                <InsertTableAction text={'Create'}
                                   icon={'plus-circle'}
                                   buttonProps={{ type: 'primary', shape: 'round'}}
                                   onInsert= {insertItem} />
                <UpdateTableAction onUpdate= {updateItem}
                                   buttonProps={{ type: 'dashed' }}/>
                <RemoveTableAction onRemove={confirmRemoval}
                                   buttonProps={{ type: 'danger' }}/>
            </TableView>
        )

    })

    .add('with custom table properties', () => {

        return (
            <TableView columns={columns}
                       bordered
                       loadData={retrieveData} >
                <RefreshTableAction />
                <Divider type="vertical" dashed={true}/>
                <InsertTableAction onInsert= {insertItem} />
                <UpdateTableAction onUpdate= {updateItem} />
                <RemoveTableAction onRemove={confirmRemoval} />
            </TableView>
        )

    })

    .add('with multiple row selection', () => {
        return (
            <TableView columns={columns} loadData={retrieveData} multipleSelection={true}>
                <RefreshTableAction />
                <Divider type="vertical" dashed={true}/>
                <InsertTableAction onInsert={insertItem}/>
                <UpdateTableAction onUpdate={updateItem}/>
                <RemoveTableAction onRemove={confirmRemoval}/>
            </TableView>
        )
    })

;
