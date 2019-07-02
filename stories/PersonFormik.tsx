// import {Input, InputNumber} from "antd";
// import React, {useContext, useState} from "react";
// import {DomainEntity} from "../src/domain/Domain";
// import {ModalContainerContext} from "../src/modal/ModalContaner";
// import {withFormik, FormikProps, FormikErrors, Form, Field} from "formik";
//
import {DomainEntity} from "../src/domain/Domain";

export interface Person extends DomainEntity{
    firstName: string,
    lastName: string,
    age: number,
    profession: string,
}
//
export function PersonFormik( props: any ) {
}
//
//     const context = useContext(ModalContainerContext);
//
//     // context.setLoading(true);
//
//     // let {getFieldDecorator, getFieldsError} = props.form;
//
//     // context.setOkDisabled( hasErrors(getFieldsError));
//
//     // function hasErrors(fieldsError: any ): boolean {
//     //     return Object.keys(fieldsError).some( field => fieldsError[field]);
//     // }
//
//
//     // const nameValidationRules = {
//     //     validateFirst: true, // stop validation of first error
//     //     rules: [{ required: true, message: 'Value is required' },]
//     // };
//     // const ageValidationRules = {
//     //     validateFirst: true, // stop validation of first error
//     //     rules: [{ required: true, message: 'Value is required' },
//     //             { type: 'number', message: 'Should be a number.' },]
//     // };
//
//     interface OtherProps {
//         message: string;
//     }
//
//     const InnerForm = (props: OtherProps & FormikProps<Person>) => {
//         const { touched, errors, isSubmitting, message } = props;
//         return (
//             <Form>
//                 <h1>{message}</h1>
//                 <Field name="firstName" />
//                 {touched.firstName && errors.firstName && <div>{errors.firstName}</div>}
//
//                 <Field name="lastName" />
//                 {touched.lastName && errors.lastName && <div>{errors.lastName}</div>}
//
//
//             </Form>
//         );
//     };
//
//     return (
//
//         <div>
//             <Form
//
//                initialValues={{
//                    key       : props.key,
//                    firstName : props.firstName,
//                    lastName  : props.lastName,
//                    age       : props.age,
//                    profession: props.profession,
//                }}
//
//                // onSubmit={ values => {
//                //      console.log("ON SUMBIT")
//                // }}
//             >
//                 <div>
//                     <Field name="firstName" />
//                     {/*{touched.email && errors.email && <div>{errors.email}</div>}*/}
//                     <Field name="lastName" />
//                     <Field name="age" />
//                     <Field name="profession" />
//                 </div>
//
//             </Form>
//         </div>
//
//     )
//
// }
//
// export default Form.create({name:"PersonFormik"})(PersonFormik);
//
