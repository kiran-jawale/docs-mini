import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    type: null,    // 'user' or 'employee'
    status: false, // Matches your AuthLayout.jsx check
  },
  reducers: {
    login: (state, action) => {
      // action.payload should be { user: {...}, type: "..." }
      state.user = action.payload.user;
      state.type = action.payload.type;
      state.status = true;
    },
    logout: (state) => {
      state.user = null;
      state.type = null;
      state.status = false;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;