import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { API_PREFIX } from "config";
import { DatasetDetailed, DatasetCreate, Dataset } from "./types";

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

export const deleteDataset = createAsyncThunk(
  "/datasets/deleteDataset",
  async (datasetID: string) => {
    await axios.delete(`${API_PREFIX}/datasets/${datasetID}`);
    return {};
  }
);

export const createDataset = createAsyncThunk(
  "/datasets/createDataset",
  async (body: DatasetCreate) => {
    const response = await axios.post(`${API_PREFIX}/datasets`, body);
    return response.data as Dataset;
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

    // Delete Dataset
    builder.addCase(deleteDataset.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(deleteDataset.fulfilled, (state, action) => {
      state.pending = false;
    });
    builder.addCase(deleteDataset.rejected, (state, { payload }) => {
      state.pending = false;
      console.log(payload);
    });

    // Create Dataset
    builder.addCase(createDataset.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(createDataset.fulfilled, (state, action) => {
      state.pending = false;
    });
    builder.addCase(createDataset.rejected, (state, { payload }) => {
      state.pending = false;
      console.log(payload);
    });
  },
});

export default datasetSlice.reducer;
