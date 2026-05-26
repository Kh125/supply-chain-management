import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { username, orgName } = useAuth();
  const navigate = useNavigate();
  const name    = username || "Unknown";
  const orgname = orgName  || "Unknown";

  const roleColor = orgname === "manufacturer"
    ? "bg-indigo-500/15 text-indigo-400 ring-indigo-500/30"
    : "bg-cyan-500/15 text-cyan-400 ring-cyan-500/30";

  return (
    <div className="min-h-screen bg-surface py-12 px-4 animate-fade-in">
      <div className="mx-auto max-w-2xl">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-content-muted hover:text-content-secondary mb-8 transition-colors duration-150"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="page-heading">My Profile</h1>
          <p className="text-content-muted text-sm mt-1">Your account information on the Supply Chain Nexus</p>
        </div>

        {/* Profile card */}
        <div className="glass-card overflow-hidden">
          {/* Avatar banner */}
          <div className="h-24 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 relative">
            <div className="absolute -bottom-10 left-8">
              <div className="h-20 w-20 rounded-2xl ring-4 ring-surface-card overflow-hidden">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=80&bold=true`}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-14 pb-8 px-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-content-primary">{name}</h2>
                <p className="text-content-muted text-sm mt-0.5 capitalize">{orgname}</p>
              </div>
              <span className={`status-badge ring-1 capitalize ${roleColor}`}>
                {orgname}
              </span>
            </div>

            {/* Info rows */}
            <div className="space-y-1 divide-y divide-surface-border">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-surface-raised flex items-center justify-center">
                    <svg className="h-4 w-4 text-content-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-content-muted uppercase tracking-wider">Username</p>
                    <p className="text-sm font-medium text-content-primary mt-0.5">{name}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-surface-raised flex items-center justify-center">
                    <svg className="h-4 w-4 text-content-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-content-muted uppercase tracking-wider">Organization</p>
                    <p className="text-sm font-medium text-content-primary mt-0.5 capitalize">{orgname}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-surface-raised flex items-center justify-center">
                    <svg className="h-4 w-4 text-content-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-content-muted uppercase tracking-wider">Network</p>
                    <p className="text-sm font-medium text-content-primary mt-0.5">Hyperledger Fabric</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/15 text-green-400 ring-1 ring-green-500/30 font-semibold">
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-content-muted mt-6">
          Account information is read-only and managed by the blockchain network.
        </p>
      </div>
    </div>
  );
};

export default Profile;
