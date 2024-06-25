import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import ProductForm from "../../AdminPanel/ProductForm/Components/ProductForm";
import Sidebar from "../../AdminPanel/Sidebar/Components/Sidebar";
import ProductGrid from "../../AdminPanel/ProductGrid/ProductGrid";
import Dashboard from "../../UserPanel/Dashboard/Components/Dashboard";
import Products from "../../UserPanel/ProductsDisplay/Components/Products";
import { ProductDetails } from "../../UserPanel/ProductDetails/Components/ProductDetails";
import LoginForm from "../../Login/Components/LoginForm";
import PrivateRoute from "../HOC/PrivateRoute/PrivateRoute";
import PublicRoute from "../HOC/PublicRoute/PublicRoute";
import SignUpUser from "../../UserPanel/SignUp/Components/SignUpUser";
import Cart from "../../UserPanel/Cart/Components/Cart";
import AdminRoute from "../HOC/AdminRoute/AdminRoute";
import AddAccount from "../../AdminPanel/AddAccount/Components/AddAccount";
import AddressForm from "../../UserPanel/AddressForm/Components/AddressForm";
import AddressDetails from "../../UserPanel/AddressDetails/Components/AddressDetails";

export const AppRoutes = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/login" element={<PublicRoute><LoginForm /></PublicRoute>}/>
        <Route path="/signup" element={<PublicRoute><SignUpUser /></PublicRoute>}/>
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} >
          <Route index element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route  path="cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route  path="products" element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route  path="product/:id" element={<PrivateRoute><ProductDetails /></PrivateRoute>} />
          <Route  path="add-address" element={<PrivateRoute><AddressForm /></PrivateRoute>} />
          <Route  path="user-address" element={<PrivateRoute><AddressDetails /></PrivateRoute>} />
        </Route>
        <Route path="/admin" element={<AdminRoute><Sidebar /></AdminRoute>} >
          <Route  path="add-product" element={<AdminRoute><ProductForm /></AdminRoute>} />
          <Route  path="manage-products" element={<AdminRoute><ProductGrid /></AdminRoute>} />
          <Route  path="add-admin-account" element={<AdminRoute><AddAccount /></AdminRoute>} />
        </Route>
      </>
    )
)