import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { API_PREFIX } from "config";
import { DatasetDetailed } from "./types";

interface State {
  data?: DatasetDetailed;
  pending: boolean;
}

export const fetchDataset = createAsyncThunk(
  "datasets/fetchDataset",
  async (datasetID: string) => {
    const response = await axios.get(`${API_PREFIX}/datasets/${datasetID}`);
    return response.data as DatasetDetailed;
  }
);

const datasetSlice = createSlice<State, {}, "datasets">({
  name: "datasets",
  initialState: {
    pending: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Dataset
    builder.addCase(fetchDataset.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(fetchDataset.fulfilled, (state, { payload }) => {
      state.data = payload;
      state.pending = false;
    });
    builder.addCase(fetchDataset.rejected, (state, { payload }) => {
      state.pending = false;
      console.log(payload);
    });
  },
});

export default datasetSlice.reducer;
