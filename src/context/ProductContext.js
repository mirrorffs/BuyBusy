import { createContext, useContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";

const ProductContext = createContext();

export function useProductContext() {
  const value = useContext(ProductContext);
  return value;
}

export default function CustomProductContext({ children }) {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inputCategories, setInputCategories] = useState([]);
  const [inputPrice, setInputPrice] = useState(50000);
  const [searchText, setSearchText] = useState("");

  const[loadingProducts, setLoadingProducts] = useState(false);
  const[loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    fetchAllProducts();
    // console.log("fetchAllProducts");
    fetchAllCategories();
    // console.log("fetchAllCategories");
  }, []);

  useEffect(() => {
    resetFilteredProducts();
    // console.log("resetFilteredProducts");
  }, [allProducts]);

  useEffect(() => {
    filterProducts();
    // console.log("filterProducts");
  },[inputPrice, inputCategories, searchText]);

  async function fetchAllProducts() {
    setLoadingProducts(true)
    try {
      let res = await fetch("https://fakestoreapi.com/products");
      let data = await res.json();
      setAllProducts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function fetchAllCategories() {
    setLoadingCategories(true)
    try {
      let res = await fetch("https://fakestoreapi.com/products/categories");
      let data = await res.json();
      setCategories(data);
      setLoadingCategories(false);
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  function resetFilteredProducts() {
    setProducts(allProducts);
  }

  function filterProducts() {
    let new_list = allProducts.filter(
      (product) => product.price <= parseFloat(inputPrice)
    );
    // console.log(inputCategories);
    if (inputCategories.length > 0) {
      new_list = new_list.filter(
        (product) =>
          inputCategories.findIndex(
            (category) => category === product.category
          ) !== -1
      );
    }
    if (searchText) {
      new_list = new_list.filter(
        (product) =>
          product.title.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
      );
    }
    setProducts(new_list);
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        inputPrice,
        setInputPrice,
        inputCategories,
        setInputCategories,
        searchText,
        setSearchText,
        loadingProducts,
        loadingCategories
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
