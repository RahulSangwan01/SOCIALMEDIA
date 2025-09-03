import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: (() => {
    try {
      return JSON.parse(window?.localStorage.getItem("theme")) ?? "dark";
    } catch (e) {
      return "dark"; // Default if parsing fails
    }
  })(),
};


const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem("theme", JSON.stringify(action.payload));
    },
  },
});

export default themeSlice.reducer;

export function SetTheme(value) {
  return (dispatch) => {
    dispatch(themeSlice.actions.setTheme(value));
  };
}