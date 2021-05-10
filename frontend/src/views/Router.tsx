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

import Header from "./components/Header";

const Router: React.FC = () => {
  const [breadcrumbs, setBreadcrumbs] = useState<EuiBreadcrumb[]>([]);

  return (
    <BrowserRouter>
      <Header breadcrumbs={breadcrumbs} />

      <EuiPage paddingSize="none">
        <EuiPageBody panelled panelProps={{ hasShadow: false }}>
          <EuiPageContent
            hasBorder={false}
            hasShadow={false}
            paddingSize="none"
            color="transparent"
            borderRadius="none"
            horizontalPosition="center"
          >
            <EuiPageContentBody>
              <Switch>
                <Route path="/" exact>
                  <Redirect to="/datasets" />
                </Route>

                <Route path="/datasets" exact>
                  <ViewDatasetsPage setBreadcrumbs={setBreadcrumbs} />
                </Route>

                <Route path="/datasets/create" exact>
                  <CreateDatasetPage setBreadcrumbs={setBreadcrumbs} />
                </Route>
                <Route path="/datasets/:dataset_id">
                  <ViewDatasetPage setBreadcrumbs={setBreadcrumbs} />
                </Route>
                <Route path="/datasets/:dataset_id/label" />
              </Switch>
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    </BrowserRouter>
  );
};

export default Router;
