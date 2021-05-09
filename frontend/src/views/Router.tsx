import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import ViewDatasetsPage from "./view-datasets-page/ViewDatasetsPage";

const Router: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact>
        <Redirect to="/datasets" />
      </Route>

      <Route path="/datasets" exact component={ViewDatasetsPage} />

      <Route path="/datasets/create" exact />
      <Route path="/datasets/:dataset_id" />
      <Route path="/datasets/:dataset_id/label" />
    </Switch>
  </BrowserRouter>
);

export default Router;
