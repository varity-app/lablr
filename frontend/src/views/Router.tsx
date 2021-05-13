import React, { useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import {
  EuiBreadcrumb,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
} from "@elastic/eui";

import ViewDatasetsPage from "./view-datasets-page/ViewDatasetsPage";
import ViewDatasetPage from "./view-dataset-page/ViewDatasetPage";
import CreateDatasetPage from "./create-dataset-page/CreateDatasetPage";
import LabelSamplesPage from "./label-samples-page/LabelSamplesPage";

import Header from "./components/Header";

const Router: React.FC = () => {
  const [breadcrumbs, setBreadcrumbs] = useState<EuiBreadcrumb[]>([]);
  const [rightHeader, setRightHeader] = useState<JSX.Element[]>([]);

  return (
    <BrowserRouter>
      <Header breadcrumbs={breadcrumbs} rightSection={rightHeader} />

      <EuiPage paddingSize="m">
        <EuiPageBody
          panelled
          color="transparent"
          panelProps={{ hasShadow: false }}
        >
          <EuiPageContent
            hasBorder={false}
            hasShadow={false}
            color="transparent"
            borderRadius="none"
            horizontalPosition="center"
            style={{ width: "100%" }}
          >
            <EuiPageContentBody restrictWidth>
              <Switch>
                <Route path="/" exact>
                  <Redirect to="/datasets" />
                </Route>

                <Route path="/datasets" exact>
                  <ViewDatasetsPage
                    setBreadcrumbs={setBreadcrumbs}
                    setRightHeader={setRightHeader}
                  />
                </Route>

                <Route path="/datasets/create" exact>
                  <CreateDatasetPage
                    setBreadcrumbs={setBreadcrumbs}
                    setRightHeader={setRightHeader}
                  />
                </Route>

                <Route path="/datasets/:dataset_id" exact>
                  <ViewDatasetPage
                    setBreadcrumbs={setBreadcrumbs}
                    setRightHeader={setRightHeader}
                  />
                </Route>

                <Route path="/datasets/:dataset_id/labeling" exact>
                  <LabelSamplesPage
                    setBreadcrumbs={setBreadcrumbs}
                    setRightHeader={setRightHeader}
                  />
                </Route>
              </Switch>
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    </BrowserRouter>
  );
};

export default Router;
