import api from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAnalytics = createAsyncThunk(
  "analytics/fetchAnalytics",
  async (filters) => {
    const response = await api.get("/analytics", { params: filters });
    return response.data;
  }
);

export const updateDailyAnalytics = createAsyncThunk(
  "analytics/updateDaily",
  async (data) => {
    const response = await api.post("/analytics", data);
    return response.data;
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    data: null,
    loading: false,
    error: null,
    filters: {
      filters: {
        startDate: null,
        endDate: null,
        page: 1,
        limit: 10,
      },
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.data = action.payload.analytics;
        state.currentPage = action.payload.currentPage;
        state.totalAnalytics = action.payload.totalAnalytics;
        state.totalPages = action.payload.totalPages;

        state.error = null;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters } = analyticsSlice.actions;
export default analyticsSlice.reducer;
