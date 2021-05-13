import React from "react";

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiListGroup,
  EuiSpacer,
  EuiListGroupItem,
  EuiAvatar,
  EuiBadge,
} from "@elastic/eui";

import { createFakeEvent } from "utilities/event";

import { FormValues, LabelDefinition } from "./types";
import BooleanLabelForm from "./BooleanLabelForm";
import NumericalLabelForm from "./NumericalLabelForm";

interface IProps {
  hidden: boolean;
  handleChange: (event: React.SyntheticEvent) => void;
  handleBlur: (event: React.SyntheticEvent) => void;
  values: FormValues;
}

const HIDDEN_STYLE = { display: "none" };

const LabelsTab: React.FC<IProps> = (props) => {
  const { hidden, handleChange, handleBlur, values } = props;

  const handleLabel = (label: LabelDefinition) => {
    handleChange(createFakeEvent("labels", [...values.labels, label]) as any);
    handleBlur(createFakeEvent("labels") as any);
  };

  const removeLabel = (idx: number) => {
    const labels = values.labels.filter((label, i) => i !== idx);
    handleChange(createFakeEvent("labels", labels) as any);
  };

  return (
    <React.Fragment>
      <EuiFlexGroup
        style={hidden ? HIDDEN_STYLE : {}}
        gutterSize="s"
        responsive={false}
      >
        <EuiFlexItem>
          <BooleanLabelForm labels={values.labels} handleLabel={handleLabel} />
        </EuiFlexItem>

        <EuiFlexItem>
          <NumericalLabelForm
            labels={values.labels}
            handleLabel={handleLabel}
          />
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiListGroup style={hidden ? HIDDEN_STYLE : {}}>
        <EuiSpacer size="m" />
        {values.labels.map((label, i) => {
          const color = label.variant === "numerical" ? "secondary" : "primary";
          const append = `(${label.minimum}, ${label.maximum}, ${label.interval})`;
          const badgeContent = `${label.variant} ${
            label.variant === "numerical" ? append : ""
          }`;

          return (
            <EuiListGroupItem
              key={label.name}
              icon={<EuiAvatar size="s" type="space" name={label.name} />}
              label={
                <span>
                  {label.name + " "}
                  <EuiBadge color={color}>{badgeContent}</EuiBadge>
                </span>
              }
              extraAction={{
                iconType: "trash",
                alwaysShow: true,
                "aria-label": "Delete label",
                onClick: () => removeLabel(i),
              }}
            />
          );
        })}
      </EuiListGroup>
    </React.Fragment>
  );
};

export default LabelsTab;
