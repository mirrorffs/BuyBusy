import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../firebaseInit";
import {
  doc,
  collection,
  addDoc,
  // setDoc,
  // getDocs,
  // deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
// import { useAuthContext } from "./AuthContext";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { authSelector } from "../redux/reducers/authReducer";

const CartContext = createContext();

export function useCartContext() {
  const value = useContext(CartContext);
  return value;
}

export default function CustomCartContext({ children }) {
  const [cart, setCart] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // const { isLoggedIn, user } = useAuthContext();
  const { isLoggedIn, user } = useSelector(authSelector);

  useEffect(() => {
    if (isLoggedIn) {
      getData();
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getData();
    } else {
      setCart(null);
      setOrders([]);
    }
  }, [isLoggedIn]);

  const getData = async () => {
    setLoading(true);
    let docRef = collection(db, "carts");
    let q = query(
      docRef,
      where("uid", "==", user.uid),
      orderBy("created_at", "desc")
    );
    onSnapshot(q, (snapShot) => {
      const data = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      let cart_arr = data.filter((ele) => ele.ordered === false);
      let orders_arr = data.filter((ele) => ele.ordered === true);
      setOrders(orders_arr);
      if (cart_arr.length > 0) {
        // console.log(cart_arr[0]);
        setCart(cart_arr[0]);
      } else {
        setCart(null);
        // createCart();
      }
      setLoading(false);
    });
  };

  const createCart = async (product, msg = null) => {
    try {
      const docNew = {
        uid: user.uid,
        items: [{ ...product, qty: 1 }],
        totalPrice: product.price,
        ordered: false,
        created_at: new Date(),
      };

      const docRef = collection(db, "carts");
      await addDoc(docRef, docNew);
      //   setCart({ id: newDocRef.id, ...docNew });
      if (msg) {
        toast.success(msg);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const updateCart = async (items, totalPrice, msg) => {
    try {
      const docRef = doc(db, "carts", cart.id);
      await updateDoc(docRef, { items, totalPrice });
      if (msg) {
        toast.success(msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong!!!");
    } finally {
    }
  };

  const addToCart = (product) => {
    if (!cart) {
      //   toast.error("Something Went Wrong!!! \n Please Try Again Later");
      //   return;
      let msg = "Product Added To Cart";
      createCart(product, msg);
    } else {
      let items = cart.items;
      let totalPrice = cart.totalPrice + product.price;
      let msg = "";
      let index = items.findIndex((item) => item.id === product.id);
      if (index === -1) {
        items = [{ ...product, qty: 1 }, ...items];
        msg = "Product Added To Cart";
      } else {
        items[index].qty++;
        msg = null;
      }
      updateCart(items, totalPrice, msg);
    }
  };

  const decreaseQty = (product) => {
    let items = cart.items;
    let totalPrice = cart.totalPrice - product.price;
    let msg = null;
    let index = items.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      items[index].qty--;
      if (items[index].qty === 0) {
        items.splice(index, 1);
        msg = "Product Removed From Cart";
      }
      updateCart(items, totalPrice, msg);
    }
  };

  const removeFromCart = (product) => {
    let items = cart.items;
    let totalPrice = cart.totalPrice - product.price * product.qty;
    let msg = null;
    let index = items.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      items.splice(index, 1);
      msg = "Product Removed From Cart";
      updateCart(items, totalPrice, msg);
    }
  };

  const isItemInCart = (id) => {
    // console.log(cart, cart.items);
    if (!cart) {
      return false;
    }
    let items = cart.items;
    let index = items.findIndex((item) => item.id === id);
    return index !== -1;
  };

  const placeOrder = async (cart_id) => {
    try {
      const docRef = doc(db, "carts", cart_id);
      await updateDoc(docRef, {
        ordered: true,
        ordered_at: new Date(),
        order_id: uuidv4(),
      });
      toast.success("Congratulations!! Your Order has been Confirmed");
      setOrderPlaced(true);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong!!!");
    } finally {
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        addToCart,
        removeFromCart,
        decreaseQty,
        isItemInCart,
        loading,
        orderPlaced,
        setOrderPlaced,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
