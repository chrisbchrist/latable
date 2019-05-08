import {Form, Input, InputNumber} from "antd";
import React, {useContext, useState} from "react";
import {DomainEntity} from "../src/domain/Domain";
import {TableViewContext} from "../src/tableview/TableView";
import {ModalContainerContext} from "../src/modal/ModalContaner";

export interface Person extends DomainEntity{
    firstName: string,
    lastName: string,
    age: number,
}

function PersonFormImpl( props: any) {

    let [firstName, setFirstName] = useState(props.firstName);
    let [lastName, setLastName]   = useState(props.lastName);
    let [age, setAge]             = useState(props.age);

    const context = useContext(ModalContainerContext);

    // context.setLoading(true);

    let {getFieldDecorator, validateFields} = props.form;

    // validateFields((err: any, values: any) => {
    //     context.setOkDisabled(err);
    //     // if (!err) {
    //     //     const { name } = values;
    //     //     addGroup({ name, urls });
    //     // }
    // });

    return <Form layout="vertical" >
        <Form.Item label="First Name" >
            { getFieldDecorator('First Name', {
                rules: [{ required: true, message: 'First Name is required' }],
                initialValue: firstName
            })(
                <Input  /> //onChange={setFirstName}
            )}

        </Form.Item>
        <Form.Item label="Last Name">
            {getFieldDecorator('Last Name', {
                rules: [{ required: true, message: 'Last Name is required' }],
                initialValue: lastName
            })(
                <Input onChange={setLastName}/>
            )}
        </Form.Item>
        <Form.Item label="Age">
            {getFieldDecorator('Age', {
                rules: [{ required: true, message: 'Age is required' }],
                initialValue: age
            })(
                <InputNumber onChange={setAge}/>
            )}
        </Form.Item>
    </Form>

}

export default Form.create({name:"PersonForm"})(PersonFormImpl);

