import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

interface Toast {
  title: string;
  color: "danger" | "warning" | "success" | "primary";
  iconType?: string;
}

export interface IDToast extends Toast {
  id: string;
}

interface State {
  data: IDToast[];
}

const toastsSlice = createSlice({
  name: "datasets",
  initialState: {
    data: [],
  } as State,
  reducers: {
    resetState: (state: State) => {
      state.data = [];
    },
    addToast: (state: State, action: PayloadAction<Toast>) => {
      state.data.push({
        ...action.payload,
        id: nanoid(),
      });
    },
    removeToast: (state: State, action: PayloadAction<string>) => {
      const id = action.payload;
      state.data = state.data.filter((toast) => toast.id !== id);
    },
  },
});

export const { resetState, addToast, removeToast } = toastsSlice.actions;

export default toastsSlice.reducer;
