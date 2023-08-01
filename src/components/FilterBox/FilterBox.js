import { useEffect } from "react";
import styles from "./FilterBox.module.css";
import { useProductContext } from "../../context/ProductContext";
import { useDispatch, useSelector } from "react-redux";
import { productActions, productSelector } from "../../redux/reducers/productReducer";

function FilterBox() {
  // const {
  //   categories,
  //   loadingCategories,
  //   inputPrice,
  //   setInputPrice,
  //   inputCategories,
  //   setInputCategories,
  // } = useProductContext();

  const dispatch = useDispatch();

  const {categories, loadingCategories, inputPrice, inputCategories} = useSelector(productSelector);

  function isCategorySelected(category){
    let index = inputCategories.findIndex((item) => item===category);
    return index!==-1;

  }

  return (
    <div className={styles.FilterBox}>
      <div className={styles.Header}>
        <h1>Filter</h1>
      </div>
      <div className={styles.Filter}>
        <h3 className={styles.FilterTopic}>Price : {inputPrice} </h3>
        <div className={styles.FilterTopic}>
          <input
            type="range"
            min="1"
            max="50000"
            value={inputPrice}
            onChange={(e) => {
              dispatch(productActions.setInputPrice(e.currentTarget.value));
            }}
            style={{ width: "80%" }}
          />
        </div>
      </div>
      {!loadingCategories && (
        <div className={styles.Filter}>
          <h3 className={styles.FilterTopic}>Categories</h3>
          <div className={styles.FilterOptions}>
            {categories.map((category, index) => (
              <div key={index} className={styles.CheckBox}>
                <input
                  type="checkbox"
                  value={category}
                  name="inputCategories"
                  onChange={(e) => {
                    dispatch(productActions.setInputCategories(category));
                  }}
                  checked={isCategorySelected(category)}
                />
                {category}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterBox;
