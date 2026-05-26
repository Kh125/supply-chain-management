/**
 * Shared status badge component used across all table and detail views.
 */
export const StatusBadge = ({ status }) => {
  const styles = {
    Pending:               "bg-yellow-500/15 text-yellow-400 ring-yellow-500/30",
    "Pending Order Request":"bg-yellow-500/15 text-yellow-400 ring-yellow-500/30",
    Accepted:              "bg-green-500/15  text-green-400  ring-green-500/30",
    Shipped:               "bg-blue-500/15   text-blue-400   ring-blue-500/30",
    Delivered:             "bg-slate-500/15  text-slate-400  ring-slate-500/30",
  };
  const cls = styles[status] || "bg-slate-500/15 text-slate-400 ring-slate-500/30";
  return (
    <span className={`status-badge ring-1 ${cls}`}>
      {status || "Unknown"}
    </span>
  );
};

/**
 * Shared page wrapper for list pages (tables).
 */
export const PageShell = ({ title, children }) => (
  <div className="min-h-screen bg-surface py-10 px-4 animate-fade-in">
    <div className="mx-auto max-w-7xl">
      <h1 className="page-heading mb-8">{title}</h1>
      {children}
    </div>
  </div>
);

/**
 * Shared dark data table wrapper.
 */
export const DataTable = ({ columns, children, emptyMessage }) => (
  <div className="glass-card overflow-hidden">
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead className="table-header">
          <tr>
            {columns.map((col, i) => (
              <th key={i} scope="col" className="table-th">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border bg-transparent">
          {children}
        </tbody>
      </table>
      {emptyMessage}
    </div>
  </div>
);
