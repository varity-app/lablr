import React, { useState } from "react";

import {
  EuiPopover,
  EuiButton,
  EuiForm,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFieldText,
  EuiFormRow,
} from "@elastic/eui";

interface IProps {}

const BooleanLabelForm: React.FC<IProps> = (props) => {
  const {} = props;

  const [boolPopOpen, setBoolPopOpen] = useState(false);

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
  );
};

export default BooleanLabelForm;
