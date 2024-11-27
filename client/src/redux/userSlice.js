import { createSlice } from "@reduxjs/toolkit";
import { user } from "../assets/data";

const initialState = {
  user: JSON.parse(window?.localStorage.getItem("user")) ?? {},
  edit: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      localStorage?.removeItem("user");
    },
    updateProfile(state, action) {
      state.edit = action.payload;
    },
  },
});
export default userSlice.reducer;

export function UserLogin(user) {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.login(user));
  };
}

export function Logout() {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.logout());
  };
}

export function UpdateProfile(val) {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.updateProfile(val));
  };
}


// import { createSlice } from "@reduxjs/toolkit";
// import { user } from "../assets/data";

// const initialState = {
//   user: JSON.parse(window?.localStorage.getItem("user")) ?? {},
//   edit: false,
//   suggestedFriends: [],  // Add the suggestedFriends state here
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     login(state, action) {
//       state.user = action.payload;
//       localStorage.setItem("user", JSON.stringify(action.payload));
//     },
//     logout(state) {
//       state.user = null;
//       localStorage?.removeItem("user");
//     },
//     updateProfile(state, action) {
//       state.edit = action.payload;
//     },
//     setSuggestedFriends(state, action) {  // Add this action to update suggested friends
//       state.suggestedFriends = action.payload;
//     },
//   },
// });

// export default userSlice.reducer;

// export function UserLogin(user) {
//   return (dispatch, getState) => {
//     dispatch(userSlice.actions.login(user));
//   };
// }

// export function Logout() {
//   return (dispatch, getState) => {
//     dispatch(userSlice.actions.logout());
//   };
// }

// export function UpdateProfile(val) {
//   return (dispatch, getState) => {
//     dispatch(userSlice.actions.updateProfile(val));
//   };
// }

// export function SetSuggestedFriends(friends) {  // Export this action for dispatch
//   return (dispatch, getState) => {
//     dispatch(userSlice.actions.setSuggestedFriends(friends));
//   };
// }

