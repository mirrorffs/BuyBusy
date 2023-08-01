import { Link, useNavigate } from "react-router-dom";
// import { useAuthContext } from "../../context/AuthContext";
import styles from "./Auth.module.css";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, signInUser } from "../../redux/reducers/authReducer";
import Loader from "../Loader/Loader";
import { useCookieContext } from "../../context/CookieContext";

function SignIn() {
  // const { isLoggedIn,signInUser } = useAuthContext();

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
  }, [isLoggedIn, loadingAuth]);

  const emailRef = useRef();
  const passwordRef = useRef();

  // function clearInput(){
  //   emailRef.current.value="";
  //   passwordRef.current.value="";
  // }

  const submitHandler = (e) => {
    e.preventDefault();
    // console.log(emailRef.current.value, passwordRef.current.value);
    dispatch(
      signInUser({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
    );
    // clearInput();
  };

  return (
    <>
      {/* {console.log(loadingAuth, isLoggedIn, loadingAuth || isLoggedIn)} */}
      {loadingAuth || isLoggedIn ? (
        <Loader />
      ) : (
        <form className={styles.AuthForm} onSubmit={(e) => submitHandler(e)}>
          <div className={styles.FormHeader}>
            <h1>SIGN IN</h1>
          </div>
          <div className={styles.FormItem}>
            <label>Email</label>
            <input type="email" ref={emailRef} required />
          </div>
          <div className={styles.FormItem}>
            <label>Password</label>
            <input type="password" ref={passwordRef} required />
          </div>
          <div className={styles.ButtonItem}>
            <button type="submit">Sign In</button>
            <Link to="/sign-up">
              <div>Sign Up?</div>
            </Link>
          </div>
        </form>
      )}
    </>
  );
}

export default SignIn;
