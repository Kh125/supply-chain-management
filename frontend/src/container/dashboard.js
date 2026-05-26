import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

// SVG icons for each service
const PackageIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const ListIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const manufacturerApps = [
  {
    name: "Create Product",
    icon: <PackageIcon />,
    link: "/create-product",
    description: "Register a new product on the Hyperledger Fabric ledger.",
    button: "Create",
    color: "indigo",
  },
  {
    name: "Orders",
    icon: <ClipboardIcon />,
    link: "/requested-product-order-list",
    description: "Review and accept incoming order requests from consumers.",
    button: "View Orders",
    color: "cyan",
  },
  {
    name: "Products",
    icon: <ListIcon />,
    link: "/product-list",
    description: "Browse all products you have created on the ledger.",
    button: "Browse",
    color: "violet",
  },
];

const consumerApps = [
  {
    name: "Product List",
    icon: <ShoppingBagIcon />,
    link: "/product-list-consumer",
    description: "Browse available products from manufacturers and place orders.",
    button: "Browse",
    color: "cyan",
  },
  {
    name: "My Orders",
    icon: <ClipboardIcon />,
    link: "/consumer-product-order-list",
    description: "Track all of your placed orders and their current status.",
    button: "View",
    color: "indigo",
  },
];

const colorMap = {
  indigo: {
    bg: "bg-indigo-500/15",
    ring: "ring-indigo-500/30",
    hover: "hover:ring-indigo-500/60",
    text: "text-indigo-400",
    btn: "bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 ring-1 ring-indigo-500/30",
  },
  cyan: {
    bg: "bg-cyan-500/15",
    ring: "ring-cyan-500/30",
    hover: "hover:ring-cyan-500/60",
    text: "text-cyan-400",
    btn: "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 ring-1 ring-cyan-500/30",
  },
  violet: {
    bg: "bg-violet-500/15",
    ring: "ring-violet-500/30",
    hover: "hover:ring-violet-500/60",
    text: "text-violet-400",
    btn: "bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 ring-1 ring-violet-500/30",
  },
};

function Dashboard() {
  const { role, username } = useAuth();
  const [apps, setApps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setApps(role === "manufacturer" ? manufacturerApps : consumerApps);
  }, [role]);

  const roleLabel = role === "manufacturer" ? "Manufacturer" : "Consumer";

  return (
    <div className="min-h-screen bg-surface px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent-muted ring-1 ring-accent/30 text-accent">
              {roleLabel}
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-content-primary tracking-tight">
            Good day,{" "}
            <span className="text-gradient">{username || "there"}</span> 👋
          </h1>
          <p className="mt-2 text-content-secondary">
            Here's what you can do on the Supply Chain Nexus platform.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app, index) => {
            const c = colorMap[app.color];
            return (
              <div
                key={index}
                onClick={() => navigate(app.link)}
                className={`glass-card p-6 cursor-pointer group hover:border-surface-border/80 hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300 animate-slide-up`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Icon */}
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${c.bg} ring-1 ${c.ring} ${c.hover} transition-all duration-300 ${c.text} mb-5`}>
                  {app.icon}
                </div>

                {/* Content */}
                <h2 className="text-lg font-bold text-content-primary mb-2">{app.name}</h2>
                <p className="text-sm text-content-secondary leading-6 mb-6">{app.description}</p>

                {/* CTA */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${c.btn}`}>
                  {app.button}
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
