import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthValue from "./useAuthValue";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
const useAxiosSecure = () => {
  const { logOut } = useAuthValue();
  const nav = useNavigate();

  useEffect(() => {
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.status === 401 || err.status === 403) {
          toast.error(err?.response?.data?.message || err.message);
          logOut().then(() => nav(`/login`));
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [nav, logOut]);

  return axiosInstance;
};

export default useAxiosSecure;
