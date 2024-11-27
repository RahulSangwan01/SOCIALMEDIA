import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Login, Profile, Register, ResetPassword } from "./pages";

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
}

function App() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div data-theme={theme} className='w-full min-h-[100vh]'>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/profile/:id?' element={<Profile />} />
        </Route>

        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;




// import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { Home, Login, Profile, Register, ResetPassword } from "./pages";
// import { useDispatch } from "react-redux";
// import { SetSuggestedFriends } from "./redux/userSlice"; // Import SetSuggestedFriends action
// import { apiRequest } from "./utils"; // Import your apiRequest function

// function Layout() {
//   const { user } = useSelector((state) => state.user);
//   const location = useLocation();
//   const dispatch = useDispatch();

//   // Fetch suggested friends if the user is logged in
//   const fetchSuggestedFriends = async () => {
//     try {
//       const res = await apiRequest({
//         url: "/users/suggested-friends",
//         token: user?.token,
//         method: "POST",
//       });
//       dispatch(SetSuggestedFriends(res?.data)); // Dispatch to Redux store
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Fetch suggested friends only if user is logged in
//   if (user?.token) {
//     fetchSuggestedFriends();
//   }

//   return user?.token ? (
//     <Outlet />
//   ) : (
//     <Navigate to='/login' state={{ from: location }} replace />
//   );
// }

// function App() {
//   const { theme } = useSelector((state) => state.theme);

//   return (
//     <div data-theme={theme} className='w-full min-h-[100vh]'>
//       <Routes>
//         <Route element={<Layout />}>
//           <Route path='/' element={<Home />} />
//           <Route path='/profile/:id?' element={<Profile />} />
//         </Route>

//         <Route path='/register' element={<Register />} />
//         <Route path='/login' element={<Login />} />
//         <Route path='/reset-password' element={<ResetPassword />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
