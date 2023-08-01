import { useEffect, useState } from "react";
import styles from "./Orders.module.css";
// import { useCartContext } from "../../context/CartContext";
import Loader from "../Loader/Loader";
// import { useAuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import { useCookieContext } from "../../context/CookieContext";
import { cartSelector } from "../../redux/reducers/cartReducer";

function OrderDetail() {
  // const { isLoggedIn, cookie } = useAuthContext();

  const { isLoggedIn } = useSelector(authSelector);

  const { cookie } = useCookieContext();

  // const { orders, loading } = useCartContext();
  const { orders, loadingCart } = useSelector(cartSelector);
  const [order, setOrder] = useState(null);

  const navigate = useNavigate();
  const { order_id } = useParams();

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
      let order_check = orders.find(
        (ele) => ele.order_id && ele.order_id === order_id
      );
      setOrder(order_check);
    }
  }, []);

  useEffect(() => {
    if (!cookie.user) {
      navigate("/");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    let order_check = orders.find(
      (ele) => ele.order_id && ele.order_id === order_id
    );
    setOrder(order_check);
  }, [orders]);

  return (
    <div className={styles.Orders}>
      {!isLoggedIn || loadingCart ? (
        <Loader />
      ) : order ? (
        <>
          <div className={styles.OrderHeader}>
            {/* <h1>Order ID : #{order.order_id}</h1> */}
            <table>
              <thead>
                <tr>
                  <th>Order Id</th>
                  <th>:</th>
                  <th>#{order.order_id}</th>
                </tr>
                <tr>
                  <th>Order Date</th>
                  <th>:</th>
                  <th>{order.ordered_at}</th>
                </tr>
                <tr>
                  <th>Total Price</th>
                  <th>:</th>
                  <th>Rs. {order.totalPrice}</th>
                </tr>
              </thead>
            </table>
          </div>
          <table className={styles.OrderTable}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className={styles.ItemImage}>
                    <img alt={item.title} src={item.image} />
                  </td>
                  <td>{item.title}</td>
                  <td>Rs. {item.price}</td>
                  <td>{item.qty}</td>
                  <td>Rs. {item.qty * item.price}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={4}>
                  <h3>Total Price</h3>
                </td>
                <td>
                  <h3>Rs. {order.totalPrice}</h3>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <div
          style={{
            width: "100%",
            marginTop: "100px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <h1>Order Details Not Found!!!</h1>
        </div>
      )}
    </div>
  );
}

export default OrderDetail;
