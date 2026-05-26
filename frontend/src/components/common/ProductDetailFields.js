import React from "react";
import { formatConsumer } from "../../utils/productStatus";
import { StatusBadge } from "../../common/tableHelpers";

const FieldRow = ({ label, value, children }) => (
  <div className="flex items-start justify-between py-3 border-b border-surface-border last:border-0">
    <span className="text-xs font-semibold text-content-muted uppercase tracking-wider min-w-[120px]">
      {label}
    </span>
    <span className="text-sm text-content-primary text-right flex-1">
      {children || value}
    </span>
  </div>
);

function ProductDetailFields({ product }) {
  if (!product) return null;

  const consumer = formatConsumer(product.Consumer);

  return (
    <div className="glass-card p-6 mt-6">
      <h2 className="text-xs font-semibold text-content-muted uppercase tracking-widest mb-4">
        Product Information
      </h2>

      <FieldRow label="Token ID">
        <span className="font-mono text-xs bg-surface-raised px-2 py-0.5 rounded text-content-secondary break-all">
          {product.ID}
        </span>
      </FieldRow>

      <FieldRow label="Name" value={product.Name} />
      <FieldRow label="Description" value={product.Description} />

      <FieldRow label="Price">
        <span className="font-semibold text-content-primary">${product.Price}</span>
      </FieldRow>

      <FieldRow label="Status">
        <StatusBadge status={product.Status} />
      </FieldRow>

      <FieldRow label="Manufacturer" value={product.Manufacturer} />
      <FieldRow label="Created" value={product.CreatedDate} />

      {consumer && <FieldRow label="Consumer" value={consumer} />}

      {product.DeliveredDate && product.DeliveredDate !== "null" && (
        <FieldRow label="Delivered" value={product.DeliveredDate} />
      )}
    </div>
  );
}

export default ProductDetailFields;
