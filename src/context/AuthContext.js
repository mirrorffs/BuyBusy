import { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

const AuthContext = createContext();

export function useAuthContext() {
  const value = useContext(AuthContext);
  return value;
}

export default function CustomAuthContext({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState();
  const [cookie, setCookie, removeCookie] = useCookies(["user"]);

  const auth = getAuth();

  useEffect(() => {
    // console.log(cookie);
    if (cookie.user) {
      setIsLoggedIn(true);
      setUser(cookie.user);
    }
  }, []);

  function createUser(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const new_user = userCredential.user;
        // console.log(new_user);
        setIsLoggedIn(true);
        setUser(new_user);
        let d = new Date();
        d.setTime(d.getTime() + 2 * 60 * 60 * 1000);
        setCookie("user", new_user, { expires: d });
        toast.success("User Sign-Up Successfull");
      })
      .catch((error) => {
        // const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        toast.error(errorMessage);
      });
  }

  function signInUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const new_user = userCredential.user;
        // console.log(new_user);
        // console.log(auth);
        setIsLoggedIn(true);
        setUser(new_user);
        let d = new Date();
        d.setTime(d.getTime() + 2 * 60 * 60 * 1000);
        setCookie("user", new_user, { expires: d });
        toast.success("User Sign-In Successfull");
      })
      .catch((error) => {
        // const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        toast.error(errorMessage.split("Firebase:")[1]);
      });
  }

  function signOutUser() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setIsLoggedIn(false);
        removeCookie("user");
        toast.success("User Sign-Out Successfull");
      })
      .catch((error) => {
        // An error happened.
        // const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        toast.error(errorMessage);
      });
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        cookie,
        createUser,
        signInUser,
        signOutUser,
        cookie,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
