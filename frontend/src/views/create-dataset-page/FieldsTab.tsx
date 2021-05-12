import React from "react";

import { EuiFormRow, EuiSelect } from "@elastic/eui";

interface IProps {
  hidden: boolean;
}

const HIDDEN_STYLE = { display: "none" };

const FieldsTab: React.FC<IProps> = (props) => {
  const { hidden } = props;

  return (
    <React.Fragment>
      <EuiFormRow
        style={hidden ? HIDDEN_STYLE : {}}
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
        style={hidden ? HIDDEN_STYLE : {}}
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
    </React.Fragment>
  );
};

export default FieldsTab;
