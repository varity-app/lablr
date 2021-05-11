import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";

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
  EuiBottomBar,
  EuiButton,
  EuiButtonIcon,
  EuiToolTip,
  EuiProgress,
} from "@elastic/eui";

interface IProps {
  setBreadcrumbs: Dispatch<SetStateAction<EuiBreadcrumb[]>>;
  setRightHeader: Dispatch<SetStateAction<JSX.Element[]>>;
}

const DUMBY_TEXT = `
I don't regularly make posts about individual securities...actually this would be my first. I'm tired of daily DD posts on companies that are at ATH, so here's a mini-DD on one that is still heavily discounted from Covid. And of course...this is not investment advice, do your own due diligence.

Let's look at where they made their business in 2020:\n

- $1.9 billion in revenue in orthopedics: mainly knee implants, hip implants, & trauma devices.

- $1.3 billion in sports medicine

- $1.3 billion in wound management

So we have a company that makes most of their revenue in sports, injuries, and hip/knees. Literally all things that were put on halt due to Covid. As to be expected, 2020 was a terrible year for them, with revenue down 11.2% and EPS down 25%. They also under-performed all their larger peers (i.e. Striker, Zimmer Biomet) whom thanks to more diversified products were not hit as hard.

I believe most of their under-performance is due to events that are transitory:
`;

const INITIAL_OPTIONS = [
  {
    label: "News",
    prepend: <EuiAvatar size="s" type="space" name="News" />,
    append: <EuiBadge>1</EuiBadge>,
  },
  {
    label: "DD/Analysis",
    prepend: <EuiAvatar size="s" type="space" name="DD/Analysis" />,
    append: <EuiBadge>2</EuiBadge>,
  },
  {
    label: "Inquisitive",
    prepend: <EuiAvatar size="s" type="space" name="Inquisitive" />,
    append: <EuiBadge>3</EuiBadge>,
  },
];

const LabelSamplesPage: React.FC<IProps> = (props) => {
  const { setBreadcrumbs, setRightHeader } = props;

  const [options, setOptions] = useState<EuiSelectableOption[]>(
    INITIAL_OPTIONS
  );

  const { dataset_id: datasetID } = useParams<any>();
  const history = useHistory();

  const selectOption = (keyNum: number) => {
    if (keyNum > options.length) return;
    let newOptions = [...options]; // Create clone of options

    // Update selected option
    let selectedOption = newOptions[keyNum - 1];
    selectedOption.checked = selectedOption.checked === "on" ? undefined : "on";
    newOptions[keyNum - 1] = selectedOption;

    setOptions(newOptions);
  };

  useHotkeys("1", () => selectOption(1));
  useHotkeys("2", () => selectOption(2));
  useHotkeys("3", () => selectOption(3));
  useHotkeys("4", () => selectOption(4));
  useHotkeys("5", () => selectOption(5));
  useHotkeys("6", () => selectOption(6));
  useHotkeys("7", () => selectOption(7));
  useHotkeys("8", () => selectOption(8));
  useHotkeys("9", () => selectOption(9));
  useHotkeys("0", () => selectOption(0));

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
    setRightHeader([
      <div>
        <EuiProgress
          label="3.2k / 10k Labeled"
          valueText
          max={100}
          value={32}
          color="success"
          size="s"
          style={{ minWidth: 200 }}
        />
      </div>,
    ]);
  }, [setBreadcrumbs, setRightHeader, history, datasetID]);

  return (
    <React.Fragment>
      <EuiSpacer size="m" />

      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel>
            <EuiMarkdownFormat>{DUMBY_TEXT}</EuiMarkdownFormat>
          </EuiPanel>
        </EuiFlexItem>

        <EuiFlexItem grow={false} style={{ minWidth: 400 }}>
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

          <EuiSpacer size="m" />

          <EuiTitle size="xxs">
            <h3>Sentiment</h3>
          </EuiTitle>

          <EuiSpacer size="xs" />

          <EuiRange
            value={0.5}
            min={-1.0}
            max={1.0}
            step={0.5}
            tickInterval={0.5}
            showTicks
            levels={[
              {
                min: -1,
                max: 0,
                color: "danger",
              },
              {
                min: 0,
                max: 1,
                color: "success",
              },
            ]}
          />
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiBottomBar>
        <EuiFlexGroup justifyContent="spaceBetween">
          <EuiFlexItem grow={false}>
            <EuiToolTip content="Move to previous sample. (a)">
              <EuiButtonIcon
                display="base"
                size="m"
                aria-label="previous sample"
                color="ghost"
                iconType="arrowLeft"
              />
            </EuiToolTip>
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiToolTip content="Save current labels and move to next sample. (space)">
              <EuiButton fill iconType="check" color="secondary">
                Save and continue
              </EuiButton>
            </EuiToolTip>
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiToolTip content="Move to next sample. (d)">
              <EuiButtonIcon
                display="base"
                size="m"
                aria-label="next sample"
                color="ghost"
                iconType="arrowRight"
              />
            </EuiToolTip>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiBottomBar>
    </React.Fragment>
  );
};

export default LabelSamplesPage;
