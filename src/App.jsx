import { RouterProvider, createHashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from "@mui/material/styles";
import Layout from "./components/layout/Layout.jsx";
import Login from "./components/login/Login.jsx";
import Signup from "./components/signup/Signup.jsx";
import NewMeeting from "./components/secretary/Meeting/new meeting/NewMeeting.jsx";
import MeetingDetails from "./components/manager/meetingDetails/meetingDetails.jsx";
import UpdateMeeting from "./components/secretary/Meeting/update meeting/UpdateMeeting.jsx";
import Meetings from "./components/secretary/Meeting/meetings/Meetings.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";
import Calender from "./components/manager/Calender/Calender.jsx";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar/Navbar.jsx";
import CreateManagerAccount from "./components/secretary/Meeting/create manager account/CreateManagerAccount";
import ProtectedRoutes from "./components/Protected Routes/ProtectedRoutes.jsx";

const router = createHashRouter([
  {
    path: "/", element: <ProtectedRoutes><Layout /></ProtectedRoutes>,
    children: [
      {
        path: "/",
        element: <ProtectedRoutes><HomePage /></ProtectedRoutes>,
      },
      {
        path: "home",
        element: <ProtectedRoutes><HomePage /></ProtectedRoutes>,
      },
      {
        path: "/meeting",
        children: [
          {
            path: "",
            element: <ProtectedRoutes><Meetings /></ProtectedRoutes>,
          },
          {
            path: "addMeeting",
            element: <ProtectedRoutes><NewMeeting /></ProtectedRoutes>,
          },
          {
            path: "updateMeeting/:id",
            element: <ProtectedRoutes><UpdateMeeting /></ProtectedRoutes>,
          },
          {
            path: "createManagerAccount",
            element: <ProtectedRoutes><CreateManagerAccount /></ProtectedRoutes>,
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },

      {
        path: "/manager",
        children: [
          { path: "", element: <ProtectedRoutes><HomePage /></ProtectedRoutes> },
          {
            path: "meetingDetails",
            element: <ProtectedRoutes><MeetingDetails /></ProtectedRoutes>,
          },
          {
            path: "calender",
            element: <ProtectedRoutes><Calender /></ProtectedRoutes>,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <>
        <Navbar />
        <Login />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <Navbar /> <Signup />
      </>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
function App() {
  const client = new QueryClient();
  return (
    <>
      <QueryClientProvider client={client}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider theme={{}}>
            <RouterProvider router={router} />
          </ThemeProvider>
        </LocalizationProvider>
        <Toaster />
      </QueryClientProvider>
    </>
  );
}

export default App;
