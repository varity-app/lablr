import React, { useEffect, Dispatch, SetStateAction } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  EuiBreadcrumb,
  EuiSpacer,
  EuiTitle,
  EuiAvatar,
  EuiText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiHorizontalRule,
  EuiCard,
  EuiProgress,
  EuiIcon,
} from "@elastic/eui";
import { euiPaletteColorBlindBehindText } from "@elastic/eui/lib/services";

import { RootState } from "state";
import { fetchDataset } from "state/datasets/dataset";

import LabelBadge from "./LabelBadge";

interface IProps {
  setBreadcrumbs: Dispatch<SetStateAction<EuiBreadcrumb[]>>;
  setRightHeader: Dispatch<SetStateAction<JSX.Element[]>>;
}

const generateLabelsGroup = (labels: string[]) =>
  euiPaletteColorBlindBehindText({
    rotations: Math.ceil(labels.length / 10),
  })
    .slice(0, labels.length)
    .map((color: string, i: number) => (
      <LabelBadge key={labels[i]} color={color}>
        {labels[i]}
      </LabelBadge>
    ));

const ViewDatasetPage: React.FC<IProps> = (props) => {
  const { setBreadcrumbs, setRightHeader } = props;

  const { dataset_id: datasetID } = useParams<any>();
  const history = useHistory();
  const dispatch = useDispatch();

  const { data: dataset, pending } = useSelector(
    (state: RootState) => state.dataset
  );

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
        text: datasetID,
      },
    ]);
    setRightHeader([]);
  }, [setBreadcrumbs, setRightHeader, history, datasetID]);

  useEffect(() => {
    dispatch(fetchDataset(datasetID));
  }, [dispatch, datasetID]);

  const booleanLabels = dataset
    ? dataset.labels
        .filter((label) => label.variant === "boolean")
        .map((label) => label.name)
    : [];
  const booleanLabelsGroup = generateLabelsGroup(booleanLabels);

  const numericalLabels = dataset
    ? dataset.labels
        .filter((label) => label.variant === "numerical")
        .map((label) => label.name)
    : [];
  const numericalLabelsGroup = generateLabelsGroup(numericalLabels);

  const goToLabeling = () => history.push(`/datasets/${datasetID}/labeling`);

  const loadingEl = (
    <React.Fragment>
      <EuiSpacer style={{ minWidth: 300 }} size="l" />
      <EuiProgress size="s" />
    </React.Fragment>
  );

  return pending || dataset === undefined ? (
    loadingEl
  ) : (
    <React.Fragment>
      <EuiTitle size="m">
        <h1 style={{ textAlign: "center" }}>
          <EuiAvatar
            name="database"
            size="m"
            type="space"
            iconType="database"
            color="#E6F1FA"
            iconColor="primary"
            style={{ marginRight: "1em" }}
          />
          {dataset.name}
        </h1>
      </EuiTitle>

      <EuiSpacer size="m" />

      <EuiText style={{ textAlign: "center" }}>
        <p>{dataset.description}</p>
      </EuiText>

      <EuiSpacer size="xl" />

      <EuiFlexGroup justifyContent="center" gutterSize="m">
        <EuiFlexItem grow={false}>
          <EuiButton color="primary" onClick={goToLabeling} iconType="tag">
            Label samples
          </EuiButton>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <EuiButton color="text" onClick={() => {}} iconType="download">
            Export labels
          </EuiButton>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <EuiButton color="danger" onClick={() => {}} iconType="trash">
            Delete dataset
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer size="l" />

      <EuiHorizontalRule margin="xl" />

      <EuiText>
        <h2 style={{ textAlign: "center" }}>Labels</h2>
      </EuiText>

      <EuiSpacer size="m" />

      <EuiFlexGroup justifyContent="center">
        <EuiFlexItem grow={1} style={{ maxWidth: 300 }}>
          <EuiCard title="Boolean" description={booleanLabelsGroup} />
        </EuiFlexItem>

        <EuiFlexItem grow={1} style={{ maxWidth: 300 }}>
          <EuiCard title="Numerical" description={numericalLabelsGroup} />
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer size="l" />

      <EuiHorizontalRule margin="xl" />

      <EuiText>
        <h2 style={{ textAlign: "center" }}>Progress</h2>
      </EuiText>

      <EuiSpacer size="xl" />

      <div style={{ position: "relative", maxWidth: 350, margin: "auto" }}>
        <EuiCard
          icon={<EuiIcon size="xl" type="partial" />}
          title={`${Math.floor(dataset.labeled_percent * 100)}% Labeled`}
          description={ dataset.labeled_percent === 1 ? "" : (<EuiButton color="primary" onClick={goToLabeling}>
              Continue
            </EuiButton>)
          }
        />
        <EuiProgress
          size="s"
          max={100}
          value={dataset.labeled_percent * 100}
          position="absolute"
        />
      </div>
    </React.Fragment>
  );
};

export default ViewDatasetPage;
