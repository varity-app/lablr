import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";

import {
  EuiTitle,
  EuiSpacer,
  EuiBreadcrumb,
  EuiStepsHorizontal,
  EuiPanel,
  EuiForm,
} from "@elastic/eui";

import { FormValues, FormErrors } from "./types";
import MetadataTab from "./MetadataTab";
import FieldsTab from "./FieldsTab";
import LabelsTab from "./LabelsTab";

interface IProps {
  setBreadcrumbs: Dispatch<SetStateAction<EuiBreadcrumb[]>>;
  setRightHeader: Dispatch<SetStateAction<JSX.Element[]>>;
}

enum Tabs {
  metadata,
  fields,
  labels,
}

const validate = (values: FormValues) => {
  const errors: FormErrors = {};
  if (!values.name) {
    errors.name = "Required";
  }

  if (!values.description) {
    errors.description = "Required";
  }

  if (!values.file) {
    errors.file = "Required";
  }

  if (!values.id_field) {
    errors.id_field = "Required";
  }

  if (!values.text_field) {
    errors.text_field = "Required";
  }

  if (!values.labels.length) {
    errors.labels = "Must specify at least one label";
  }

  return errors;
};

const CreateDatasetPage: React.FC<IProps> = (props) => {
  const { setBreadcrumbs, setRightHeader } = props;

  const [tab, setTab] = useState(Tabs.metadata);
  const [fields, setFields] = useState<string[]>([]); // CSV fields/columns

  const history = useHistory();

  // Set Header elements
  useEffect(() => {
    setBreadcrumbs([
      {
        text: "Datasets",
        href: "/datasets",
        onClick: (event) => {
          event.preventDefault();
          history.push("/datasets");
        },
      },
      {
        text: "Create",
      },
    ]);
    setRightHeader([]);
  }, [setBreadcrumbs, setRightHeader, history]);

  // Helper method to check active tab
  const isTabActive = (mode: Tabs) => mode === tab;

  // Steps element
  const horizontalSteps = [
    {
      title: "Metadata",
      isSelected: isTabActive(Tabs.metadata),
      isComplete: false && !isTabActive(Tabs.metadata),
      onClick: () => setTab(Tabs.metadata),
    },
    {
      title: "Fields",
      isSelected: isTabActive(Tabs.fields),
      isComplete: false && !isTabActive(Tabs.fields),
      onClick: () => setTab(Tabs.fields),
    },
    {
      title: "Labels",
      isSelected: isTabActive(Tabs.labels),
      isComplete: false && !isTabActive(Tabs.labels),
      onClick: () => setTab(Tabs.labels),
    },
  ];

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
      description: "",
      file: "",
      id_field: "",
      text_field: "",
      labels: [],
    },
    validate,
    onSubmit: (values) => {
      console.log(JSON.stringify(values));
    },
  });

  return (
    <React.Fragment>
      <EuiSpacer size="l" />
      <EuiTitle size="l">
        <h1 style={{ textAlign: "center" }}>Create Dataset</h1>
      </EuiTitle>

      <EuiStepsHorizontal steps={horizontalSteps} />

      <EuiSpacer size="l" />

      <EuiPanel style={{ width: 420, margin: "auto" }}>
        <EuiForm component="form">
          <MetadataTab
            handleChange={handleChange}
            handleBlur={handleBlur}
            setFields={setFields}
            values={values}
            errors={errors}
            touched={touched}
            hidden={!isTabActive(Tabs.metadata)}
          />

          <FieldsTab
            // handleChange={handleChange}
            hidden={!isTabActive(Tabs.fields)}
          />

          <LabelsTab
            // handleChange={handleChange}
            hidden={!isTabActive(Tabs.labels)}
          />
        </EuiForm>
      </EuiPanel>
    </React.Fragment>
  );
};

export default CreateDatasetPage;
