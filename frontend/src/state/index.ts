import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import datasetsReducer from "./datasets/datasets";
import datasetReducer from "./datasets/dataset";

const rootReducer = combineReducers({
  datasets: datasetsReducer,
  dataset: datasetReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default store;
