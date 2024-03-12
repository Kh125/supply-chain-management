import React, { useState, useEffect } from "react";
import ManufacturerService from "../../services/manufacturerService";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import History from "../../assets/images/common/history.png";
import ConsumerService from "../../services/consumerService";

function ProductInfo() {
  let { token } = useParams();
  const orgName = localStorage.getItem("orgName");
  const [tokenId, setTokenId] = useState("");
  const [userName, setUserName] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStatus, setProductStatus] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loader, setLoader] = useState(false);
  var color = "";

  useEffect(() => {
    console.log("Tocken", token);
    const getProductInfo = async () => {
      try {
        setLoader(true);
        const res = await ManufacturerService.getProductByToken(token);
        setLoader(false);

        console.log("Fetch Product", res);
        console.log("bool", res.data);

        if (res.data["success"]) {
          console.log("result", res.data["result"].Name);
          setData(res.data["result"]);
          setProductName(res.data["result"].Name);
          setTokenId(res.data["result"].ID);
          setUserName(res.data["result"].Manufacturer);
          setProductDescription(res.data["result"].Description);
          setProductPrice(res.data["result"].Price);
          setProductStatus(res.data["result"].Status);
          setCreatedDate(res.data["result"].CreatedDate);

          console.log("uf", productName, productDescription, productPrice);
        } else {
          setError(res.data["message"]);
        }
      } catch (error) {
        console.log(error);
        setError("Something went wrong!");
      }
    };

    const generateColorClass = (status) => {
      let color = "text-yellow-500";

      switch (status) {
        case "Accepted":
          color = "text-green-500";
          break;
        case "Shipped":
          color = "text-blue-500";
          break;
        case "Delivered":
          color = "text-gray-500";
          break;
        case "Pending Order Request":
        default:
          color = "text-yellow-500";
      }
    };

    generateColorClass(productStatus);
    getProductInfo();
  }, []);

  const deliverProduct = async () => {
    try {
      setLoader(true);
      let manufacturerName = localStorage.getItem("username");
      const res = await ManufacturerService.deliverProductOrder({
        token,
      });
      setLoader(false);

      console.log("Deliver Product", res);
      // console.log("Order Product", res.data);

      if (res["success"]) {
        console.log("Message", res["message"]);
        setSuccess(res["message"]);
      } else {
        setError(res["message"]);
      }
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  const shipProduct = async () => {
    try {
      setLoader(true);
      let manufacturerName = localStorage.getItem("username");
      const res = await ManufacturerService.shipProductOrder({
        token,
      });
      setLoader(false);

      console.log("Ship Product", res);
      // console.log("Order Product", res.data);

      if (res["success"]) {
        console.log("Message", res["message"]);
        setSuccess(res["message"]);
      } else {
        setError(res["message"]);
      }
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  return (
    <div class="md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-4">
      <div class="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6">
        <div class="border-b border-gray-200 pb-6">
          <p class="text-sm leading-none text-gray-600 dark:text-gray-300 ">
            Category
          </p>
          <h1 class="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 dark:text-white mt-2">
            Product Details
          </h1>
        </div>
        <div>
          <p class="text-base leading-4 mt-7 text-gray-600 dark:text-gray-300">
            Token ID: {tokenId}
          </p>
          <p class="text-base leading-4 mt-7 text-gray-600 dark:text-gray-300">
            Product Name: {productName}
          </p>
          <p class="text-base leading-4 mt-4 text-gray-600 dark:text-gray-300">
            Description: {productDescription}
          </p>
          <p class="text-base leading-4 mt-4 text-gray-600 dark:text-gray-300">
            Price: {productPrice}
          </p>
          <p class="text-base leading-4 mt-4 dark:text-gray-300">
            Status:
            <span className={color}>{productStatus}</span>
          </p>
          <p class="text-base leading-4 mt-4 text-gray-600 dark:text-gray-300">
            Manufacturer: {userName}
          </p>
          <p class="text-base leading-4 mt-4 text-gray-600 dark:text-gray-300">
            Manufacturered Date: {createdDate}
          </p>
          {data && data.Consumer.length != 0 && (
            <p class="text-base leading-4 mt-4 text-gray-600 dark:text-gray-300">
              Consumer: {data.Consumer == "null" ? "-" : data.Consumer}
            </p>
          )}
        </div>

        {orgName === "manufacturer" && (
          <>
            {productStatus == "Pending" && (
              <Link
                to={`/update-product/${token}`}
                className="mt-10 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700"
              >
                Update Product Details
              </Link>
            )}

            <Link
              to={`/product-transaction-history/${token}`}
              className="text-left mt-10 focus:outline-none text-base flex items-center leading-none w-full py-4 underline text-blue-700"
            >
              View Transaction History
              <img src={History} className="w-6 h-6 ml-2" alt="History" />
            </Link>
          </>
        )}
        {productStatus == "Accepted" && (
          <Link
            onClick={() => shipProduct(tokenId)}
            className="mt-10 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700"
          >
            Ship Product
          </Link>
        )}
        {productStatus == "Shipped" && (
          <Link
            onClick={() => deliverProduct(tokenId)}
            className="mt-10 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700"
          >
            Delivered Product
          </Link>
        )}
        {error ? (
          <div className="text-red-500 text-sm text-center  ">{error}</div>
        ) : null}
        {success ? (
          <>
            <div className="text-green-500 text-sm text-center  ">
              {success}
            </div>
          </>
        ) : null}
        {/* {orgName !== "manufacturer" && (
          <Link
            onClick={() => orderProduct()}
            className="mt-10 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700"
          >
            Order Product
          </Link>
        )} */}
        <div>
          <h1 class="mt-12 mb-8 text-left font-black text-gray-700">
            Product Shipping Info
          </h1>
          <div class="flex">
            <div class="w-1/3 text-center px-6">
              <div class="bg-gray-300 rounded-lg flex items-center justify-center border border-gray-200">
                <div class="w-1/3 bg-transparent h-20 flex items-center justify-center icon-step">
                  <svg
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  >
                    <path d="M21 6.285l-11.16 12.733-6.84-6.018 1.319-1.49 5.341 4.686 9.865-11.196 1.475 1.285z" />
                  </svg>
                </div>
                <div class="w-2/3 bg-gray-200 h-24 flex flex-col items-center justify-center px-1 rounded-r-lg body-step">
                  <h2 class="font-bold text-sm">Order Accepted</h2>
                  {/* <p class="text-xs text-gray-600">
                    
                  </p> */}
                </div>
              </div>
            </div>
            <div class="flex-1 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M14 2h-7.229l7.014 7h-13.785v6h13.785l-7.014 7h7.229l10-10z" />
              </svg>
            </div>
            <div class="w-1/3 text-center px-6">
              <div class="bg-gray-300 rounded-lg flex items-center justify-center border border-gray-200">
                <div class="w-1/3 bg-transparent h-20 flex items-center justify-center icon-step">
                  <svg
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  >
                    <path d="M21 6.285l-11.16 12.733-6.84-6.018 1.319-1.49 5.341 4.686 9.865-11.196 1.475 1.285z" />
                  </svg>
                </div>
                <div class="w-2/3 bg-gray-200 h-24 flex flex-col items-center justify-center px-1 rounded-r-lg body-step">
                  <h2 class="font-bold text-sm">Shipped</h2>
                  {/* <p class="text-xs text-gray-600">
                    Anything you want for your credentials
                  </p> */}
                </div>
              </div>
            </div>
            <div class="flex-1 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                fill-rule="evenodd"
                clip-rule="evenodd"
              >
                <path d="M21 6.285l-11.16 12.733-6.84-6.018 1.319-1.49 5.341 4.686 9.865-11.196 1.475 1.285z" />
              </svg>
            </div>
            <div class="w-1/3 text-center px-6">
              <div class="bg-gray-300 rounded-lg flex items-center justify-center border border-gray-200">
                <div class="w-1/3 bg-transparent h-20 flex items-center justify-center icon-step">
                  <svg
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  >
                    <path d="M21 6.285l-11.16 12.733-6.84-6.018 1.319-1.49 5.341 4.686 9.865-11.196 1.475 1.285z" />
                  </svg>
                </div>
                <div class="w-2/3 bg-gray-200 h-24 flex flex-col items-center justify-center px-1 rounded-r-lg body-step">
                  <h2 class="font-bold text-sm">Delivered</h2>
                  {/* <p class="text-xs text-gray-600">Finish it!</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductInfo;
