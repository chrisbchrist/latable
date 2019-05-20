import {Form, Input, InputNumber} from "antd";
import React, {useContext, useState} from "react";
import {DomainEntity} from "../src/domain/Domain";
import {TableViewContext} from "../src/tableview/TableView";
import {ModalContainerContext} from "../src/modal/ModalContaner";

// export interface Person extends DomainEntity{
//     firstName: string,
//     lastName: string,
//     age: number,
//     profession: string,
// }

function PersonForm( props: any) {

    const context = useContext(ModalContainerContext);

    // context.setLoading(true);

    let {getFieldDecorator, getFieldsError} = props.form;

    context.setOkDisabled( hasErrors(getFieldsError));

    function hasErrors(fieldsError: any ): boolean {
        return Object.keys(fieldsError).some( field => fieldsError[field]);
    }


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

export default Form.create({name:"PersonForm"})(PersonForm);

