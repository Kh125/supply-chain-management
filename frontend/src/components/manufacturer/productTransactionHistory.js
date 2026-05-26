import React, { useCallback } from "react";
import Loader from "../../common/loader";
import ManufacturerService from "../../services/manufacturerService";
import { useParams, useNavigate } from "react-router-dom";
import useLedgerList from "../../hooks/useLedgerList";
import { PageShell, DataTable } from "../../common/tableHelpers";
import { StatusBadge } from "../../common/tableHelpers";

const COLUMNS = [
  "Product Name",
  "Description",
  "Price",
  "Manufacturer",
  "Status",
  "Modified Date",
];

function ProductTransactionHistory() {
  const { token } = useParams();
  const navigate = useNavigate();

  const fetchHistory = useCallback(async () => {
    const res = await ManufacturerService.getProductTransactionByToken(token);
    if (res.data?.success) return { success: true, data: res.data.data };
    return { success: false, error: res.data?.message };
  }, [token]);

  const { data, loader, error, show } = useLedgerList(fetchHistory);

  return (
    <PageShell title="Transaction History">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-content-muted hover:text-content-secondary transition-colors duration-150"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Product
        </button>
      </div>

      {loader && (
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
          emptyMessage={
            data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <svg className="h-12 w-12 text-content-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-content-muted text-sm">No transaction history found.</p>
              </div>
            ) : null
          }
        >
          {data.map((item, index) => (
            <tr key={index} className="table-row">
              <td className="table-td font-medium text-content-primary">{item.Name}</td>
              <td className="table-td max-w-xs truncate">{item.Description}</td>
              <td className="table-td">${item.Price}</td>
              <td className="table-td">{item.Manufacturer}</td>
              <td className="table-td">
                <StatusBadge status={item.Status} />
              </td>
              <td className="table-td">
                {item.ModifiedDate === "null" ? item.CreatedDate : item.ModifiedDate}
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </PageShell>
  );
}

export default ProductTransactionHistory;
