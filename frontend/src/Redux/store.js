import { configureStore } from '@reduxjs/toolkit';
import Reducer from '../Redux/cartReducer';

export default configureStore({
  reducer: {
    cart: Reducer,
  },
});
