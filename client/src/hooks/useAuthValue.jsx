import { useContext } from "react";
import { AuthContext } from "../context/AuthContexts";

const useAuthValue = () => useContext(AuthContext)

export default useAuthValue;