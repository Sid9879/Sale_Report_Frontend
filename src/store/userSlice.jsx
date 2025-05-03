import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage
const localData = localStorage.getItem('Sale_report');
const parsedData = localData ? JSON.parse(localData) : null;

const initialState = {
  isAuthenticated: parsedData?.user ? true : false,
  user: parsedData?.user || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser(state, action) {
      localStorage.setItem('Sale_report', JSON.stringify({ user: action.payload }));
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logOutUser(state) {
      localStorage.removeItem('Sale_report');
      state.isAuthenticated = false;
      state.user = null;
    }
  }
});

export const { loginUser, logOutUser } = userSlice.actions;
export default userSlice.reducer;
