import { Form as AntdForm, Row, InputNumber, Button, Col } from "antd";
import React, { useContext, FunctionComponent } from "react";
// import { DomainEntity } from "../src/domain/Domain";
// import { TableViewContext } from "../src/tableview/TableView";
import { ModalContainerContext } from "../src/modal/ModalContaner";
import * as yup from "yup";
import {
  Formik,
  Form,
  Field,
  FormikProps,
  FormikActions,
  FieldProps,
  FormikValues
} from "formik";
import { Person } from "./PersonFormik";
import { InputField } from "./InputField";
const uuid4 = require("uuid/v4");

interface PersonFormProps {
  personToEdit?: Person;
  resolveAction: (value?: any) => void;
}

const personValidationSchema = yup.object({
  firstName: yup.string().required("Required field"),
  lastName: yup.string().required("Required field"),
  age: yup.number().required("Required field"),
  profession: yup.string().required("Required field")
});

const initialValues = {
  firstName: "",
  lastName: "",
  age: undefined,
  profession: ""
};

export const PersonFormEditable: FunctionComponent<PersonFormProps> = ({
  personToEdit,
  resolveAction
}) => {
  const context = useContext(ModalContainerContext);

  const onSubmit = (values: FormikValues, formikBag: any) => {
    //console.log(values, formikBag);
    values.key = uuid4();
    resolveAction(values);
    context.closeModal();
  };

  return (
    <Formik
      initialValues={personToEdit ? personToEdit! : initialValues}
      onSubmit={onSubmit}
      validateOnChange={true}
      validateOnBlur={true}
      validationSchema={personValidationSchema}
    >
      {(props: FormikProps<any>, actions: FormikActions<any>) => {
        //console.log(props, actions);
        return (
          <Form>
            <Field name="firstName" label="First Name" component={InputField} />
            <Field name="lastName" label="Last Name" component={InputField} />
            <Row>
              <Col span={6}>
                <Field
                  name="age"
                  render={({
                    field: { name, value, onBlur },
                    form
                  }: FieldProps) => {
                    return (
                      <AntdForm.Item label="Age">
                        <InputNumber
                          value={value}
                          placeholder="Age"
                          onBlur={onBlur}
                          min={1}
                          max={123}
                          onChange={(value: any) =>
                            form.setFieldValue(name, value)
                          }
                        />
                      </AntdForm.Item>
                    );
                  }}
                />
              </Col>
              <Col span={18}>
                <Field
                  name="profession"
                  label="Profession"
                  component={InputField}
                />
              </Col>
            </Row>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button style={{ marginRight: 15 }} icon="sync" htmlType="reset">
                Reset
              </Button>
              <Button htmlType="submit" type="primary" icon="enter">
                {personToEdit ? "Update" : "Create"}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
