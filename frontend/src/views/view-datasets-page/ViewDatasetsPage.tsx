import React, { useEffect, Dispatch, SetStateAction } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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
  EuiLoadingContent,
} from "@elastic/eui";

import { RootState } from "state";
import { fetchDatasets } from "state/datasets/datasets";

interface IProps {
  setBreadcrumbs: Dispatch<SetStateAction<EuiBreadcrumb[]>>;
  setRightHeader: Dispatch<SetStateAction<JSX.Element[]>>;
}

const ViewDatasetPage: React.FC<IProps> = (props) => {
  const { setBreadcrumbs, setRightHeader } = props;

  const history = useHistory();
  const dispatch = useDispatch();

  const { data: datasets, pending } = useSelector(
    (state: RootState) => state.datasets
  );

  useEffect(() => {
    setBreadcrumbs([
      {
        text: "Datasets",
      },
    ]);
    setRightHeader([]);
  }, [setBreadcrumbs, setRightHeader]);

  useEffect(() => {
    dispatch(fetchDatasets());
  }, [dispatch]);

  return (
    <div style={{ textAlign: "center" }}>
      <EuiTitle size="l">
        <h1 style={{ textAlign: "center" }}>Datasets</h1>
      </EuiTitle>

      <EuiSpacer size="xl" />

      <EuiFlexGroup>
        <EuiFlexItem>
          {pending ? (
            <EuiLoadingContent
              style={{ minWidth: 500, maxWidth: 1000, margin: "auto" }}
              lines={3}
            />
          ) : (
            <EuiListGroup
              style={{ minWidth: 500, maxWidth: 1000, margin: "auto" }}
            >
              {datasets.map((dataset) => (
                <EuiListGroupItem
                  key={dataset.dataset_id}
                  icon={<EuiAvatar size="s" type="space" name={dataset.name} />}
                  onClick={() =>
                    history.push(`/datasets/${dataset.dataset_id}`)
                  }
                  label={dataset.name}
                  extraAction={{
                    color: "subdued",
                    onClick: () =>
                      history.push(`/datasets/${dataset.dataset_id}`),
                    iconType: "eye",
                    "aria-label": "View dataset",
                  }}
                />
              ))}
              {datasets.length === 0 ? (
                <p>No existing datasets. Create one via the button below.</p>
              ) : null}
            </EuiListGroup>
          )}
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
