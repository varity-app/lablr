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

import BooleanLabelForm from "./BooleanLabelForm";
import NumericalLabelForm from "./NumericalLabelForm";

interface IProps {
  hidden: boolean;
}

const HIDDEN_STYLE = { display: "none" };

const LabelsTab: React.FC<IProps> = (props) => {
  const { hidden } = props;

  return (
    <React.Fragment>
      <EuiFlexGroup
        style={hidden ? HIDDEN_STYLE : {}}
        gutterSize="s"
        responsive={false}
      >
        <EuiFlexItem>
          <BooleanLabelForm />
        </EuiFlexItem>

        <EuiFlexItem>
          <NumericalLabelForm />
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiListGroup style={hidden ? HIDDEN_STYLE : {}}>
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
    </React.Fragment>
  );
};

export default LabelsTab;
