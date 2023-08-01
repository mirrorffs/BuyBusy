import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Navbar from "./components/Navbar/Navbar";
import MainBody from "./components/MainBody/MainBody";
import ProductsList from "./components/ProductsList/ProductsList";
import FilterBox from "./components/FilterBox/FilterBox";
// import CustomProductContext from "./context/ProductContext";
// import CustomAuthContext from "./context/AuthContext";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
// import CustomCartContext from "./context/CartContext";
import Cart from "./components/Cart/Cart";
import Orders from "./components/Orders/Orders";
import Page404 from "./components/pages/Page404";
import OrderDetail from "./components/Orders/OrderDetail";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  notificationActions,
  notificationSelector,
} from "./redux/reducers/notificationReducer";
import { authActions, authSelector } from "./redux/reducers/authReducer";
import { useCookieContext } from "./context/CookieContext";
import {
  fetchAllCategories,
  fetchAllProducts,
  productActions,
  productSelector,
} from "./redux/reducers/productReducer";
import { setInitialState } from "./redux/reducers/cartReducer";
// import { useCookies } from "react-cookie";

function App() {
  const { cookie, setCookie, removeCookie } = useCookieContext();
  // const [cookie, setCookie, removeCookie] = useCookies(["user"]);

  const dispatch = useDispatch();

  const { success_notification, error_notification } =
    useSelector(notificationSelector);

  const { isLoggedIn, user } = useSelector(authSelector);

  const { searchText, inputPrice, inputCategories } =
    useSelector(productSelector);

  useEffect(() => {
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = "https://img.icons8.com/?size=1x&id=rBQmeaLgDfht&format=png";
  }, []);

  useEffect(() => {
    if (cookie.user) {
      dispatch(authActions.login({ user: cookie.user }));
    } else {
      dispatch(authActions.logout());
    }
  }, []);

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllCategories());
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      let d = new Date();
      d.setTime(d.getTime() + 2 * 60 * 60 * 1000);
      setCookie("user", user, { expires: d });
      dispatch(setInitialState({ user }));
    } else {
      removeCookie("user");
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (error_notification) {
      toast.error(error_notification);
    } else if (success_notification) {
      toast.success(success_notification);
    }
    dispatch(notificationActions.reset());
  }, [success_notification, error_notification]);

  useEffect(() => {
    dispatch(productActions.filterProducts());
  }, [searchText, inputPrice, inputCategories]);

  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      errorElement: <Page404 />,
      children: [
        {
          index: true,
          element: (
            <MainBody>
              <ProductsList />
              <FilterBox />
            </MainBody>
          ),
        },
        {
          path: "sign-in",
          element: (
            <MainBody>
              <SignIn />
            </MainBody>
          ),
        },
        {
          path: "sign-up",
          element: (
            <MainBody>
              <SignUp />
            </MainBody>
          ),
        },
        {
          path: "cart",
          element: (
            <MainBody>
              <Cart />
            </MainBody>
          ),
        },
        {
          path: "orders",
          element: (
            <MainBody>
              <Orders />
            </MainBody>
          ),
        },
        {
          path: "order-detail/:order_id",
          element: (
            <MainBody>
              <OrderDetail />
            </MainBody>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <ToastContainer style={{ marginTop: "60px" }} />
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
