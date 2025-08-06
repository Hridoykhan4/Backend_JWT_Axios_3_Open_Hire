import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

// import axios from "axios";
import { AuthContext } from "../context/AuthContexts";
import app from "../firebase/firebase.config";
import axios from "axios";
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = async (email, password) => {
    setLoading(true);
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await axiosSecure.post("/jwt", { email: result.user.email });
    return result;
  };

  const signIn = async (email, password) => {
    setLoading(true);
    const result = await signInWithEmailAndPassword(auth, email, password);
    await axiosSecure.post("/jwt", { email: result.user.email });
    return result;
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);
    await axiosSecure.post("/jwt", { email: result.user.email });
    return result;
  };

  const logOut = async () => {
    setLoading(true);
    const result = await signOut(auth);
    await axiosSecure("/logout");
    return result;
  };

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  // onAuthStateChange
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      //   console.log("CurrentUser-->", currentUser);
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      return unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    createUser,
    signIn,
    signInWithGoogle,
    logOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
