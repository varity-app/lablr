import React, { useState } from "react";

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

interface IProps {}

const NumericalLabelForm: React.FC<IProps> = (props) => {
  const {} = props;

  const [numPopOpen, setNumPopOpen] = useState(false);

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
  );
};

export default NumericalLabelForm;
