import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./container/home";
import Navbar from "./container/navbar";
import Page404 from "./container/page404";
import Login from "./components/login/login";
import Register from "./components/login/register";
import Dashboard from "./container/dashboard";
import Logout from "./container/logout";
import CreateItem from "./components/manufacturer/createProduct";
import UpdateProduct from "./components/manufacturer/updateProduct";
import ProductList from "./components/manufacturer/productList";
import ProductInfo from "./components/manufacturer/productInfo";
import ProductTransactionHistory from "./components/manufacturer/productTransactionHistory";
import ProductListForConsumer from "./components/consumer/productListForConsumer";
import RequestedProductOrderList from "./components/manufacturer/requestedProductOrderList";
import ConsumerProductOrderList from "./components/consumer/consumerProductOrderList";
import Profile from "./container/profile";
import OrderedProductInfo from "./components/consumer/orderedProductInfo";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  // console.log = function(){};

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* manufacturer */}
        <Route
          path="/create-product"
          element={
            <ProtectedRoute allowedRoles={["manufacturer"]}>
              <CreateItem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-product/:token"
          element={
            <ProtectedRoute allowedRoles={["manufacturer"]}>
              <UpdateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product-list"
          element={
            <ProtectedRoute allowedRoles={["manufacturer"]}>
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requested-product-order-list"
          element={
            <ProtectedRoute allowedRoles={["manufacturer"]}>
              <RequestedProductOrderList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product-info/:token"
          element={
            <ProtectedRoute allowedRoles={["manufacturer"]}>
              <ProductInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product-transaction-history/:token"
          element={
            <ProtectedRoute allowedRoles={["manufacturer"]}>
              <ProductTransactionHistory />
            </ProtectedRoute>
          }
        />

        {/* consumer */}
        <Route
          path="/product-list-consumer"
          element={
            <ProtectedRoute allowedRoles={["consumer"]}>
              <ProductListForConsumer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consumer-product-order-list"
          element={
            <ProtectedRoute allowedRoles={["consumer"]}>
              <ConsumerProductOrderList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consumer-ordered-product-info/:token"
          element={
            <ProtectedRoute allowedRoles={["consumer"]}>
              <OrderedProductInfo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/logout" element={<Logout />} />

        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
}

export default App;
