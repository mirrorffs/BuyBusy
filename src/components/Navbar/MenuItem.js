import styles from "./Navbar.module.css";

function MenuItem({ itemName, itemImage, imageHeight, cart, cartCount, signIn }) {
  return (
    <div className={styles.MenuItem}>
      <div
        className={`${styles.ItemImage} ${cart ? styles.Cart : ""}`}
        style={imageHeight ? { height: imageHeight } : null}
      >
        <img alt={itemName} src={itemImage} className={`${signIn ? styles.SignIn : ""}`} />
        {cart ? (<div className={styles.Price}>{cartCount}</div>) : null}
      </div>
      <div className={styles.ItemName}>{itemName}</div>
    </div>
  );
}

export default MenuItem;
