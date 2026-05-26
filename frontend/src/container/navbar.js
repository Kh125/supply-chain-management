import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/common/sclogo.png";

export default function Navbar() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`nav-link ${isActive(to) ? "nav-link-active" : ""}`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-surface-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-accent-muted flex items-center justify-center ring-1 ring-accent/30 group-hover:ring-accent/60 transition-all duration-200">
              <img className="h-6 w-6" src={logo} alt="Supply chain logo" />
            </div>
            <span className="text-content-primary font-bold text-base tracking-tight hidden sm:block">
              Supply Chain
              <span className="text-gradient ml-1">Nexus</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="flex items-center gap-1.5">
            {!isLoggedIn ? (
              <>
                <NavLink to="/login">Login</NavLink>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-4 py-2"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                <Link
                  to="/logout"
                  className="btn-secondary text-sm px-4 py-2"
                >
                  Logout
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
