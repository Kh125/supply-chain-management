import { useState, useEffect, useCallback } from "react";
import ManufacturerService from "../services/manufacturerService";
import { subscribeLedgerChanged } from "../utils/ledgerSync";

export default function useProductFromLedger(token) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProduct = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError("");
      const res = await ManufacturerService.getProductByToken(token);
      if (res.data?.success && res.data.result) {
        setProduct(res.data.result);
      } else {
        setError(res.data?.message || "Failed to load product");
        setProduct(null);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Something went wrong"
      );
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    return subscribeLedgerChanged((changedId) => {
      if (!changedId || changedId === token) {
        fetchProduct();
      }
    });
  }, [token, fetchProduct]);

  return { product, loading, error, refetch: fetchProduct, setError };
}
