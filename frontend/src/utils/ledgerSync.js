const listeners = new Set();

/** Notify all list/detail views that ledger data changed (optional product id). */
export function notifyLedgerChanged(productId = null) {
  listeners.forEach((listener) => listener(productId));
}

export function subscribeLedgerChanged(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
