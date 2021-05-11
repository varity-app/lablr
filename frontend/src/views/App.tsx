import React from "react";
import Router from "./Router";
import { Provider } from "react-redux";

import store from "../state";

function App() {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
}

export default App;
