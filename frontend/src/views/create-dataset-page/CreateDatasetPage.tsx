import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useHistory } from "react-router-dom";

import {
  EuiTitle,
  EuiSpacer,
  EuiBreadcrumb,
  EuiStepsHorizontal,
  EuiPanel,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiFilePicker,
  EuiSelect,
} from "@elastic/eui";

interface IProps {
  setBreadcrumbs: Dispatch<SetStateAction<EuiBreadcrumb[]>>;
}

enum Tabs {
  metadata,
  fields,
  labels,
}

const CreateDatasetPage: React.FC<IProps> = (props) => {
  const { setBreadcrumbs } = props;
  const [tab, setTab] = useState(Tabs.metadata);

  const history = useHistory();

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
  }, [setBreadcrumbs, history]);

  const isTabActive = (mode: Tabs) => mode === tab;
  const getFormRowStyles = (mode: Tabs) => ({
    display: isTabActive(mode) ? "block" : "none",
  });

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

  return (
    <React.Fragment>
      <EuiSpacer size="l" />
      <EuiTitle size="l">
        <h1 style={{ textAlign: "center" }}>Create Dataset</h1>
      </EuiTitle>

      <EuiStepsHorizontal steps={horizontalSteps} />

      <EuiSpacer size="l" />

      <EuiPanel style={{ minWidth: 420 }}>
        <EuiForm component="form">
          <EuiFormRow
            style={getFormRowStyles(Tabs.metadata)}
            label="Display Name"
            helpText="Displayed name of the dataset."
          >
            <EuiFieldText name="name" />
          </EuiFormRow>

          <EuiFormRow
            style={getFormRowStyles(Tabs.metadata)}
            label="Description"
            helpText="A brief description of the dataset."
          >
            <EuiFieldText name="description" />
          </EuiFormRow>

          <EuiFormRow
            style={getFormRowStyles(Tabs.metadata)}
            label="File picker"
          >
            <EuiFilePicker initialPromptText="Select or drag and drop a CSV file" />
          </EuiFormRow>

          <EuiFormRow
            style={getFormRowStyles(Tabs.fields)}
            label="ID Field"
            helpText="Column in the CSV that specifies the ID of each sample."
          >
            <EuiSelect
              name="id_field"
              options={[
                { value: "yeet", text: "yeet" },
                { value: "wheat", text: "wheat" },
                { value: "bleep", text: "bleep" },
              ]}
            />
          </EuiFormRow>

          <EuiFormRow
            style={getFormRowStyles(Tabs.fields)}
            label="Text Field"
            helpText="Column in the CSV that specifies the text that will be labeled."
          >
            <EuiSelect
              name="text_field"
              options={[
                { value: "wheat", text: "wheat" },
                { value: "bleep", text: "bleep" },
                { value: "yeet", text: "yeet" },
              ]}
            />
          </EuiFormRow>
        </EuiForm>
      </EuiPanel>
    </React.Fragment>
  );
};

export default CreateDatasetPage;
