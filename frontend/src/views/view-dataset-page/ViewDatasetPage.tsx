import React, { useEffect, Dispatch, SetStateAction } from "react";
import { useParams, useHistory } from "react-router-dom";

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

import LabelBadge from "./LabelBadge";

interface IProps {
  setBreadcrumbs: Dispatch<SetStateAction<EuiBreadcrumb[]>>;
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
  const { setBreadcrumbs } = props;

  const { dataset_id: datasetID } = useParams<any>();
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
        text: datasetID,
      },
    ]);
  }, [setBreadcrumbs, history, datasetID]);

  const booleanLabels = ["News", "Analysis", "Post"];
  const booleanLabelsGroup = generateLabelsGroup(booleanLabels);

  const numericalLabels = ["Confidence", "Sentiment"];
  const numericalLabelsGroup = generateLabelsGroup(numericalLabels);

  const goToLabeling = () => history.push(`/datasets/${datasetID}/labeling`);

  return (
    <React.Fragment>
      <EuiSpacer size="l" />
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
          Reddit Investing Submissions 2021
        </h1>
      </EuiTitle>

      <EuiSpacer size="m" />

      <EuiText>
        <p>
          Submissions from various investing-related subreddits from January to
          April 2021.
        </p>
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
        <EuiFlexItem grow={1} style={{ maxWidth: 500 }}>
          <EuiCard title="Boolean" description={booleanLabelsGroup} />
        </EuiFlexItem>

        <EuiFlexItem grow={1}>
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
          title="87% Labeled"
          description={
            <EuiButton color="primary" onClick={goToLabeling}>
              Continue
            </EuiButton>
          }
        />
        <EuiProgress size="s" max={100} value={87} position="absolute" />
      </div>
    </React.Fragment>
  );
};

export default ViewDatasetPage;
