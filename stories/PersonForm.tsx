import {Form, Input, InputNumber} from "antd";
import React, {useContext, useState} from "react";
import {DomainEntity} from "../src/domain/Domain";
import {TableViewContext} from "../src/tableview/TableView";
import {ModalContainerContext} from "../src/modal/ModalContaner";

export interface Person extends DomainEntity{
    firstName: string,
    lastName: string,
    age: number,
    profession: string,
}

function PersonFormImpl( props: any) {

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

    const nameValidationRules = {
        validateFirst: true, // stop validation of first error
        rules: [{ required: true, message: 'Value is required' },]
    };
    const ageValidationRules = {
        validateFirst: true, // stop validation of first error
        rules: [{ required: true, message: 'Value is required' },
                { type: 'number', message: 'Should be a number.' },]
    };

    return <Form layout="vertical" >
        <Form.Item label="First Name" >
            { getFieldDecorator('First Name', { initialValue: props.firstName, ...nameValidationRules, })(
                <Input />
            )}
        </Form.Item>
        <Form.Item label="Last Name">
            {getFieldDecorator('Last Name', { initialValue: props.lastName, ...nameValidationRules, })(
                <Input />
            )}
        </Form.Item>
        <Form.Item label="Age">
            {getFieldDecorator('Age', {  initialValue: props.age, ...ageValidationRules, })(
                <InputNumber />
            )}
        </Form.Item>
    </Form>

}

export default Form.create({name:"PersonForm"})(PersonFormImpl);

