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
  EuiButton,
  EuiPopover,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFieldNumber,
  EuiListGroup,
  EuiListGroupItem,
  EuiAvatar,
  EuiBadge,
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
  const [boolPopOpen, setBoolPopOpen] = useState(false);
  const [numPopOpen, setNumPopOpen] = useState(false);

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
  const getFormRowStyles = (mode: Tabs) =>
    !isTabActive(mode)
      ? {
          display: "none",
        }
      : {};

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

          <EuiFlexGroup
            style={getFormRowStyles(Tabs.labels)}
            gutterSize="s"
            responsive={false}
          >
            <EuiFlexItem>
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
                  <EuiForm component="form">
                    <EuiFlexGroup>
                      <EuiFlexItem>
                        <EuiFormRow label="Name">
                          <EuiFieldText />
                        </EuiFormRow>
                      </EuiFlexItem>

                      <EuiFlexItem grow={false}>
                        <EuiFormRow hasEmptyLabelSpace>
                          <EuiButton>Add</EuiButton>
                        </EuiFormRow>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiForm>
                </div>
              </EuiPopover>
            </EuiFlexItem>

            <EuiFlexItem>
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
                  <EuiForm component="form">
                    <EuiFormRow label="Name">
                      <EuiFieldText name="name" />
                    </EuiFormRow>

                    <EuiSpacer size="m" />

                    <EuiFlexGroup>
                      <EuiFlexItem grow={1}>
                        <EuiFormRow label="Minimum">
                          <EuiFieldNumber name="minimum" min={-10} max={10} />
                        </EuiFormRow>
                      </EuiFlexItem>

                      <EuiFlexItem grow={1}>
                        <EuiFormRow label="Maximum">
                          <EuiFieldNumber name="maximum" min={-10} max={10} />
                        </EuiFormRow>
                      </EuiFlexItem>

                      <EuiFlexItem grow={1}>
                        <EuiFormRow label="Interval">
                          <EuiFieldNumber name="interval" min={-10} max={10} />
                        </EuiFormRow>
                      </EuiFlexItem>
                    </EuiFlexGroup>

                    <EuiFormRow hasEmptyLabelSpace>
                      <EuiButton>Add</EuiButton>
                    </EuiFormRow>
                  </EuiForm>
                </div>
              </EuiPopover>
            </EuiFlexItem>
          </EuiFlexGroup>

          <EuiListGroup style={getFormRowStyles(Tabs.labels)}>
            <EuiSpacer size="m" />
            <EuiListGroupItem
              icon={<EuiAvatar size="s" type="space" name="News" />}
              label={
                <span>
                  News <EuiBadge color="primary">boolean</EuiBadge>
                </span>
              }
              extraAction={{
                iconType: "trash",
                alwaysShow: true,
                "aria-label": "Delete label",
              }}
            />
            <EuiListGroupItem
              icon={<EuiAvatar size="s" type="space" name="Confidence" />}
              label={
                <span>
                  Confidence{" "}
                  <EuiBadge color="danger">numerical (0, 1, 0.5)</EuiBadge>
                </span>
              }
              extraAction={{
                iconType: "trash",
                alwaysShow: true,
                "aria-label": "Delete label",
              }}
            />
          </EuiListGroup>
        </EuiForm>
      </EuiPanel>
    </React.Fragment>
  );
};

export default CreateDatasetPage;
