import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BASE_URL, userRequest } from '../requestMethods';

export const addCartProduct = createAsyncThunk('addCart', async (data) => {
  try {
    const userId = localStorage.getItem('userId'); // Retrieve the userId from localStorage
    console.log(userId);
    const response = await userRequest.post(`/cart/addcart/${userId}`, data);
    console.log(response.data);
    return response.data.products;
  } catch (error) {
    console.log(error);
  }
});

export const getCartProduct = createAsyncThunk('getCart', async () => {
  try {
    const userId = localStorage.getItem('userId'); // Retrieve the userId from localStorage
    const response = await userRequest.get(`/cart/products/${userId}`);
    console.log(response.data);
    return response.data.products;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const updateCartItem = createAsyncThunk(
  'updateCartItem',
  async (data) => {
    console.log(data);
    try {
      const userId = localStorage.getItem('userId'); // Retrieve the userId from localStorage
      const response = await userRequest.put(
        `/cart/products/${userId}/${data?.id}`,
        data
      );
      console.log(response.data.product);
      return response.data.product;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  'deleteCartItem',
  async (itemId) => {
    try {
      const userId = localStorage.getItem('userId'); // Retrieve the userId from localStorage
      const response = await userRequest.delete(
        `/cart/products/${userId}/${itemId}`
      );
      return itemId;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

// Helper function to calculate the total price
const calculateTotalPrice = (products) => {
  const total = products.reduce((total, product) => {
    return total + calculateProductPrice(product);
  }, 0);
  console.log(total);
  return total;
};

// Helper function to calculate the price of a single product
const calculateProductPrice = (product) => {
  return product.price * product.quantity;
};

const cardSlice = createSlice({
  name: 'cart',
  initialState: {
    products: [],
    quantity: 0,
    totalPrice: 0,
  },
  extraReducers: {
    [addCartProduct.pending]: (state) => {
      state.loading = true;
    },
    [addCartProduct.fulfilled]: (state, action) => {
      state.loading = false;
      state.quantity += 1;
      state.products.push(action.payload);
      state.totalPrice = calculateTotalPrice(state.products);
    },
    [addCartProduct.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getCartProduct.pending]: (state) => {
      state.loading = true;
    },
    [getCartProduct.fulfilled]: (state, action) => {
      state.loading = false;
      state.quantity = action.payload.length;
      state.products = action.payload;
      state.totalPrice = calculateTotalPrice(state.products);
    },
    [getCartProduct.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [updateCartItem.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [updateCartItem.fulfilled]: (state, action) => {
      state.loading = false;
      state.products = state.products.map((product) => {
        if (product.cartId === action.payload._id) {
          console.log(action.payload);
          const updateProduct = product;
          updateProduct.quantity = action.payload.quantity;
          updateProduct.selectedSize = action.payload.selectedSize;
          return updateProduct;
        }
        console.log(product);
        return product;
      });
      state.totalPrice = calculateTotalPrice(state.products);
      state.error = null;
    },
    [updateCartItem.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [deleteCartItem.pending]: (state) => {
      state.loading = true;
    },
    [deleteCartItem.fulfilled]: (state, action) => {
      state.loading = false;
      state.quantity -= 1;
      state.products = state.products.filter((product) => {
        console.log(action.payload);
        return product.cartId !== action.payload;
      });
      state.totalPrice = calculateTotalPrice(state.products);
    },
    [deleteCartItem.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { addProduct } = cardSlice.actions;
export default cardSlice.reducer;
