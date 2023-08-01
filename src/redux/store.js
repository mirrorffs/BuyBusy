import { configureStore } from "@reduxjs/toolkit";
import { notificationReducer } from "./reducers/notificationReducer";
import { authReducer } from "./reducers/authReducer";
import { cartReducer } from "./reducers/cartReducer";
import { productReducer } from "./reducers/productReducer";

export const store = configureStore({
  reducer: {
    notificationReducer,
    authReducer,
    cartReducer,
    productReducer,
  },
});
