import { useEffect } from "react";
import styles from "./Orders.module.css";
// import { useCartContext } from "../../context/CartContext";
import Loader from "../Loader/Loader";
// import { useAuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import { useCookieContext } from "../../context/CookieContext";
import { cartActions, cartSelector } from "../../redux/reducers/cartReducer";

function Orders() {
  // const { isLoggedIn, cookie } = useAuthContext();

  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector(authSelector);

  // const { orders, loading, setOrderPlaced } = useCartContext();

  const { orders, loadingCart } = useSelector(cartSelector);

  const { cookie } = useCookieContext();

  const navigate = useNavigate();

  // function getOrderDate(timestamp) {
  //   return (
  //     timestamp.toDate().toLocaleDateString() +
  //     "," +
  //     timestamp.toDate().toLocaleTimeString("en-Us")
  //   );
  // }

  useEffect(() => {
    if (!cookie.user) {
      navigate("/");
    } else {
      dispatch(cartActions.resetOrderPlaced());
    }
  }, []);

  useEffect(() => {
    if (!cookie.user) {
      navigate("/");
    }
  }, [isLoggedIn]);

  return (
    <div className={styles.Orders}>
      {!isLoggedIn || loadingCart ? (
        <Loader />
      ) : orders ? (
        orders.length === 0 ? (
          <div
            style={{
              width: "100%",
              marginTop: "100px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <h1>No Order Placed Yet!!!</h1>
          </div>
        ) : (
          <>
            <div className={styles.OrderHeader}>
              <h1>Your Orders</h1>
            </div>
            <table className={styles.OrderTable}>
              <thead>
                <tr>
                  <th>Order Id</th>
                  <th>Order Date</th>
                  <th>Total Price</th>
                  <th>View Details</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.order_id}</td>
                    <td>{order.ordered_at}</td>
                    <td>Rs. {order.totalPrice}</td>
                    <td>
                      <Link to={`/order-detail/${order.order_id}`}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )
      ) : (
        <div
          style={{
            width: "100%",
            marginTop: "100px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <h1>No Order Placed Yet!!!</h1>
        </div>
      )}
    </div>
  );
}

export default Orders;
