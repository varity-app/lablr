import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { useFormik } from "formik";

import {
  EuiTitle,
  EuiSpacer,
  EuiBreadcrumb,
  EuiStepsHorizontal,
  EuiPanel,
  EuiForm,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiButtonEmpty,
  EuiProgress,
} from "@elastic/eui";

import { useAppDispatch, RootState } from "state";
import { createDataset } from "state/datasets/dataset";
import { createSamples } from "state/samples/sample";

import { FormValues, FormErrors, FormTouched } from "./types";
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
  const dispatch = useAppDispatch();

  const { pending: datasetPending } = useSelector(
    (state: RootState) => state.dataset
  );
  const { pending: samplePending } = useSelector(
    (state: RootState) => state.sample
  );

  // Set header elements
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

  // Formik validation
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    values,
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
      const body = {
        name: values.name,
        description: values.description,
        labels: values.labels,
      };

      dispatch(createDataset(body))
        .then(unwrapResult)
        .then((dataset) => {
          if (values.file === "") return;

          const formData = new FormData();
          formData.append("id_field", values.id_field);
          formData.append("text_field", values.text_field);
          formData.append("file", values.file);
          dispatch(
            createSamples({
              datasetID: dataset.dataset_id + "",
              formData,
            })
          )
            .then(unwrapResult)
            .then(() => history.push("/datasets"));
        });
    },
  });

  const validMetadata = !errors.name && !errors.description && !errors.file;
  const validFields = !errors.id_field && !errors.text_field;
  const validLabels = values.labels.length > 0;

  let nextStepAvailable = validMetadata;
  if (tab === Tabs.fields) nextStepAvailable = validMetadata && validFields;

  // Steps element
  const horizontalSteps = [
    {
      title: "Metadata",
      isSelected: isTabActive(Tabs.metadata),
      isComplete: validMetadata,
      onClick: () => setTab(Tabs.metadata),
    },
    {
      title: "Fields",
      isSelected: isTabActive(Tabs.fields),
      isComplete: validFields,
      onClick: () => setTab(Tabs.fields),
      disabled: !validMetadata,
    },
    {
      title: "Labels",
      isSelected: isTabActive(Tabs.labels),
      isComplete: validLabels,
      onClick: () => setTab(Tabs.labels),
      disabled: !validMetadata || !validFields,
    },
  ];

  const prevStep = () => {
    if (tab === Tabs.fields) setTab(Tabs.metadata);
    else if (tab === Tabs.labels) setTab(Tabs.fields);
  };

  const nextStep = () => {
    if (tab === Tabs.metadata) setTab(Tabs.fields);
    else if (tab === Tabs.fields) setTab(Tabs.labels);
  };

  return (
    <React.Fragment>
      <EuiTitle size="l">
        <h1 style={{ textAlign: "center" }}>Create Dataset</h1>
      </EuiTitle>

      <EuiStepsHorizontal steps={horizontalSteps} />

      <EuiSpacer size="l" />

      <EuiPanel style={{ width: 420, margin: "auto", position: "relative" }}>
        {samplePending || datasetPending ? (
          <EuiProgress size="xs" color="accent" position="absolute" />
        ) : null}
        <EuiForm component="form">
          <MetadataTab
            handleChange={handleChange}
            handleBlur={handleBlur}
            setFields={setFields}
            values={values}
            errors={errors as FormErrors}
            touched={touched as FormTouched}
            hidden={!isTabActive(Tabs.metadata)}
          />

          <FieldsTab
            handleChange={handleChange}
            handleBlur={handleBlur}
            fields={fields}
            values={values}
            errors={errors as FormErrors}
            touched={touched as FormTouched}
            hidden={!isTabActive(Tabs.fields)}
          />

          <LabelsTab
            hidden={!isTabActive(Tabs.labels)}
            handleChange={handleChange}
            handleBlur={handleBlur}
            values={values}
          />
        </EuiForm>
      </EuiPanel>

      <EuiSpacer size="l" />

      <EuiFlexGroup justifyContent="center">
        {isTabActive(Tabs.metadata) ? null : (
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty onClick={prevStep}>Previous step</EuiButtonEmpty>
          </EuiFlexItem>
        )}
        {isTabActive(Tabs.labels) ? null : (
          <EuiFlexItem grow={false}>
            <EuiButton onClick={nextStep} disabled={!nextStepAvailable}>
              Next step
            </EuiButton>
          </EuiFlexItem>
        )}
        {!isTabActive(Tabs.labels) ? null : (
          <EuiFlexItem grow={false}>
            <EuiButton
              fill
              disabled={!validMetadata || !validFields || !validLabels}
              onClick={() => handleSubmit()}
            >
              Submit
            </EuiButton>
          </EuiFlexItem>
        )}
      </EuiFlexGroup>
    </React.Fragment>
  );
};

export default CreateDatasetPage;
