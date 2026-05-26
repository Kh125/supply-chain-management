import React, { useCallback } from "react";
import Loader from "../../common/loader";
import { Link } from "react-router-dom";
import ConsumerService from "../../services/consumerService";
import useLedgerList from "../../hooks/useLedgerList";
import { StatusBadge, PageShell, DataTable } from "../../common/tableHelpers";

const COLUMNS = [
  "Product Name",
  "Description",
  "Price",
  "Manufacturer",
  "Created Date",
  "Status",
  "Action",
];

function ConsumerProductOrderList() {
  const fetchOrders = useCallback(async () => {
    const res = await ConsumerService.getConsumerProductOrderList();
    if (res.success) return { success: true, data: res.result ?? [] };
    return { success: false, error: res.message };
  }, []);

  const { data, loader, error, show } = useLedgerList(fetchOrders);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg className="h-12 w-12 text-content-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p className="text-content-muted text-sm">You haven't placed any orders yet.</p>
    </div>
  );

  return (
    <PageShell title="My Orders">
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
          emptyMessage={data.length === 0 ? <EmptyState /> : null}
        >
          {data.map((item) => (
            <tr key={item.ID} className="table-row">
              <td className="table-td font-medium text-content-primary">{item.Name}</td>
              <td className="table-td max-w-xs truncate">{item.Description}</td>
              <td className="table-td">${item.Price}</td>
              <td className="table-td">{item.Manufacturer}</td>
              <td className="table-td">{item.CreatedDate}</td>
              <td className="table-td">
                <StatusBadge
                  status={item.Status === "Accepted" ? "Accepted" : item.Status}
                />
              </td>
              <td className="table-td">
                <Link
                  to={`/consumer-ordered-product-info/${item.ID}`}
                  className="inline-flex items-center gap-1.5 text-accent hover:text-accent-hover font-medium text-sm transition-colors duration-150"
                >
                  Details
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </PageShell>
  );
}

export default ConsumerProductOrderList;
