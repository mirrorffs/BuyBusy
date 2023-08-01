import { db } from "../../firebaseInit";
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: null,
  orders: [],
  orderPlaced: false,
  loadingCart: true,
  message: false,
};

export const setInitialState = createAsyncThunk(
  "cart/setInitialState",
  async (payload, thunkAPI) => {
    // thunkAPI.dispatch(cartActions.loading());

    let docRef = collection(db, "carts");
    let q = query(
      docRef,
      where("uid", "==", payload.user.uid),
      orderBy("created_at", "desc")
    );
    onSnapshot(q, (snapShot) => {
      const data = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // let cart_arr = data.filter((ele) => ele.ordered === false);
      // let orders_arr = data.filter((ele) => ele.ordered === true);

      let cart = null;
      let orders = [];
      data.forEach((element) => {
        if (element.ordered === false) {
          cart = {
            ...element,
            created_at:
              element.created_at.toDate().toLocaleDateString() +
              "," +
              element.created_at.toDate().toLocaleTimeString("en-Us"),
          };
        } else {
          orders.push({
            ...element,
            created_at:
              element.created_at.toDate().toLocaleDateString() +
              "," +
              element.created_at.toDate().toLocaleTimeString("en-Us"),
            ordered_at:
              element.ordered_at.toDate().toLocaleDateString() +
              "," +
              element.ordered_at.toDate().toLocaleTimeString("en-Us"),
          });
        }
      });

      thunkAPI.dispatch(
        cartActions.setInitialState({
          cart,
          orders,
        })
      );
    });
  }
);

export const createCart = createAsyncThunk(
  "cart/createCart",
  async (payload, thunkAPI) => {
    try {
      const docNew = {
        uid: payload.user.uid,
        items: [{ ...payload.product, qty: 1 }],
        totalPrice: payload.product.price,
        ordered: false,
        created_at: new Date(),
      };

      const docRef = collection(db, "carts");
      await addDoc(docRef, docNew);
      //   setCart({ id: newDocRef.id, ...docNew });
      thunkAPI.dispatch(
        cartActions.setNotification({ success: payload.success_msg })
      );
    } catch (error) {
      console.log(error);
      thunkAPI.dispatch(
        cartActions.setNotification({ error: "Something Went Wrong!!!" })
      );
    }
  }
);

export const updateCart = createAsyncThunk(
  "car/updateCart",
  async (payload, thunkAPI) => {
    try {
      // console.log(payload);
      const docRef = doc(db, "carts", payload.cart.id);
      await updateDoc(docRef, {
        items: payload.items,
        totalPrice: payload.totalPrice,
      });
      thunkAPI.dispatch(
        cartActions.setNotification({ success: payload.success_msg })
      );
    } catch (error) {
      console.log(error);
      thunkAPI.dispatch(
        cartActions.setNotification({ error: "Something Went Wrong!!!" })
      );
    }
  }
);

export const placeOrder = createAsyncThunk(
  "cart/placeOrder",
  async (payload, thunkAPI) => {
    try {
      const docRef = doc(db, "carts", payload.cart_id);
      await updateDoc(docRef, {
        ordered: true,
        ordered_at: new Date(),
        order_id: uuidv4(),
      });
      thunkAPI.dispatch(cartActions.setOrderPlaced());
      thunkAPI.dispatch(
        cartActions.setNotification({
          success: "Congratulations!! Your Order has been Confirmed",
        })
      );
    } catch (error) {
      console.log(error);
      thunkAPI.dispatch(
        cartActions.setNotification({ error: "Something Went Wrong!!!" })
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  (payload, thunkAPI) => {
    let cart = payload.cart;
    if (!cart) {
      let success_msg = "Product Added To Cart";
      thunkAPI.dispatch(
        createCart({
          product: payload.product,
          success_msg,
          user: payload.user,
        })
      );
    } else {
      let items = cart.items;
      let totalPrice = cart.totalPrice + payload.product.price;
      // console.log(totalPrice);
      // return;
      let success_msg = null;
      let index = items.findIndex((item) => item.id === payload.product.id);
      if (index === -1) {
        items = [{ ...payload.product, qty: 1 }, ...items];
        success_msg = "Product Added To Cart";
      } else {
        items = items.map((ele, i) => {
          if (i !== index) {
            return ele;
          } else {
            return { ...ele, qty: ele.qty + 1 };
          }
        });
      }
      thunkAPI.dispatch(updateCart({ items, totalPrice, success_msg, cart }));
    }
  }
);

export const decreaseQty = createAsyncThunk(
  "cart/decreaseQty",
  (payload, thunkAPI) => {
    // console.log(payload);
    let cart = payload.cart;
    let items = cart.items;
    let totalPrice = cart.totalPrice - payload.product.price;
    // console.log(totalPrice);
    // return;
    let success_msg = null;
    let index = items.findIndex((item) => item.id === payload.product.id);
    if (index !== -1) {
      // items[index].qty--;
      items = items.map((ele, i) => {
        if (i !== index) {
          return ele;
        } else {
          return { ...ele, qty: ele.qty - 1 };
        }
      });
      if (items[index].qty === 0) {
        // items.splice(index, 1);
        items = items.filter((ele, i) => i !== index);
        success_msg = "Product Removed From Cart";
      }
      thunkAPI.dispatch(updateCart({ items, totalPrice, success_msg, cart }));
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  (payload, thunkAPI) => {
    // console.log(payload);
    let cart = payload.cart;
    let items = cart.items;
    let success_msg = null;
    let index = items.findIndex((item) => item.id === payload.product.id);
    if (index !== -1) {
      // items.splice(index, 1);
      let totalPrice =
        cart.totalPrice - items[index].price * items[index].qty;
      // console.log(totalPrice);
      // return;
      items = items.filter((ele, i) => i !== index);
      success_msg = "Product Removed From Cart";
      thunkAPI.dispatch(updateCart({ items, totalPrice, success_msg, cart }));
    }
  }
);

export const isItemInCart = (id, cart) => {
  // console.log(cart, cart.items);
  if (!cart) {
    return false;
  }
  let items = cart.items;
  let index = items.findIndex((item) => item.id === id);
  return index !== -1;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loading: (state, action) => {
      state.loadingCart = true;
    },
    setInitialState: (state, action) => {
      // console.log(action.payload);
      state.cart = action.payload.cart;
      state.orders = action.payload.orders;
      state.loadingCart = false;
    },
    setOrderPlaced: (state, action) => {
      state.orderPlaced = true;
    },
    resetOrderPlaced: (state, action) => {
      state.orderPlaced = false;
    },
    setNotification: (state, action) => {
      state.message = true;
    },
  },
});

export const cartReducer = cartSlice.reducer;

export const cartActions = cartSlice.actions;

export const cartSelector = (state) => state.cartReducer;
