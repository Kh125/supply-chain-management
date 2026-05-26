import React, { useCallback, useState } from "react";
import Loader from "../../common/loader";
import ManufacturerService from "../../services/manufacturerService";
import useLedgerList from "../../hooks/useLedgerList";
import { notifyLedgerChanged } from "../../utils/ledgerSync";
import { canManufacturerAccept } from "../../utils/productStatus";
import { StatusBadge, PageShell, DataTable } from "../../common/tableHelpers";

const COLUMNS = [
  "Product Name",
  "Description",
  "Price",
  "Manufacturer",
  "Status",
  "Created Date",
  "Action",
];

function RequestedProductOrderList() {
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    const res = await ManufacturerService.getRequestedProductOrderList();
    if (res.success) return { success: true, data: res.result ?? [] };
    return { success: false, error: res.message };
  }, []);

  const { data, loader, error, show, reload } = useLedgerList(fetchOrders);

  const acceptProductOrder = async (productId) => {
    setActionLoading(true);
    try {
      const res = await ManufacturerService.acceptProductOrder(productId);
      if (res.success) {
        notifyLedgerChanged(productId);
        await reload();
      } else {
        throw new Error(res.message || "Accept failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg className="h-12 w-12 text-content-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p className="text-content-muted text-sm">No pending order requests at this time.</p>
    </div>
  );

  return (
    <PageShell title="Order Requests">
      {(loader || actionLoading) && (
        <div className="flex justify-center py-16"><Loader /></div>
      )}
      {error && (
        <div className="glass-card px-6 py-4 border-red-500/20 bg-red-500/5">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      {show && (
        <DataTable
          columns={COLUMNS}
          emptyMessage={data.length === 0 ? <EmptyState /> : null}
        >
          {data.map((item) => (
            <tr key={item.ID} className="table-row">
              <td className="table-td font-medium text-content-primary">{item.Name}</td>
              <td className="table-td max-w-xs truncate">{item.Description}</td>
              <td className="table-td">${item.Price}</td>
              <td className="table-td">{item.Manufacturer}</td>
              <td className="table-td">
                <StatusBadge status={item.Status} />
              </td>
              <td className="table-td">{item.CreatedDate}</td>
              <td className="table-td">
                {canManufacturerAccept(item.Status) ? (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => acceptProductOrder(item.ID)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 ring-1 ring-green-500/30 text-xs font-semibold hover:bg-green-500/25 transition-colors duration-150 disabled:opacity-50"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Accept
                  </button>
                ) : (
                  <span className="text-content-muted text-xs">—</span>
                )}
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </PageShell>
  );
}

export default RequestedProductOrderList;
