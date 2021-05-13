import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { combineReducers } from "redux";

import datasetsReducer from "./datasets/datasets";
import datasetReducer from "./datasets/dataset";

import sampleReducer from "./samples/sample";

import toastsReducer from "./toasts/toasts";

const rootReducer = combineReducers({
  datasets: datasetsReducer,
  dataset: datasetReducer,
  sample: sampleReducer,
  toasts: toastsReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
