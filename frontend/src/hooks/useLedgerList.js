import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { subscribeLedgerChanged } from "../utils/ledgerSync";

/**
 * @param {() => Promise<{ success: boolean, data?: unknown[], error?: string }>} fetcher
 */
export default function useLedgerList(fetcher) {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);

  const reload = useCallback(async () => {
    try {
      setLoader(true);
      setError(false);
      const result = await fetcher();
      if (result.success) {
        setShow(true);
        setData(result.data ?? []);
      } else {
        setShow(false);
        setError(result.error || "Something went wrong!");
      }
    } catch {
      setShow(false);
      setError("Something went wrong!");
    } finally {
      setLoader(false);
    }
  }, [fetcher]);

  useEffect(() => {
    reload();
  }, [reload, location.pathname]);

  useEffect(() => {
    return subscribeLedgerChanged(() => reload());
  }, [reload]);

  useEffect(() => {
    const onFocus = () => reload();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [reload]);

  return { data, loader, error, show, reload };
}
