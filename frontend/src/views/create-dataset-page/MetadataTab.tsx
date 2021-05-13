import React from "react";

import { EuiFormRow, EuiFieldText, EuiFilePicker } from "@elastic/eui";

import { createFakeEvent } from "utilities/event";

import { FormValues, FormErrors, FormTouched } from "./types";

interface IProps {
  hidden: boolean;
  handleChange: (event: React.SyntheticEvent) => void;
  handleBlur: (event: React.SyntheticEvent) => void;
  setFields: React.Dispatch<React.SetStateAction<string[]>>;
  values: FormValues;
  errors: FormErrors;
  touched: FormTouched;
}

const HIDDEN_STYLE = { display: "none" };

const MetadataTab: React.FC<IProps> = (props) => {
  const {
    hidden,
    handleChange,
    handleBlur,
    setFields,
    values,
    errors,
    touched,
  } = props;

  // Handle file picker change
  const onPickerChange = (files: FileList | null) => {
    if (!files || !files.length) {
      handleChange(createFakeEvent("file", "") as any);
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event: any) => {
      const content = reader.result as string;
      const header = content ? content.split("\n").shift() : "";
      const fields = header ? header.split(",") : [];
      setFields(fields);
      handleBlur(createFakeEvent("file") as any);
      handleChange(createFakeEvent("file", file) as any);
    };
    reader.readAsText(file);
  };

  return (
    <React.Fragment>
      <EuiFormRow
        style={hidden ? HIDDEN_STYLE : {}}
        label="Display Name"
        helpText="Displayed name of the dataset."
        isInvalid={errors.name && touched.name ? true : false}
      >
        <EuiFieldText
          name="name"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.name}
          isInvalid={errors.name && touched.name ? true : false}
        />
      </EuiFormRow>

      <EuiFormRow
        style={hidden ? HIDDEN_STYLE : {}}
        label="Description"
        helpText="A brief description of the dataset."
        isInvalid={errors.description && touched.description ? true : false}
      >
        <EuiFieldText
          name="description"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.description}
          isInvalid={errors.description && touched.description ? true : false}
        />
      </EuiFormRow>

      <EuiFormRow
        style={hidden ? HIDDEN_STYLE : {}}
        label="File picker"
        isInvalid={errors.file && touched.file ? true : false}
      >
        <EuiFilePicker
          name="filename"
          initialPromptText="Select or drag and drop a CSV file"
          onChange={onPickerChange}
          isInvalid={errors.file && touched.file ? true : false}
        />
      </EuiFormRow>
    </React.Fragment>
  );
};

export default MetadataTab;
