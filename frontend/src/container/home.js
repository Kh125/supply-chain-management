import { Link, useNavigate } from "react-router-dom";
import manufacturer from "../assets/images/home/manufacturer.png";
import consumerImg from "../assets/images/home/consumer.png";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Hero Section ── */}
      <section className="relative isolate overflow-hidden">
        {/* Background gradient orbs */}
        <div
          aria-hidden="true"
          className="gradient-orb w-[600px] h-[600px] bg-indigo-500 top-[-100px] left-[-200px]"
        />
        <div
          aria-hidden="true"
          className="gradient-orb w-[400px] h-[400px] bg-cyan-500 top-[100px] right-[-100px]"
        />

        {/* Grid pattern */}
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-white/5 [mask-image:radial-gradient(80%_80%_at_top_center,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V0H40" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-28 pt-20 sm:pb-36 lg:flex lg:px-8 lg:py-48">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            {/* Badge */}
            <div className="mt-4 sm:mt-8">
              <a
                href="#about"
                className="inline-flex items-center gap-2 rounded-full bg-accent-muted ring-1 ring-accent/30 px-4 py-1.5 text-sm font-medium text-accent hover:bg-accent/20 transition-colors duration-200"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent-alt animate-pulse" />
                Built on Hyperledger Fabric
                <svg className="h-3.5 w-3.5 opacity-60" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </a>
            </div>

            <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-content-primary sm:text-7xl leading-tight">
              Your Supply<br />
              <span className="text-gradient">Chain Nexus</span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-content-secondary">
              Dive into the intricacies of supply chain management and stay updated on the latest industry advancements with full blockchain transparency.
            </p>

            <div className="mt-10 flex items-center gap-4 flex-wrap">
              <button
                onClick={() => navigate("/register")}
                className="btn-primary px-6 py-3 text-base rounded-xl shadow-glow-sm"
              >
                Get Started
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </button>
              <a
                href="#about"
                className="text-sm font-semibold text-content-secondary hover:text-content-primary transition-colors duration-200 flex items-center gap-1"
              >
                Learn more
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Hero side decoration */}
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none xl:ml-32 flex-1 items-center justify-center">
            <div className="relative w-full max-w-md">
              <div className="glass-card p-6 shadow-glow-sm animate-slide-up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-content-muted font-mono">ledger.tx</span>
                </div>
                {[
                  { label: "PRODUCT_CREATED", color: "text-green-400", val: "iPhone 16 Pro" },
                  { label: "ORDER_PLACED",    color: "text-cyan-400",  val: "consumer@org2" },
                  { label: "ACCEPTED",        color: "text-indigo-400",val: "manufacturer@org1" },
                  { label: "SHIPPED",         color: "text-blue-400",  val: "DHL #TX-7823" },
                  { label: "DELIVERED",       color: "text-emerald-400",val: "✓ Confirmed" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-surface-border last:border-0">
                    <span className={`text-xs font-mono font-semibold ${item.color} min-w-[150px]`}>{item.label}</span>
                    <span className="text-xs text-content-muted font-mono truncate">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Features Section ── */}
      <section className="relative py-24 bg-surface-card/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">Platform Features</p>
            <h2 className="text-4xl font-bold text-content-primary">Built for Every Role</h2>
            <p className="mt-4 text-lg text-content-secondary max-w-2xl mx-auto">
              Track and trace every step of your supply chain journey with real-time blockchain visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Manufacturer card */}
            <div className="glass-card p-8 hover:border-accent/40 hover:shadow-glow-sm transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6 ring-1 ring-indigo-500/30 group-hover:ring-indigo-500/60 transition-all duration-300">
                <img src={manufacturer} alt="Manufacturer" className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-content-primary mb-3">For Manufacturers</h3>
              <p className="text-content-secondary leading-7">
                Create products on the immutable ledger, fulfill orders, manage shipping status, and maintain full audit trails of every transaction.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Create Products", "Manage Orders", "Track Shipping"].map(tag => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-500/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Consumer card */}
            <div className="glass-card p-8 hover:border-accent-alt/40 hover:shadow-glow-sm transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-6 ring-1 ring-cyan-500/30 group-hover:ring-cyan-500/60 transition-all duration-300">
                <img src={consumerImg} alt="Consumer" className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-content-primary mb-3">For Consumers</h3>
              <p className="text-content-secondary leading-7">
                Browse verified products, place orders with confidence, and trace the full provenance of every item from manufacture to delivery.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Browse Products", "Place Orders", "View History"].map(tag => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats / CTA Banner ── */}
      <section className="relative py-24 overflow-hidden">
        <div aria-hidden="true" className="gradient-orb w-[500px] h-[500px] bg-indigo-600 top-[-100px] right-[-150px]" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-extrabold text-content-primary leading-tight mb-6">
            Supply Chain Management<br />
            <span className="text-gradient">On the Blockchain</span>
          </h2>
          <p className="text-lg text-content-secondary max-w-2xl mx-auto mb-10">
            Our platform built on Hyperledger Fabric provides a secure and transparent way for supply chain members to track and manage items with an immutable ledger.
          </p>
          <Link
            to="/register"
            className="btn-primary px-8 py-3.5 text-base rounded-xl shadow-glow-sm"
          >
            Register an Account
          </Link>
        </div>
      </section>

      {/* ── About Section ── */}
      <section id="about" className="py-24 bg-surface-card/30">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">About</p>
          <h2 className="text-4xl font-bold text-content-primary mb-6">How It Works</h2>
          <p className="text-lg text-content-secondary leading-8 max-w-2xl mx-auto">
            This app uses Hyperledger Fabric for an immutable product ledger. Manufacturers (Org1) create and fulfill orders; consumers (Org2) browse products, place orders, and view on-chain transaction history for full transparency.
          </p>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Register", desc: "Create your account as a manufacturer or consumer on Hyperledger Fabric." },
              { step: "02", title: "Transact", desc: "Manufacturers create products; consumers browse and place orders on the ledger." },
              { step: "03", title: "Trace",    desc: "Every status change is recorded immutably — full transparency at every step." },
            ].map(item => (
              <div key={item.step} className="glass-card p-6 text-left">
                <span className="text-4xl font-black text-gradient opacity-60">{item.step}</span>
                <h3 className="text-lg font-bold text-content-primary mt-2 mb-2">{item.title}</h3>
                <p className="text-sm text-content-secondary leading-6">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Get Started Section ── */}
      <section className="relative py-24 overflow-hidden">
        <div aria-hidden="true" className="gradient-orb w-[600px] h-[400px] bg-cyan-600 bottom-[-100px] left-[-200px]" />
        <div className="relative z-10 text-center px-6">
          <h2 className="text-4xl font-extrabold text-content-primary mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-content-secondary max-w-xl mx-auto mb-10">
            Register today and unlock the advantages of secure, decentralized supply chain management. Experience transparency and efficiency like never before.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="btn-primary px-8 py-3.5 text-base rounded-xl shadow-glow-accent"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-surface-border bg-surface py-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-content-muted">
            © 2024 Supply Chain Nexus. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-content-muted">Powered by</span>
            <span className="text-xs font-semibold text-gradient">Hyperledger Fabric</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
