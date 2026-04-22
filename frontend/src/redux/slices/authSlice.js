import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false, // isLoggedIn
  user: null, // User object
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.status = false;
      state.user = null;
    },
    updateUser: (state, action) => {
      // For updating profile details without re-login
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;