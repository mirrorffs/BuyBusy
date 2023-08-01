import { useEffect } from "react";
import styles from "./ProductsList.module.css";
import ProductItem from "./ProductItem";
import { useProductContext } from "../../context/ProductContext";
import Loader from "../Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories, fetchAllProducts, productActions, productSelector } from "../../redux/reducers/productReducer";

function ProductsList() {

  // const {products, loadingProducts} = useProductContext();

  const {products, loadingProducts} = useSelector(productSelector);

  return (
    <div className={styles.ProductsList}>
      {loadingProducts ? <Loader /> : products.length===0 ? <div style={{width:"100%",marginTop:"100px",display:"flex",justifyContent:"center"}}><h1>Oops, Nothing To Show!!!</h1></div> : products.map((product) => (<ProductItem key={product.id} product={product} />))}
    </div>
  );
}

export default ProductsList;
