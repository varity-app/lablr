import React from "react";

import { EuiBadge } from "@elastic/eui";

interface IProps {
  color: string;
  children: string;
}

const LabelBadge: React.FC<IProps> = (props) => {
  const { color, children } = props;

  return (
    <span style={{ margin: ".125em .25em", display: "inline-block" }}>
      <EuiBadge color={color}>{children}</EuiBadge>
    </span>
  );
};

export default LabelBadge;
