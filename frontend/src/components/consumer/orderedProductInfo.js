import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ConsumerService from "../../services/consumerService";
import Loader from "../../common/loader";
import ProductDetailFields from "../common/ProductDetailFields";
import ShippingProgress from "../common/ShippingProgress";
import useProductFromLedger from "../../hooks/useProductFromLedger";
import { canConsumerOrder } from "../../utils/productStatus";
import { notifyLedgerChanged } from "../../utils/ledgerSync";
import { useAuth } from "../../context/AuthContext";

function OrderedProductInfo() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { role, username } = useAuth();
  const { product, loading, error, refetch, setError } = useProductFromLedger(token);
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const orderProduct = async () => {
    setError("");
    setSuccess("");
    setActionLoading(true);
    try {
      const res = await ConsumerService.orderProduct({ token, userName: username });
      if (res.success) {
        setSuccess(res.message);
        await refetch();
        notifyLedgerChanged(token);
      } else {
        setError(res.message || "Order failed");
      }
    } catch (err) {
      setError(typeof err === "string" ? err : "Order failed");
    } finally {
      setActionLoading(false);
    }
  };

  const showOrderButton = role === "consumer" && product && canConsumerOrder(product.Status);
  const showHistory     = role === "consumer" && product && !canConsumerOrder(product.Status);

  if (loading && !product) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-10 px-4 animate-fade-in">
      <div className="mx-auto max-w-2xl">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-content-muted hover:text-content-secondary mb-6 transition-colors duration-150"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>

        <div className="mb-2">
          <p className="text-xs text-content-muted uppercase tracking-widest">Consumer View</p>
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

        <ProductDetailFields product={product} />

        {/* Order button */}
        {showOrderButton && (
          <button
            type="button"
            onClick={orderProduct}
            disabled={actionLoading}
            className="mt-6 btn-primary w-full justify-center py-3 text-base rounded-xl shadow-glow-sm"
          >
            {actionLoading ? (
              <>
                <Loader height={5} />
                <span>Placing order…</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                Order Product
              </>
            )}
          </button>
        )}

        {/* History link */}
        {showHistory && (
          <Link
            to={`/product-transaction-history/${token}`}
            className="mt-6 flex items-center justify-center gap-2 py-3 text-sm text-content-secondary hover:text-accent transition-colors duration-150"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Transaction History
          </Link>
        )}

        {product && <ShippingProgress status={product.Status} />}
      </div>
    </div>
  );
}

export default OrderedProductInfo;
