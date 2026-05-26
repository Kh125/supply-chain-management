import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ManufacturerService from "../../services/manufacturerService";
import Loader from "../../common/loader";
import ProductDetailFields from "../common/ProductDetailFields";
import ShippingProgress from "../common/ShippingProgress";
import useProductFromLedger from "../../hooks/useProductFromLedger";
import {
  canManufacturerAccept,
  canManufacturerDeliver,
  canManufacturerShip,
  canManufacturerUpdate,
} from "../../utils/productStatus";
import { notifyLedgerChanged } from "../../utils/ledgerSync";
import { useAuth } from "../../context/AuthContext";

function ProductInfo() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const isManufacturer = role === "manufacturer";
  const { product, loading, error, refetch, setError } = useProductFromLedger(token);
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const runAction = async (actionFn, successMessage) => {
    setError("");
    setSuccess("");
    setActionLoading(true);
    try {
      const res = await actionFn();
      if (res.success) {
        setSuccess(successMessage || res.message);
        await refetch();
        notifyLedgerChanged(token);
      } else {
        setError(res.message || "Action failed");
      }
    } catch (err) {
      setError(typeof err === "string" ? err : "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const acceptOrder   = () => runAction(() => ManufacturerService.acceptProductOrder(token),  "Order accepted on ledger");
  const shipProduct   = () => runAction(() => ManufacturerService.shipProductOrder(token),    "Product marked as shipped");
  const deliverProduct = () => runAction(() => ManufacturerService.deliverProductOrder(token), "Product marked as delivered");

  if (loading && !product) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const status = product?.Status;

  return (
    <div className="min-h-screen bg-surface py-10 px-4 animate-fade-in">
      <div className="mx-auto max-w-2xl">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-content-muted hover:text-content-secondary mb-6 transition-colors duration-150"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>

        {/* Page heading */}
        <div className="mb-2">
          <p className="text-xs text-content-muted uppercase tracking-widest">Manufacturer View</p>
          <h1 className="page-heading mt-1">Product Details</h1>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
            <svg className="h-4 w-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3">
            <svg className="h-4 w-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-green-400">{success}</p>
          </div>
        )}

        {/* Product info card */}
        <ProductDetailFields product={product} />

        {/* Actions */}
        {isManufacturer && product && (
          <div className="mt-6 space-y-3">
            {canManufacturerUpdate(status) && (
              <Link
                to={`/update-product/${token}`}
                className="btn-secondary w-full justify-center py-3"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                Update Product
              </Link>
            )}

            {canManufacturerAccept(status) && (
              <button
                type="button"
                onClick={acceptOrder}
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-green-500/15 text-green-400 ring-1 ring-green-500/30 font-semibold text-sm hover:bg-green-500/25 disabled:opacity-50 transition-all duration-200"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Accept Order Request
              </button>
            )}

            {canManufacturerShip(status) && (
              <button
                type="button"
                onClick={shipProduct}
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30 font-semibold text-sm hover:bg-blue-500/25 disabled:opacity-50 transition-all duration-200"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                Mark as Shipped
              </button>
            )}

            {canManufacturerDeliver(status) && (
              <button
                type="button"
                onClick={deliverProduct}
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30 font-semibold text-sm hover:bg-slate-500/25 disabled:opacity-50 transition-all duration-200"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mark as Delivered
              </button>
            )}

            <Link
              to={`/product-transaction-history/${token}`}
              className="flex items-center justify-center gap-2 py-3 text-sm text-content-secondary hover:text-accent transition-colors duration-150"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Transaction History
            </Link>
          </div>
        )}

        {product && <ShippingProgress status={product.Status} />}

        {actionLoading && (
          <div className="mt-6 flex justify-center"><Loader /></div>
        )}
      </div>
    </div>
  );
}

export default ProductInfo;
