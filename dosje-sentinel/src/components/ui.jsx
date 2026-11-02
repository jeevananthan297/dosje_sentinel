export function Card({ className = "", children }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100">
      <div>
        <h3 className="font-semibold text-navy-900 text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const STATUS_STYLE = {
  Passed: "bg-emerald-100 text-emerald-700",
  Flagged: "bg-red-100 text-red-700",
  "Pending Corrective Action": "bg-amber-100 text-amber-700",
  Completed: "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Pending: "bg-amber-100 text-amber-700",
  Active: "bg-emerald-100 text-emerald-700",
  "On Leave": "bg-slate-100 text-slate-600",
};

export function StatusBadge({ status }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_STYLE[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

export function Table({ columns, rows, renderRow }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b border-slate-100">
            {columns.map((c) => (
              <th key={c} className="px-5 py-2.5 font-medium whitespace-nowrap">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
}

export function Button({ variant = "primary", className = "", children, ...props }) {
  const variants = {
    primary: "bg-navy-800 hover:bg-navy-700 text-white",
    secondary: "bg-slate-100 hover:bg-slate-200 text-navy-900",
    outline: "border border-slate-300 hover:bg-slate-50 text-slate-700",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };
  return (
    <button
      className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
