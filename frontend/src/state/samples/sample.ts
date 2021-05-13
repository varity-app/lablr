import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { API_PREFIX } from "config";
import { Sample, SampleMetadata, SamplesGetResponse } from "./types";

interface State {
  data?: Sample;
  metadata?: SampleMetadata;
  history: string[];
  pending: boolean;
}

// Fetch sample by ID
export const fetchSample = createAsyncThunk(
  "samples/fetchSample",
  async (args: { datasetID: string; sampleID: string }) => {
    const response = await axios.get(
      `${API_PREFIX}/datasets/${args.datasetID}/samples/${args.sampleID}`
    );
    return response.data as Sample;
  }
);

// Fetch latest unlabeled sample
export const fetchLatestSample = createAsyncThunk(
  "samples/fetchLatestSample",
  async (args: { datasetID: string; offset: number }) => {
    const response = await axios.get(
      `${API_PREFIX}/datasets/${args.datasetID}/samples`,
      { params: { labeled: false, offset: args.offset, limit: 1 } }
    );
    return response.data as SamplesGetResponse;
  }
);

// Create samples
export const createSamples = createAsyncThunk(
  "samples/createSamples",
  async (args: { datasetID: string; formData: FormData }) => {
    await axios.post(
      `${API_PREFIX}/datasets/${args.datasetID}/samples`,
      args.formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }
);

// Label sample
export const labelSample = createAsyncThunk(
  "samples/labelSample",
  async (args: {
    datasetID: string;
    sampleID: string;
    labels: Sample["labels"];
  }) => {
    await axios.put(
      `${API_PREFIX}/datasets/${args.datasetID}/samples/${args.sampleID}`,
      { labels: args.labels }
    );
  }
);

const sampleSlice = createSlice({
  name: "datasets",
  initialState: {
    pending: false,
    history: [],
  } as State,
  reducers: {
    resetHistory: (state: State) => {
      state.history = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch sample by ID
    builder.addCase(fetchSample.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(fetchSample.fulfilled, (state, { payload }) => {
      state.data = payload;
      state.pending = false;
    });
    builder.addCase(fetchSample.rejected, (state, { payload }) => {
      state.pending = false;
      console.log(payload);
    });

    // Fetch latset unlabeled sample
    builder.addCase(fetchLatestSample.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(fetchLatestSample.fulfilled, (state, { payload }) => {
      if (payload.samples.length) {
        const sample = payload.samples[0];
        state.data = sample;
        state.history = [sample.sample_id, ...state.history];
      } else {
        state.data = undefined;
      }
      state.metadata = payload.metadata;
      state.pending = false;
    });
    builder.addCase(fetchLatestSample.rejected, (state, { payload }) => {
      state.pending = false;
      console.log(payload);
    });

    // Label sample
    builder.addCase(labelSample.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(labelSample.fulfilled, (state) => {
      state.pending = false;
    });
    builder.addCase(labelSample.rejected, (state, { payload }) => {
      state.pending = false;
      console.log(payload);
    });

    // Create samples
    builder.addCase(createSamples.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(createSamples.fulfilled, (state) => {
      state.pending = false;
    });
    builder.addCase(createSamples.rejected, (state, { payload }) => {
      state.pending = false;
      console.log(payload);
    });
  },
});

export const { resetHistory } = sampleSlice.actions;

export default sampleSlice.reducer;
