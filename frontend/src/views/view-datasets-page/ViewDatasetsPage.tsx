import React, { useEffect, Dispatch, SetStateAction } from "react";
import { useHistory } from "react-router-dom";

import {
  EuiBreadcrumb,
  EuiTitle,
  EuiSpacer,
  EuiListGroup,
  EuiListGroupItem,
  EuiAvatar,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiButton,
} from "@elastic/eui";

interface IProps {
  setBreadcrumbs: Dispatch<SetStateAction<EuiBreadcrumb[]>>;
}

const ViewDatasetPage: React.FC<IProps> = (props) => {
  const { setBreadcrumbs } = props;

  const history = useHistory();

  useEffect(() => {
    setBreadcrumbs([
      {
        text: "Datasets",
      },
    ]);
  }, [setBreadcrumbs]);

  return (
    <div style={{ textAlign: "center" }}>
      <EuiSpacer size="l" />
      <EuiTitle size="l">
        <h1 style={{ textAlign: "center" }}>Datasets</h1>
      </EuiTitle>

      <EuiSpacer size="xl" />

      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiListGroup style={{ minWidth: 500, maxWidth: 1000 }}>
            <EuiListGroupItem
              icon={
                <EuiAvatar size="s" type="space" name="Reddit Submissions" />
              }
              onClick={() => {}}
              label="Reddit Submissions"
              extraAction={{
                color: "subdued",
                onClick: () => {},
                iconType: "eye",
                "aria-label": "View dataset",
              }}
            />
            <EuiListGroupItem
              icon={<EuiAvatar size="s" type="space" name="Reddit Comments" />}
              onClick={() => {}}
              label="Reddit Comments"
              extraAction={{
                color: "subdued",
                onClick: () => {},
                iconType: "eye",
                "aria-label": "View dataset",
              }}
            />
            <EuiListGroupItem
              icon={
                <EuiAvatar
                  size="s"
                  type="space"
                  name="Reddit Comments Tagging 2020"
                />
              }
              onClick={() => {}}
              label="Reddit Comments Tagging 2020"
              extraAction={{
                color: "subdued",
                onClick: () => {},
                iconType: "eye",
                "aria-label": "View dataset",
              }}
            />
          </EuiListGroup>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiHorizontalRule margin="l" />

      <EuiButton
        onClick={() => history.push("/datasets/create")}
        iconType="plus"
        aria-label="Create new dataset"
      >
        Create new dataset
      </EuiButton>
    </div>
  );
};

export default ViewDatasetPage;
