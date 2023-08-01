import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  allProducts: [],
  products: [],
  categories: [],
  inputCategories: [],
  inputPrice: 50000,
  searchText: "",
  loadingProducts: true,
  loadingCategories: true,
};

export const fetchAllProducts = createAsyncThunk(
  "product/fetchAllProducts",
  async (_, thunkAPI) => {
    // thunkAPI.dispatch(productActions.setLoadingProducts());
    try {
      let res = await fetch("https://fakestoreapi.com/products");
      let data = await res.json();
      thunkAPI.dispatch(productActions.setAllProducts(data));
    } catch (error) {
      console.log(error);
      thunkAPI.dispatch(productActions.setAllProducts([]));
    }
  }
);

export const fetchAllCategories = createAsyncThunk(
  "product/fetchAllCategories",
  async (_, thunkAPI) => {
    // thunkAPI.dispatch(productActions.setLoadingCategories());
    try {
      let res = await fetch("https://fakestoreapi.com/products/categories");
      let data = await res.json();
      thunkAPI.dispatch(productActions.setCategories(data));
    } catch (error) {
      console.log(error);
      thunkAPI.dispatch(productActions.setCategories([]));
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setAllProducts: (state, action) => {
      state.allProducts = action.payload;
      state.products = action.payload;
      state.loadingProducts = false;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
      state.loadingCategories = false;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setInputPrice: (state, action) => {
      state.inputPrice = action.payload;
    },
    setInputCategories: (state, action) => {
      const index = state.inputCategories.findIndex(
        (ele) => ele === action.payload
      );
      if (index === -1) {
        state.inputCategories = [...state.inputCategories, action.payload];
      } else {
        let new_list = state.inputCategories.filter(
          (ele) => ele !== action.payload
        );
        state.inputCategories = new_list;
      }
    },
    filterProducts: (state, action) => {
      let new_list = state.allProducts.filter(
        (product) => product.price <= parseFloat(state.inputPrice)
      );
      // console.log(inputCategories);
      if (state.inputCategories.length > 0) {
        new_list = new_list.filter(
          (product) =>
            state.inputCategories.findIndex(
              (category) => category === product.category
            ) !== -1
        );
      }
      if (state.searchText) {
        new_list = new_list.filter(
          (product) =>
            product.title
              .toLowerCase()
              .indexOf(state.searchText.toLowerCase()) !== -1
        );
      }
      state.products = new_list;
    },
  },
});

export const productReducer = productSlice.reducer;

export const productActions = productSlice.actions;

export const productSelector = (state) => state.productReducer;
