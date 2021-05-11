import React from "react";

import { EuiHeader, EuiText, EuiBreadcrumb } from "@elastic/eui";

interface IProps {
  breadcrumbs: EuiBreadcrumb[];
  rightSection?: JSX.Element[];
}

const Header: React.FC<IProps> = (props) => {
  const { breadcrumbs, rightSection } = props;

  const renderSpaces = (
    <EuiText>
      <h4>Lablr.</h4>
    </EuiText>
  );

  const sections = [
    {
      items: [renderSpaces],
      breadcrumbs: breadcrumbs,
    },
    {
      items: rightSection || [],
    },
  ];

  return <EuiHeader sections={sections} />;
};

export default Header;
