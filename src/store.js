import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import snackbarSlice from "./Redux/Snackbar/SnackbarSlice";
import getProductSlice from './Redux/ProductSlice/fetchProducts';
import removeProductSlice from "./Redux/ProductSlice/removeProduct";
import viewProduct from "./Redux/ProductSlice/viewProduct";
import SearchTerm from "./Redux/SearchTermSlice/SearchTerm";
import auth from "./Redux/AuthSlice/auth";
import userSignIn from "./Redux/AuthSlice/userSignIn";
import userSignUp from "./Redux/AuthSlice/userSignUp";
import removefromCart from "./Redux/CartSlice/removefromCart";
import cartCount from "./Redux/CartSlice/cartCount";
import adminSignIn from "./Redux/AuthSlice/adminSignIn";
import adminSignUp from "./Redux/AuthSlice/adminSignUp";
import getIDs from "./Redux/GetIDs/getIDs";
import Addresses from "./Redux/AddressSlice/Addresses";
import SelectedAddress from "./Redux/AddressSlice/SelectedAddress";
import getProductbyId from "./Redux/ProductSlice/getProductbyId";
import fetchCart from "./Redux/CartSlice/fetchCart";
import Orders from "./Redux/OrderSlice/Orders";
import OrderStatus from "./Redux/OrderSlice/OrderStatus";
import States from "./Redux/StatesSlice/States";

const rootReducer = combineReducers({
    snackbar: snackbarSlice,
    getProducts: getProductSlice,
    removeProduct: removeProductSlice,
    viewProduct: viewProduct,
    getProduct: getProductbyId,
    search: SearchTerm,
    auth: auth,
    adminSignIn: adminSignIn,
    userSignIn: userSignIn,
    adminSignUp: adminSignUp,
    userSignUp: userSignUp,
    removeCart: removefromCart,
    cartCount: cartCount,
    getIDs: getIDs,
    addresses: Addresses,
    selectedAddress: SelectedAddress,
    getUserCart: fetchCart,
    orders: Orders,
    orderStatus: OrderStatus,
    shopkartStates: States,
})

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "adminSignIn", "userSignIn", "adminSignUp", "userSignUp", "getProduct", "getUserCart", "orders", "selectedAddress", "orderStatus"] //slices to be persisted
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false, // This line is added to suppress a warning
    }).concat(),
})