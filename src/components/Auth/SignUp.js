import { Link, useNavigate } from "react-router-dom";
// import { useAuthContext } from "../../context/AuthContext";
import styles from "./Auth.module.css";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, createUser } from "../../redux/reducers/authReducer";
import Loader from "../Loader/Loader";
import { useCookieContext } from "../../context/CookieContext";

function SignUp() {
  // const { isLoggedIn,createUser } = useAuthContext();

  const dispatch = useDispatch();

  const { isLoggedIn, loadingAuth } = useSelector(authSelector);

  const {cookie} = useCookieContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingAuth && isLoggedIn) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (!loadingAuth && isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const nameRef = useRef();

  // function clearInput(){
  //   emailRef.current.value="";
  //   passwordRef.current.value="";
  //   confirmPasswordRef.current.value="";
  //   nameRef.current.value = "";
  // }

  const submitHandler = (e) => {
    e.preventDefault();
    // console.log(nameRef.current.value,emailRef.current.value, passwordRef.current.value, confirmPasswordRef.current.value);
    if (passwordRef.current.value != confirmPasswordRef.current.value) {
      // console.log("Password and Confirm are not same")
      toast.error("Password and Confirm Password are not same");
    } else {
      dispatch(
        createUser({
          email: emailRef.current.value,
          password: passwordRef.current.value,
          name: nameRef.current.value,
        })
      );
    }

    // clearInput();
  };

  return (
    <>
      {loadingAuth || isLoggedIn ? (
        <Loader />
      ) : (
        <form className={styles.AuthForm} onSubmit={(e) => submitHandler(e)}>
          <div className={styles.FormHeader}>
            <h1>SIGN UP</h1>
          </div>
          <div className={styles.FormItem}>
            <label>Name</label>
            <input type="text" ref={nameRef} required />
          </div>
          <div className={styles.FormItem}>
            <label>Email</label>
            <input type="email" ref={emailRef} required />
          </div>
          <div className={styles.FormItem}>
            <label>Password</label>
            <input type="password" ref={passwordRef} required />
          </div>
          <div className={styles.FormItem}>
            <label>Confirm Password</label>
            <input type="password" ref={confirmPasswordRef} required />
          </div>
          <div className={styles.ButtonItem}>
            <button type="submit">Sign Up</button>
            <Link to="/sign-in">
              <div>Sign In?</div>
            </Link>
          </div>
        </form>
      )}
    </>
  );
}

export default SignUp;
