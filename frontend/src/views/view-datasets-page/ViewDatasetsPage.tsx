import React from "react";

import Header from "../components/Header";

const ViewDatasetPage: React.FC = () => {
  const breadcrumbs = [
    {
      text: "Datasets",
    },
  ];

  return (
    <React.Fragment>
      <Header breadcrumbs={breadcrumbs} />
    </React.Fragment>
  );
};

export default ViewDatasetPage;
