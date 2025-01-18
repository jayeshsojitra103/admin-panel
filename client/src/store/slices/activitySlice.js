import api from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchActivityLogs = createAsyncThunk(
  "activity/fetchLogs",
  async (filters) => {
    const response = await api.get("/activity", {
      params: filters,
    });
    return response.data;
  }
);

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    logs: [],
    loading: false,
    error: null,
    filters: {
      startDate: null,
      endDate: null,
      userId: null,
      actionType: null,
      page: 1,
      limit: 10,
    },
    currentPage: 1,
    totalPages: 1,
    totalLogs: 0,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.logs;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalLogs = action.payload.totalLogs;
        state.error = null;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters } = activitySlice.actions;
export default activitySlice.reducer;
