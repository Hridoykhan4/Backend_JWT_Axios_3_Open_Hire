import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import useAuthValue from "../hooks/useAuthValue";

const PrivateRoute = ({ children }) => {
  const { loading, user } = useAuthValue();
  const { pathname } = useLocation();
  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: pathname }}
        replace={true}
      ></Navigate>
    );
  }

  return children;
};

export default PrivateRoute;
