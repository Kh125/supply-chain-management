import React, { useCallback } from "react";
import Loader from "../../common/loader";
import { Link } from "react-router-dom";
import ConsumerService from "../../services/consumerService";
import useLedgerList from "../../hooks/useLedgerList";
import { PageShell, DataTable } from "../../common/tableHelpers";

const COLUMNS = [
  "Product Name",
  "Description",
  "Price",
  "Manufacturer",
  "Manufactured Date",
  "Action",
];

function ProductListForConsumer() {
  const fetchProducts = useCallback(async () => {
    const res = await ConsumerService.getProductListByConsumer();
    if (res.data?.success) return { success: true, data: res.data.data };
    return { success: false, error: res.data?.message };
  }, []);

  const { data, loader, error, show } = useLedgerList(fetchProducts);

  const pendingProducts = data.filter((item) => item.Status === "Pending");

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg className="h-12 w-12 text-content-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
      </svg>
      <p className="text-content-muted text-sm">No products available to order right now.</p>
    </div>
  );

  return (
    <PageShell title="Available Products">
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
          emptyMessage={pendingProducts.length === 0 ? <EmptyState /> : null}
        >
          {pendingProducts.map((item) => (
            <tr key={item.ID} className="table-row">
              <td className="table-td font-medium text-content-primary">{item.Name}</td>
              <td className="table-td max-w-xs truncate">{item.Description}</td>
              <td className="table-td">${item.Price}</td>
              <td className="table-td">{item.Manufacturer}</td>
              <td className="table-td">{item.CreatedDate}</td>
              <td className="table-td">
                <Link
                  to={`/consumer-ordered-product-info/${item.ID}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-muted text-accent ring-1 ring-accent/30 text-xs font-semibold hover:bg-accent/20 transition-colors duration-150"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  Order Now
                </Link>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </PageShell>
  );
}

export default ProductListForConsumer;
