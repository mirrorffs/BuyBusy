import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { useProductContext } from "../../context/ProductContext";
import { useDispatch, useSelector } from "react-redux";
import {
  productActions,
  productSelector,
} from "../../redux/reducers/productReducer";

function SearchBar() {
  // const {searchText, setSearchText} = useProductContext();

  const dispatch = useDispatch();

  const { searchText } = useSelector(productSelector);

  return (
    <div className={styles.SearchBar}>
      <input
        type="text"
        placeholder="Search Product..."
        value={searchText}
        onChange={(e) => {
          dispatch(productActions.setSearchText(e.currentTarget.value));
        }}
      ></input>
      {searchText.length === 0 ? (
        <div className={styles.SearchImage}>
          <img
            alt="search"
            src="https://cdn-icons-png.flaticon.com/128/751/751381.png"
          />
        </div>
      ) : (
        <div className={styles.SearchImage} style={{ height: "20px" }}>
          <img
            alt="clear"
            src="https://cdn-icons-png.flaticon.com/128/1632/1632708.png"
            style={{ cursor: "pointer" }}
            onClick={() => {
              dispatch(productActions.setSearchText(""));
            }}
          />
        </div>
      )}
    </div>
  );
}

export default SearchBar;
