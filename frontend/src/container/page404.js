import { Link } from "react-router-dom";

function Page404() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div aria-hidden="true" className="gradient-orb w-96 h-96 bg-indigo-600 top-[-100px] left-[-100px]" />
      <div aria-hidden="true" className="gradient-orb w-64 h-64 bg-cyan-600 bottom-[-60px] right-[-60px]" />

      <div className="relative z-10 text-center animate-slide-up">
        {/* 404 number */}
        <p className="text-9xl font-black text-gradient leading-none select-none">
          404
        </p>

        {/* Badge */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-1.5 ring-1 ring-red-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
          <span className="text-sm font-medium text-red-400">Page Not Found</span>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-content-primary">
          Oops! This page doesn't exist
        </h1>
        <p className="mt-3 text-content-muted max-w-sm mx-auto text-sm leading-6">
          The page you're looking for may have been moved, deleted, or never existed. Let's get you back on track.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn-primary px-6 py-3 rounded-xl">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Go to Home
          </Link>
          <Link to="/dashboard" className="btn-secondary px-6 py-3 rounded-xl">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Page404;