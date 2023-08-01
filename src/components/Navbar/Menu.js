import styles from "./Navbar.module.css";
import MenuItem from "./MenuItem";
// import { useAuthContext } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";
// import { useCartContext } from "../../context/CartContext";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, signOutUser } from "../../redux/reducers/authReducer";
import { cartSelector } from "../../redux/reducers/cartReducer";

function Menu() {
  // const { isLoggedIn, signOutUser } = useAuthContext();

  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector(authSelector);

  // const { cart } = useCartContext();

  const { cart } = useSelector(cartSelector);

  return (
    <div className={styles.Menu}>
      <NavLink
        to="/"
        className={({ isActive, isPending }) =>
          isPending ? null : isActive ? styles.Active : null
        }
      >
        <MenuItem
          itemName="Home"
          itemImage="https://cdn-icons-png.flaticon.com/128/553/553416.png"
        />
      </NavLink>
      {isLoggedIn && (
        <>
          <NavLink
            to="orders"
            className={({ isActive, isPending }) =>
              isPending ? null : isActive ? styles.Active : null
            }
          >
            <MenuItem
              itemName="Orders"
              itemImage="https://cdn-icons-png.flaticon.com/128/791/791019.png"
            />
          </NavLink>
          <NavLink
            to="cart"
            className={({ isActive, isPending }) =>
              isPending ? null : isActive ? styles.Active : null
            }
          >
            <MenuItem
              itemName="Cart"
              itemImage="https://cdn-icons-png.flaticon.com/128/891/891462.png"
              cart
              cartCount={cart ? cart.items.length : 0}
            />
          </NavLink>
        </>
      )}
      {!isLoggedIn ? (
        <NavLink
          to="sign-in"
          className={({ isActive, isPending }) =>
            isPending ? null : isActive ? styles.Active : null
          }
        >
          <MenuItem
            itemName="Sign In"
            itemImage="https://cdn-icons-png.flaticon.com/128/4034/4034219.png"
            signIn
          />
        </NavLink>
      ) : (
        <NavLink onClick={() => dispatch(signOutUser())}>
          <MenuItem
            itemName="Sign Out"
            itemImage="https://cdn-icons-png.flaticon.com/128/4034/4034229.png"
          />
        </NavLink>
      )}
    </div>
  );
}

export default Menu;
