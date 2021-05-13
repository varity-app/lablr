import React, { useEffect } from "react";

import { EuiFormRow, EuiSelect } from "@elastic/eui";

import { createFakeEvent } from "utilities/event";

import { FormValues, FormErrors, FormTouched } from "./types";

interface IProps {
  hidden: boolean;
  fields: string[];
  handleChange: (event: React.SyntheticEvent) => void;
  handleBlur: (event: React.SyntheticEvent) => void;
  values: FormValues;
  errors: FormErrors;
  touched: FormTouched;
}

const HIDDEN_STYLE = { display: "none" };

const createOptions = (fields: string[], notValue: string) =>
  ["", ...fields.filter((field) => field !== notValue)].map((field) => ({
    value: field,
    text: field,
  }));

const FieldsTab: React.FC<IProps> = (props) => {
  const {
    hidden,
    fields,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
  } = props;

  useEffect(() => {
    handleChange(
      createFakeEvent("id_field", fields.length > 0 ? fields[0] : "") as any
    );
    handleChange(
      createFakeEvent("text_field", fields.length > 1 ? fields[1] : "") as any
    );
  }, [fields, handleChange]);

  const idOptions = createOptions(fields, values.text_field);
  const textOptions = createOptions(fields, values.id_field);

  return (
    <React.Fragment>
      <EuiFormRow
        style={hidden ? HIDDEN_STYLE : {}}
        label="ID Field"
        helpText="Column in the CSV that specifies the ID of each sample."
        isInvalid={errors.id_field && touched.id_field ? true : false}
      >
        <EuiSelect
          name="id_field"
          options={idOptions}
          value={values.id_field}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={errors.id_field && touched.id_field ? true : false}
        />
      </EuiFormRow>

      <EuiFormRow
        style={hidden ? HIDDEN_STYLE : {}}
        label="Text Field"
        helpText="Column in the CSV that specifies the text that will be labeled."
        isInvalid={errors.text_field && touched.text_field ? true : false}
      >
        <EuiSelect
          name="text_field"
          options={textOptions}
          value={values.text_field}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={errors.text_field && touched.text_field ? true : false}
        />
      </EuiFormRow>
    </React.Fragment>
  );
};

export default FieldsTab;
