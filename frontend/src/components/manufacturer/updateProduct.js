import React, { useEffect, useState } from "react";
import FormButton from "../../common/formButton";
import Input from "../../common/input";
import ManufacturerService from "../../services/manufacturerService";
import { useParams } from "react-router-dom";

function UpdateProduct() {
  let { token } = useParams();

  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [createdDate, setCreatedDate] = useState("");

  useEffect(() => {
    console.log("Tocken upda", token);
    const getProductInfo = async () => {
      try {
        setLoader(true);
        const res = await ManufacturerService.getProductByToken(token);
        setLoader(false);

        console.log("Fetch Product", res);
        console.log("bool", res.data);

        if (res.data["success"]) {
          console.log("result", res.data["result"].Name);
          setProductName(res.data["result"].Name);
          setProductDescription(res.data["result"].Description);
          setProductPrice(res.data["result"].Price);
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

    getProductInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoader(true);
    setError("");
    setSuccess("");

    sendRequest();
  };

  const sendRequest = async () => {
    try {
      let tokenData = {
        productName,
        productDescription,
        productPrice,
        createdDate,
        userName: localStorage.getItem("username"),
        orgName: localStorage.getItem("orgName"),
        token,
      };

      console.log("tokenData: ", tokenData);

      const res = await ManufacturerService.updateProduct(tokenData);

      setLoader(false);

      console.log("REs", res);
      if (res.success) {
        setError("");
        setSuccess("Product Updated Successfully!");
        setTokenId(token);
      } else {
        setSuccess("");
        setError(res.message);
      }
    } catch (error) {
      setLoader(false);
      setSuccess("");
      setError(`Something went wrong: ${error}`);
      console.log("error", error);
    }
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 min-h-[93vh] py-10">
        <div className="flex flex-col items-center justify-center px-6 mx-auto lg:py-0">
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h2 className="mb-1 text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create Token
            </h2>
            <form
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              onSubmit={(e) => handleSubmit(e)}
            >
              <Input
                label="Product Name"
                type="text"
                id="productName"
                required
                value={productName}
                onChange={setProductName}
              />

              <Input
                label="Description"
                type="text"
                id="productDescription"
                required
                value={productDescription}
                onChange={setProductDescription}
              />

              <Input
                label="Price ($)"
                type="text"
                id="productPrice"
                required
                value={productPrice}
                onChange={setProductPrice}
              />

              {error ? (
                <div className="text-red-500 text-sm text-center  ">
                  {error}
                </div>
              ) : null}
              {success ? (
                <>
                  <div className="text-green-500 text-sm text-center  ">
                    {success}
                  </div>
                  {/* <div className="text-gray-50 text-md text-center  ">
                    Token ID: {tokenId}
                  </div> */}
                </>
              ) : null}

              <FormButton name="Submit" loader={loader} />
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
export default UpdateProduct;
