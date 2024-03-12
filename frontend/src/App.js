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
import ConsumerData from "./components/consumer/consumerData";
import ProductInfo from "./components/manufacturer/productInfo";
import ProductTransactionHistory from "./components/manufacturer/productTransactionHistory";
import ProductListForConsumer from "./components/consumer/productListForConsumer";
import RequestedProductOrderList from "./components/manufacturer/requestedProductOrderList";
import ConsumerProductOrderList from "./components/consumer/consumerProductOrderList";
import Profile from "./container/profile";
import OrderedProductInfo from "./components/consumer/orderedProductInfo";

function App() {
  // console.log = function(){};

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/*manufacturer */}
        <Route path="/create-product" element={<CreateItem />} />
        <Route path="/update-product/:token" element={<UpdateProduct />} />
        <Route path="/product-list" element={<ProductList />} />
        <Route
          path="/requested-product-order-list"
          element={<RequestedProductOrderList />}
        />
        <Route path="/product-info/:token" element={<ProductInfo />} />
        <Route
          path="/product-transaction-history/:token"
          element={<ProductTransactionHistory />}
        />

        {/*consumer */}
        <Route path="/consumer" element={<ConsumerData />} />
        <Route
          path="/product-list-consumer"
          element={<ProductListForConsumer />}
        />
        <Route
          path="/consumer-product-order-list"
          element={<ConsumerProductOrderList />}
        />
        <Route
          path="/consumer-ordered-product-info/:token"
          element={<OrderedProductInfo />}
        />

        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
}

export default App;
