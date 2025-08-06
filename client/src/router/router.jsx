import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ErrorPage from "../components/ErrorPage";
import Home from "../pages/Home";
import AddJob from "../pages/AddJob";
import MyPostedJobs from "../pages/MyPostedJobs";
import AllJobs from "../pages/AllJobs";
import Login from "../pages/Authentication/Login";
import Registration from "../pages/Authentication/Register";
import UpdateJob from "../pages/UpdateJob";
import JobDetails from "../pages/JobDetails";
import MyBids from "../pages/MyBids";
import BidRequests from "../pages/BidRequests";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "/add-job",
        element: <AddJob></AddJob>,
      },
      {
        path: "/my-posted-jobs",
        element: (
          <PrivateRoute>
            <MyPostedJobs></MyPostedJobs>
          </PrivateRoute>
        ),
      },
      {
        path: "/jobs",
        element: (
          <PrivateRoute>
            <AllJobs></AllJobs>
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/registration",
        element: <Registration></Registration>,
      },
      {
        path: "/update/:id",
        element: (
          <PrivateRoute>
            <UpdateJob></UpdateJob>
          </PrivateRoute>
        ),
      },
      {
        path: "/job/:id",
        element: (
          <PrivateRoute>
            <JobDetails></JobDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "/my-bids",
        element: (
          <PrivateRoute>
            <MyBids></MyBids>
          </PrivateRoute>
        ),
      },
      {
        path: "/bid-requests",
        element: (
          <PrivateRoute>
            <BidRequests></BidRequests>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
