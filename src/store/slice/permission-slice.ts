import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "@/modules/auth/auth.service";

export interface PermissionState {
  list: string[];
  loading: boolean;
  loaded: boolean;
}

const initialState: PermissionState = {
  list: [],
  loading: false,
  loaded: false,
};

export const fetchPermissions = createAsyncThunk(
  "permissions/fetch",
  async () => {
    return await AuthService.myPermissions();
  }
);

const permissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    clearPermissions(state) {
      state.list = [];
      state.loaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.loaded = false;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
        state.loaded = true;
      })
      .addCase(fetchPermissions.rejected, (state) => {
        state.loading = false;
        state.loaded = true;
      });
  },
});

export const { clearPermissions } = permissionSlice.actions;
export default permissionSlice.reducer;
