import { useNavigate } from "react-router-dom";
// import { useCartContext } from "../../context/CartContext";
import styles from "./ProductsList.module.css";
// import { useAuthContext } from "../../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import {
  addToCart,
  cartSelector,
  isItemInCart,
  removeFromCart,
} from "../../redux/reducers/cartReducer";

function ProductItem({ product }) {
  // const { isItemInCart, addToCart, removeFromCart } = useCartContext();
  // const { isLoggedIn } = useAuthContext();

  const dispatch = useDispatch();

  const { isLoggedIn, user } = useSelector(authSelector);

  const { cart } = useSelector(cartSelector);

  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    if (isLoggedIn) {
      dispatch(addToCart(product));
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <div className={styles.ProductItem}>
      <div className={styles.ProductImage}>
        <img alt={product.title} src={product.image} />
      </div>

      <div className={styles.ProductFooter}>
        <div className={styles.ProductDescription}>
          <h3>Rs. {product.price}</h3>
          <p>{product.title}</p>
        </div>
        <div className={styles.CartImage}>
          {isLoggedIn && isItemInCart(product.id, cart) ? (
            <img
              alt="Remove from Cart"
              src="https://cdn-icons-png.flaticon.com/128/4715/4715132.png"
              onClick={() => dispatch(removeFromCart({ product, cart }))}
            />
          ) : (
            <img
              alt="Add to Cart"
              src="https://cdn-icons-png.flaticon.com/128/4715/4715128.png"
              onClick={() => handleAddToCart({ product, user, cart })}
            />
          )}
        </div>
        {/* <div className={styles.CartImage}><img alt="Remove from Cart" src="https://cdn-icons-png.flaticon.com/128/4715/4715132.png" /></div> */}
      </div>
    </div>
  );
}

export default ProductItem;
