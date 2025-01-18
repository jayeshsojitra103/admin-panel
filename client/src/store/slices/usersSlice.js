import api from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (filters) => {
    const response = await api.get("/users", {
      params: filters,
    });
    return response.data;
  }
);

export const approveUser = createAsyncThunk(
  "users/approveUser",
  async (userId, { dispatch }) => {
    try {
      await api.put(`/users/${userId}/approve`);
      dispatch(fetchUsers()); // Call fetchUsers after toggling the ban
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to toggle ban");
    }
  }
);

export const toggleBanUser = createAsyncThunk(
  "users/toggleBanUser",
  async (userId, { dispatch }) => {
    try {
      await api.put(`/users/${userId}/toggle-ban`);
      dispatch(fetchUsers()); // Call fetchUsers after toggling the ban
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to toggle ban");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
    filters: {
      search: "",
      startDate: null,
      endDate: null,
      page: 1,
      limit: 10,
    },
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalUsers = action.payload.totalUsers;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(approveUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(toggleBanUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
  },
});

export const { setFilters } = usersSlice.actions;
export default usersSlice.reducer;
