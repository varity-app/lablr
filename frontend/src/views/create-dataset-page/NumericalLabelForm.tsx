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
  EuiSpacer,
  EuiFieldNumber,
} from "@elastic/eui";

import { FormErrors, LabelDefinition } from "./types";

interface IProps {
  handleLabel: (label: LabelDefinition) => void;
  labels: LabelDefinition[];
}

interface FormValues {
  name: string;
  variant: "numerical";
  interval: number | "";
  minimum: number | "";
  maximum: number | "";
}

const NumericalLabelForm: React.FC<IProps> = (props) => {
  const { handleLabel, labels } = props;

  const [numPopOpen, setNumPopOpen] = useState(false);

  const validate = (values: FormValues) => {
    const errors: FormErrors = {};

    if (!values.name) errors.name = "Required";
    else if (
      labels.reduce((acc, label) => {
        return acc || label.name === values.name;
      }, false)
    )
      errors.name = "Already a label with that name";

    if (values.interval === "") errors.interval = "Required";
    else if (values.interval <= 0) errors.interval = "Interval must be > 0";

    if (values.minimum === "") errors.minimum = "Required";
    else if (values.minimum < -10)
      errors.minimum = "Minimum must be no less than -10";

    if (values.maximum === "") errors.maximum = "Required";
    else if (values.maximum > 10)
      errors.maximum = "Maximum must be no greater than 10";

    if (values.minimum !== "" && values.maximum !== "") {
      if (values.minimum >= values.maximum)
        errors.minimum = errors.maximum = "Minimum must be less than maximum";
      if (
        values.interval !== "" &&
        values.interval > values.maximum - values.minimum
      )
        errors.interval = "Interval must be smaller than `maximum - minimum`";
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
      variant: "numerical",
      interval: 0.5,
      minimum: 0,
      maximum: 1,
    },
    validate,
    onSubmit: (values, { resetForm }) => {
      handleLabel(values as any);
      resetForm();
    },
  });

  // console.log(errors);

  return (
    <EuiPopover
      button={
        <EuiButton
          iconType="arrowDown"
          iconSide="right"
          onClick={() => setNumPopOpen(!numPopOpen)}
          color="danger"
          aria-label="Add numerical label"
        >
          Add Numerical Label
        </EuiButton>
      }
      isOpen={numPopOpen}
      closePopover={() => setNumPopOpen(false)}
    >
      <div style={{ width: 400 }}>
        <EuiForm component="form" onSubmit={handleSubmit}>
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

          <EuiSpacer size="m" />

          <EuiFlexGroup>
            <EuiFlexItem grow={1}>
              <EuiFormRow
                label="Minimum"
                isInvalid={errors.minimum && touched.minimum ? true : false}
              >
                <EuiFieldNumber
                  name="minimum"
                  value={values.minimum}
                  isInvalid={errors.minimum && touched.minimum ? true : false}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </EuiFormRow>
            </EuiFlexItem>

            <EuiFlexItem grow={1}>
              <EuiFormRow
                label="Maximum"
                isInvalid={errors.maximum && touched.maximum ? true : false}
              >
                <EuiFieldNumber
                  name="maximum"
                  value={values.maximum}
                  isInvalid={errors.maximum && touched.maximum ? true : false}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </EuiFormRow>
            </EuiFlexItem>

            <EuiFlexItem grow={1}>
              <EuiFormRow
                label="Interval"
                isInvalid={errors.interval && touched.interval ? true : false}
              >
                <EuiFieldNumber
                  name="interval"
                  value={values.interval}
                  isInvalid={errors.interval && touched.interval ? true : false}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  step={0.1}
                />
              </EuiFormRow>
            </EuiFlexItem>
          </EuiFlexGroup>

          <EuiFormRow hasEmptyLabelSpace>
            <EuiButton
              disabled={Object.keys(errors).length > 0}
              onClick={() => handleSubmit()}
            >
              Add
            </EuiButton>
          </EuiFormRow>
        </EuiForm>
      </div>
    </EuiPopover>
  );
};

export default NumericalLabelForm;
