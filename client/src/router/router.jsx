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
        element: <MyPostedJobs></MyPostedJobs>,
      },
      {
        path: "/jobs",
        element: <AllJobs></AllJobs>,
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
        element: <UpdateJob></UpdateJob>,
      },
      {
        path: "/job/:id",
        element: <JobDetails></JobDetails>,
      },
      {
        path: "/my-bids",
        element: <MyBids></MyBids>,
      },
      {
        path: "/bid-requests",
        element: <BidRequests></BidRequests>,
      },
    ],
  },
]);

export default router;
