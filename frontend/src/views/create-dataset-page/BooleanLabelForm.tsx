import React, { useState } from "react";
import { useFormik } from "formik";

import {
  EuiPopover,
  EuiButton,
  EuiForm,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFieldText,
  EuiFormRow,
} from "@elastic/eui";

import { FormErrors, LabelDefinition } from "./types";

interface IProps {
  handleLabel: (label: LabelDefinition) => void;
  labels: LabelDefinition[];
}

interface FormValues {
  name: string;
  variant: "boolean";
}

const BooleanLabelForm: React.FC<IProps> = (props) => {
  const { handleLabel, labels } = props;

  const [boolPopOpen, setBoolPopOpen] = useState(false);

  const validate = (values: FormValues) => {
    const errors: FormErrors = {};
    if (!values.name) {
      errors.name = "Required";
    } else if (
      labels.reduce((acc, label) => {
        return acc || label.name === values.name;
      }, false)
    ) {
      errors.name = "Already a label with that name";
    }

    return errors;
  };

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    values, // use this if you want controlled components
    errors,
  } = useFormik({
    initialValues: {
      name: "",
      variant: "boolean",
    },
    validate,
    onSubmit: (values, { resetForm }) => {
      handleLabel(values as any);
      resetForm();
    },
  });

  return (
    <EuiPopover
      button={
        <EuiButton
          iconType="arrowDown"
          iconSide="right"
          onClick={() => setBoolPopOpen(!boolPopOpen)}
          color="primary"
          aria-label="Add boolean label"
        >
          Add Boolean Label
        </EuiButton>
      }
      isOpen={boolPopOpen}
      closePopover={() => setBoolPopOpen(false)}
    >
      <div style={{ width: 300 }}>
        <EuiForm component="form" onSubmit={handleSubmit}>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiFormRow
                label="Name"
                isInvalid={errors.name && touched.name ? true : false}
              >
                <EuiFieldText
                  name="name"
                  value={values.name}
                  isInvalid={errors.name && touched.name ? true : false}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </EuiFormRow>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <EuiFormRow hasEmptyLabelSpace>
                <EuiButton
                  disabled={!!errors.name}
                  onClick={() => handleSubmit()}
                >
                  Add
                </EuiButton>
              </EuiFormRow>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiForm>
      </div>
    </EuiPopover>
  );
};

export default BooleanLabelForm;
