import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useParams, useHistory, Prompt } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { useSelector } from "react-redux";

import {
  EuiBreadcrumb,
  EuiSpacer,
  EuiTitle,
  EuiAvatar,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiMarkdownFormat,
  EuiSelectable,
  EuiSelectableOption,
  EuiBadge,
  EuiRange,
  EuiProgress,
  EuiLoadingContent,
  EuiText,
  EuiIcon,
} from "@elastic/eui";

import { RootState, useAppDispatch } from "state";
import { fetchDataset } from "state/datasets/dataset";
import {
  fetchSample,
  fetchLatestSample,
  labelSample,
  resetHistory,
} from "state/samples/sample";

import BottomBar from "./BottomBar";

interface IProps {
  setBreadcrumbs: Dispatch<SetStateAction<EuiBreadcrumb[]>>;
  setRightHeader: Dispatch<SetStateAction<JSX.Element[]>>;
}

interface Labels {
  [label: string]: number;
}

const LabelSamplesPage: React.FC<IProps> = (props) => {
  const { setBreadcrumbs, setRightHeader } = props;

  const [options, setOptions] = useState<EuiSelectableOption[]>([]);
  const [numericalLabels, setNumericalLabels] = useState<Labels>({});
  const [historyIdx, setHistoryIdx] = useState(0);

  const { dataset_id: datasetID } = useParams<any>();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const {
    data: sample,
    metadata,
    pending: samplePending,
    history: sampleHistory,
  } = useSelector((state: RootState) => state.sample);
  const { data: dataset, pending: datasetPending } = useSelector(
    (state: RootState) => state.dataset
  );

  // Keyboard shortcuts for boolean labels
  const selectOption = (keyNum: number) => {
    if (keyNum > options.length) return;
    let newOptions = [...options]; // Create clone of options

    // Update selected option
    let selectedOption = newOptions[keyNum - 1];
    selectedOption.checked = selectedOption.checked === "on" ? undefined : "on";
    newOptions[keyNum - 1] = selectedOption;

    setOptions(newOptions);
  };

  useHotkeys("1", () => selectOption(1), [options]);
  useHotkeys("2", () => selectOption(2), [options]);
  useHotkeys("3", () => selectOption(3), [options]);
  useHotkeys("4", () => selectOption(4), [options]);
  useHotkeys("5", () => selectOption(5), [options]);
  useHotkeys("6", () => selectOption(6), [options]);
  useHotkeys("7", () => selectOption(7), [options]);
  useHotkeys("8", () => selectOption(8), [options]);
  useHotkeys("9", () => selectOption(9), [options]);
  useHotkeys("0", () => selectOption(10), [options]);

  // Set header elements on mount
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
        href: `/datasets/${datasetID}`,
        onClick: (event) => {
          event.preventDefault();
          history.push(`/datasets/${datasetID}`);
        },
      },
      {
        text: "Labeling",
      },
    ]);
    if (metadata !== undefined)
      setRightHeader([
        <div>
          <EuiProgress
            label="Progress"
            valueText
            max={100}
            value={Math.floor(metadata.labeled_percent * 100)}
            color="success"
            size="s"
            style={{ minWidth: 200 }}
          />
        </div>,
      ]);
  }, [setBreadcrumbs, setRightHeader, history, datasetID, metadata]);

  const nextSample = () => {
    if (historyIdx === 0) {
      dispatch(
        fetchLatestSample({
          datasetID,
          offset: metadata === undefined ? 0 : metadata.pagination.offset + 1,
        })
      );
    } else {
      setHistoryIdx(historyIdx - 1);
      dispatch(
        fetchSample({ datasetID, sampleID: sampleHistory[historyIdx - 1] })
      );
    }
  };

  const saveAndContinue = () => {
    if (sample === undefined || datasetPending || samplePending) return;

    const labels = options.reduce(
      (acc, option) => {
        acc[option.label] = option.checked ? 1 : 0;
        return acc;
      },
      { ...numericalLabels }
    );

    if (historyIdx === 0) {
      dispatch(
        labelSample({ datasetID, sampleID: sample.sample_id, labels })
      ).then(() => {
        dispatch(
          fetchLatestSample({
            datasetID,
            offset: metadata === undefined ? 0 : metadata.pagination.offset,
          })
        );
      });
    } else {
      setHistoryIdx(historyIdx - 1);
      dispatch(
        labelSample({ datasetID, sampleID: sample.sample_id, labels })
      ).then(() => {
        dispatch(
          fetchSample({ datasetID, sampleID: sampleHistory[historyIdx - 1] })
        );
      });
    }
  };

  const prevSample = () => {
    if (historyIdx > sampleHistory.length - 2) return;
    setHistoryIdx(historyIdx + 1);
    dispatch(
      fetchSample({ datasetID, sampleID: sampleHistory[historyIdx + 1] })
    );
  };

  useHotkeys("d", nextSample, [datasetID, sample]);
  useHotkeys("a", prevSample, [datasetID, sample]);
  useHotkeys("space", saveAndContinue, [
    datasetID,
    sample,
    options,
    numericalLabels,
    samplePending,
    datasetPending,
  ]);

  // Fetch dataset and latest sample on mount
  useEffect(() => {
    dispatch(fetchDataset(datasetID));
  }, [dispatch, datasetID]);

  // Fetch latest sample when history resets
  useEffect(() => {
    if (sampleHistory.length > 0) return;
    dispatch(fetchLatestSample({ datasetID, offset: 0 }));
  }, [dispatch, datasetID, sampleHistory]);

  // Update label elements as dataset or sample updates
  useEffect(() => {
    if (dataset === undefined || sample === undefined) return;

    setOptions(
      dataset.labels
        .filter((label) => label.variant === "boolean")
        .map((label, i) => ({
          label: label.name,
          checked:
            sample.labels && sample.labels[label.name] === 1 ? "on" : undefined,
          prepend: <EuiAvatar size="s" type="space" name={label.name} />,
          append:
            i + 1 <= 10 ? (
              <EuiBadge>{i === 10 ? 0 : i + 1}</EuiBadge>
            ) : undefined,
        }))
    );

    setNumericalLabels(
      dataset.labels
        .filter((label) => label.variant === "numerical")
        .reduce((acc, cur) => {
          acc[cur.name] = (sample.labels && sample.labels[cur.name]) || 0;
          return acc;
        }, {} as Labels)
    );
  }, [dataset, sample]);

  const bottomBar = (
    <BottomBar
      historyIdx={historyIdx}
      saveAndContinue={saveAndContinue}
      nextSample={nextSample}
      prevSample={prevSample}
      onResetHistory={() => {
        setHistoryIdx(0);
        dispatch(resetHistory());
      }}
    />
  );

  if (
    !datasetPending &&
    !samplePending &&
    dataset !== undefined &&
    metadata &&
    metadata.pagination.next_offset === null
  )
    return (
      <React.Fragment>
        <div style={{ textAlign: "center" }}>
          {" "}
          <EuiIcon size="xxl" type="check" color="success" />
        </div>
        <EuiText>
          <p style={{ textAlign: "center" }}>
            No further samples to label. If the dataset is not 100% labeled, try
            reseting the history.
          </p>
        </EuiText>
        {bottomBar}
      </React.Fragment>
    );

  return (
    <React.Fragment>
      <Prompt
        when={sampleHistory.length > 1}
        message="Are you sure you want to leave the page?  You can come resume your labeling progress later."
      />
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel>
            {samplePending || sample === undefined ? (
              <EuiLoadingContent lines={3} />
            ) : (
              <EuiMarkdownFormat>{sample.text}</EuiMarkdownFormat>
            )}
          </EuiPanel>
        </EuiFlexItem>

        <EuiFlexItem grow={false} style={{ minWidth: 400 }}>
          {datasetPending || samplePending || dataset === undefined ? (
            <EuiLoadingContent lines={3} />
          ) : (
            <React.Fragment>
              <EuiTitle size="xxs">
                <h3>Tags</h3>
              </EuiTitle>

              <EuiSpacer size="xs" />

              <EuiSelectable
                listProps={{ bordered: true }}
                options={options}
                onChange={(newOptions) => setOptions(newOptions)}
              >
                {(list) => list}
              </EuiSelectable>
            </React.Fragment>
          )}

          <EuiSpacer size="m" />

          {datasetPending || samplePending || dataset === undefined ? (
            <EuiLoadingContent lines={3} />
          ) : (
            dataset.labels
              .filter((label) => label.variant === "numerical")
              .map((label) => {
                const levels: any[] = [];

                if (label.minimum !== undefined && label.minimum < 0)
                  levels.push({
                    min: Math.min(0, label.minimum),
                    max: 0,
                    color: "danger",
                  });

                if (label.maximum !== undefined && label.maximum > 0)
                  levels.push({
                    min: 0,
                    max: Math.max(0, label.maximum),
                    color: "success",
                  });

                return (
                  <React.Fragment key={label.name}>
                    <EuiTitle size="xxs">
                      <h3>{label.name}</h3>
                    </EuiTitle>

                    <EuiSpacer size="xs" />
                    <EuiRange
                      value={numericalLabels[label.name] || 0}
                      min={label.minimum}
                      max={label.maximum}
                      step={label.interval}
                      tickInterval={label.interval}
                      showTicks
                      onChange={(event: any) =>
                        setNumericalLabels({
                          ...numericalLabels,
                          [label.name]: event.target.value,
                        })
                      }
                      levels={levels}
                    />
                  </React.Fragment>
                );
              })
          )}
        </EuiFlexItem>
      </EuiFlexGroup>

      {bottomBar}
    </React.Fragment>
  );
};

export default LabelSamplesPage;
