import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import datasetsReducer from "./datasets/datasets";

const rootReducer = combineReducers({
  datasets: datasetsReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default store;
