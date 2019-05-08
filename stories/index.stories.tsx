import React, {useState} from 'react';

import {storiesOf} from '@storybook/react';
import TableView, {OnUpdateCallback} from '../src/tableview/TableView';
import {InsertTableAction, RefreshTableAction, RemoveTableAction, UpdateTableAction} from "../src/tableview/Actions";

import '../src/indigo.css';
import {Divider, Form, Input, Modal, Radio} from "antd";
import {DomainEntity} from "../src/domain/Domain";
import {FormComponentProps} from "antd/es/form";
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

interface ModalFormProps<T> {
    onComplete: (result: T|undefined)=>void
}

//TODO Generalize modal forms
function ModalForm<T>( props: ModalFormProps<T> ) {

    const [modalVisible, setModalVisible] = useState<boolean>(true);

    function closeModal( result: T|undefined ): void {
        setModalVisible(false);
        props.onComplete(result)
    }

    return (
        <Modal
            visible={modalVisible}
            title="Create a new collection"
            okText="Create"
            onCancel={ e => closeModal(undefined)}
            onOk={ e => closeModal(undefined)}>
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
        </Modal>
    );
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
                <UpdateTableAction onUpdate={ (item, presentUI, onComplete) => {
                    let form = <ModalForm key={uuid4()} onComplete={onComplete} />;
                    presentUI([form]);
                }} />
                <RemoveTableAction onRemove={(item, onComplete) => confirm(onComplete) }/>
            </TableView>
        )
    })

    .add('with verbose toolbar', () => {
        return (
            <TableView columns={columns} verboseToolbar={true} loadData={getData}>
                <RefreshTableAction />
                <Divider type="vertical" dashed={true}/>
                <InsertTableAction onInsert={item => {return { ...item, key: uuid4()}}}/>
                <UpdateTableAction onUpdate={ (item, presentUI, onComplete) => {
                    let form = <ModalForm key={uuid4()} onComplete={onComplete} />;
                    presentUI([form]);
                }} />
                <RemoveTableAction onRemove={(item, onComplete) => confirm(onComplete) }/>
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
                <UpdateTableAction onUpdate={ (item, presentUI, onComplete) => {
                                        let form = <ModalForm key={uuid4()} onComplete={onComplete} />;
                                        presentUI([form]);
                                   }}
                                   buttonProps={{ type: 'dashed' }}/>
                <RemoveTableAction onRemove={(item, onComplete) => confirm(onComplete) }
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
                <UpdateTableAction onUpdate={ (item, presentUI, onComplete) => {
                    let form = <ModalForm key={uuid4()} onComplete={onComplete} />;
                    presentUI([form]);
                }} />
                <RemoveTableAction onRemove={(item, onComplete) => confirm(onComplete) } />
            </TableView>
        )

    })

    .add('with multiple row selection', () => {
        return (
            <TableView columns={columns} loadData={getData} multipleSelection={true}>
                <RefreshTableAction />
                <Divider type="vertical" dashed={true}/>
                <InsertTableAction onInsert={item => {return { ...item, key: uuid4()}}}/>
                <UpdateTableAction onUpdate={ (item, presentUI, onComplete) => {
                    let form = <ModalForm key={uuid4()} onComplete={onComplete} />;
                    presentUI([form]);
                }} />
                <RemoveTableAction onRemove={(item, onComplete) => confirm(onComplete) }/>
            </TableView>
        )
    })

;
