import React, { useState } from "react";
import FormButton from "../../common/formButton";
import Input from "../../common/input";
import ManufacturerService from "../../services/manufacturerService";
import { notifyLedgerChanged } from "../../utils/ledgerSync";
import { useAuth } from "../../context/AuthContext";

function CreateItem() {
  const { username, orgName } = useAuth();
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");

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
        createdDate: new Date(),
        userName: username,
        orgName,
      };

      const res = await ManufacturerService.createProduct(tokenData);
      setLoader(false);

      if (res.data.success) {
        setError("");
        setSuccess("Product created successfully on the ledger!");
        setProductName("");
        setProductDescription("");
        setProductPrice("");
        notifyLedgerChanged();
      } else {
        setSuccess("");
        setError(res.data.error.message);
      }
    } catch (error) {
      setLoader(false);
      setSuccess("");
      setError("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div aria-hidden="true" className="gradient-orb w-80 h-80 bg-indigo-600 top-[-60px] right-[-60px]" />
      <div aria-hidden="true" className="gradient-orb w-64 h-64 bg-cyan-600 bottom-[-60px] left-[-60px]" />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-muted ring-1 ring-accent/30 mb-4">
            <svg className="h-7 w-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-content-primary">Create Product</h1>
          <p className="text-content-muted text-sm mt-1">Register a new product on the ledger</p>
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

            <FormButton name="Create Product" loader={loader} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateItem;
