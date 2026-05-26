import React, { useCallback } from "react";
import Loader from "../../common/loader";
import ManufacturerService from "../../services/manufacturerService";
import { Link } from "react-router-dom";
import useLedgerList from "../../hooks/useLedgerList";
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

function ProductList() {
  const fetchProducts = useCallback(async () => {
    const res = await ManufacturerService.getProductList();
    if (res.data?.success) return { success: true, data: res.data.data };
    return { success: false, error: res.data?.message };
  }, []);

  const { data, loader, error, show } = useLedgerList(fetchProducts);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg className="h-12 w-12 text-content-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
      <p className="text-content-muted text-sm">No products found on the ledger yet.</p>
    </div>
  );

  return (
    <PageShell title="Product List">
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
          {data.map((item, index) => (
            <tr key={index} className="table-row">
              <td className="table-td font-medium text-content-primary">{item.Name}</td>
              <td className="table-td max-w-xs truncate">{item.Description}</td>
              <td className="table-td">${item.Price}</td>
              <td className="table-td">{item.Manufacturer}</td>
              <td className="table-td">
                <StatusBadge status={item.Status} />
              </td>
              <td className="table-td">{item.CreatedDate}</td>
              <td className="table-td">
                <Link
                  to={`/product-info/${item.ID}`}
                  className="inline-flex items-center gap-1.5 text-accent hover:text-accent-hover font-medium text-sm transition-colors duration-150"
                >
                  View details
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

export default ProductList;
