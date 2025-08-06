import { useEffect } from "react";

const useScrollTo = () => {
  return useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};

export default useScrollTo;
