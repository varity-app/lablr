import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { API_PREFIX } from "config";

interface Dataset {
  name: string;
  description: string;
  dataset_id: number;
  created_at: string;
}

interface State {
  data: Dataset[];
  pending: boolean;
}

export const fetchDatasets = createAsyncThunk(
  "datasets/fetchDatasets",
  async () => {
    const response = await axios.get(`${API_PREFIX}/datasets`);
    return response.data as Dataset[];
  }
);

const datasetsSlice = createSlice<State, {}, "datasets">({
  name: "datasets",
  initialState: {
    data: [],
    pending: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Datasets
    builder.addCase(fetchDatasets.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(fetchDatasets.fulfilled, (state, { payload }) => {
      state.data = payload;
      state.pending = false;
    });
    builder.addCase(fetchDatasets.rejected, (state, { payload }) => {
      state.pending = false;
      console.log(payload);
    });
  },
});

export default datasetsSlice.reducer;
