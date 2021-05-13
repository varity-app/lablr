import React from "react";
import { useSelector } from "react-redux";

import {
  EuiBottomBar,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButtonIcon,
  EuiButton,
  EuiToolTip,
} from "@elastic/eui";

import { RootState } from "state";

interface IProps {
  historyIdx: number;
  onResetHistory: () => void;
  saveAndContinue: () => void;
  nextSample: () => void;
  prevSample: () => void;
}

const BottomBar: React.FC<IProps> = (props) => {
  const {
    saveAndContinue,
    nextSample,
    prevSample,
    historyIdx,
    onResetHistory,
  } = props;

  const { history: sampleHistory, data: sample } = useSelector(
    (state: RootState) => state.sample
  );

  return (
    <EuiBottomBar>
      <EuiFlexGroup justifyContent="spaceBetween">
        <EuiFlexItem grow={false}>
          <EuiToolTip content="Move to previous sample. (a)">
            <EuiButtonIcon
              display="base"
              size="m"
              aria-label="previous sample"
              color={historyIdx > sampleHistory.length - 2 ? "text" : "ghost"}
              iconType="arrowLeft"
              onClick={prevSample}
              disabled={historyIdx > sampleHistory.length - 2}
            />
          </EuiToolTip>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <EuiFlexGroup gutterSize="s">
            <EuiFlexItem grow={false}>
              <EuiToolTip content="Save current labels and move to next sample. (space)">
                <EuiButton
                  fill
                  iconType="check"
                  color="secondary"
                  onClick={saveAndContinue}
                  disabled={sample === undefined}
                >
                  Save and continue
                </EuiButton>
              </EuiToolTip>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <EuiToolTip content="Refresh sample history and reset to the first unlabeled sample">
                <EuiButton
                  iconType="refresh"
                  color="ghost"
                  disabled={sampleHistory.length < 2}
                  onClick={onResetHistory}
                >
                  Reset history
                </EuiButton>
              </EuiToolTip>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <EuiToolTip content="Move to next sample. (d)">
            <EuiButtonIcon
              display="base"
              size="m"
              aria-label="next sample"
              color="ghost"
              iconType="arrowRight"
              onClick={nextSample}
            />
          </EuiToolTip>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiBottomBar>
  );
};

export default BottomBar;
