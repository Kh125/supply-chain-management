import React, { useEffect, useState } from "react";
import FormButton from "../../common/formButton";
import Input from "../../common/input";
import ManufacturerService from "../../services/manufacturerService";
import { useParams, useNavigate } from "react-router-dom";
import { notifyLedgerChanged } from "../../utils/ledgerSync";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../common/loader";

function UpdateProduct() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { username, orgName } = useAuth();

  const [loader, setLoader] = useState(false);
  const [pageLoader, setPageLoader] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [createdDate, setCreatedDate] = useState("");

  useEffect(() => {
    const getProductInfo = async () => {
      try {
        setPageLoader(true);
        const res = await ManufacturerService.getProductByToken(token);
        setPageLoader(false);

        if (res.data["success"]) {
          const p = res.data["result"];
          setProductName(p.Name);
          setProductDescription(p.Description);
          setProductPrice(p.Price);
          setCreatedDate(p.CreatedDate);
        } else {
          setError(res.data["message"]);
        }
      } catch (error) {
        setPageLoader(false);
        setError("Something went wrong loading product!");
      }
    };
    getProductInfo();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    setError("");
    setSuccess("");
    sendRequest();
  };

  const sendRequest = async () => {
    try {
      const tokenData = {
        productName,
        productDescription,
        productPrice,
        createdDate,
        userName: username,
        orgName,
        token,
      };

      const res = await ManufacturerService.updateProduct(tokenData);
      setLoader(false);

      if (res.success) {
        setError("");
        setSuccess("Product updated successfully!");
        notifyLedgerChanged(token);
      } else {
        setSuccess("");
        setError(res.message);
      }
    } catch (error) {
      setLoader(false);
      setSuccess("");
      setError("Something went wrong!");
    }
  };

  if (pageLoader) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div aria-hidden="true" className="gradient-orb w-80 h-80 bg-violet-600 top-[-60px] right-[-60px]" />
      <div aria-hidden="true" className="gradient-orb w-64 h-64 bg-indigo-600 bottom-[-60px] left-[-60px]" />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-muted ring-1 ring-accent/30 mb-4">
            <svg className="h-7 w-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-content-primary">Update Product</h1>
          <p className="text-content-muted text-sm mt-1">Modify product details on the ledger</p>
        </div>

        <div className="glass-card p-8 shadow-glow-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input label="Product Name" type="text" id="productName" required value={productName} onChange={setProductName} />
            <Input label="Description"  type="text" id="productDescription" required value={productDescription} onChange={setProductDescription} />
            <Input label="Price ($)"    type="text" id="productPrice" required value={productPrice} onChange={setProductPrice} />

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
                <svg className="h-4 w-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3">
                <svg className="h-4 w-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-green-400">{success}</p>
              </div>
            )}

            <FormButton name="Save Changes" loader={loader} />

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full text-center text-sm text-content-muted hover:text-content-secondary transition-colors duration-150 mt-2"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;
