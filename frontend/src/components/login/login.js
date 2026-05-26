import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormButton from "../../common/formButton";
import Input from "../../common/input";
import Select from "../../common/select";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [org, setOrg] = useState("manufacturer");
  const [privateKey, setPrivateKey] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard";
  const registeredUsername = location.state?.username;
  const registeredAs = location.state?.registeredAs;

  useEffect(() => {
    if (registeredUsername) setUsername(registeredUsername);
    if (registeredAs) setOrg(registeredAs);
  }, [registeredUsername, registeredAs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    setError("");
    try {
      const res = await login({ username, orgName: org, privateKey });
      setLoader(false);
      if (res.data.success) {
        navigate(redirectTo, { replace: true });
      } else {
        setError(res.data.error.message);
      }
    } catch (error) {
      setLoader(false);
      setError("Something went wrong!");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setPrivateKey(e.target.result);
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background orbs */}
      <div aria-hidden="true" className="gradient-orb w-96 h-96 bg-indigo-600 top-[-80px] left-[-80px]" />
      <div aria-hidden="true" className="gradient-orb w-64 h-64 bg-cyan-600 bottom-[-60px] right-[-60px]" />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-muted ring-1 ring-accent/30 mb-4">
            <svg className="h-7 w-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-content-primary">Welcome Back</h1>
          <p className="text-content-muted text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Success message from registration */}
        {registeredAs && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3">
            <svg className="h-4 w-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-green-400">
              Registration complete{registeredUsername ? ` for ${registeredUsername}` : ""}. Sign in as {registeredAs}.
            </p>
          </div>
        )}

        {/* Card */}
        <div className="glass-card p-8 shadow-glow-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Username"
              type="text"
              id="username"
              required
              value={username}
              onChange={setUsername}
            />

            {/* Private key file upload */}
            <div className="mt-3">
              <label className="form-label">Private Key File</label>
              <label
                htmlFor="privateKeyFile"
                className="flex items-center gap-3 w-full cursor-pointer rounded-lg border border-dashed border-surface-border bg-surface-raised/50 px-4 py-3 text-sm text-content-muted hover:border-accent/50 hover:text-content-secondary transition-colors duration-200"
              >
                <svg className="h-5 w-5 flex-shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                </svg>
                <span>{privateKey ? "✓ Key file loaded" : "Upload your private key (.txt)"}</span>
                <input
                  id="privateKeyFile"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept=".txt,.pem,.key"
                />
              </label>
            </div>

            <Select
              label="Login As"
              value={org}
              onChange={setOrg}
              options={["manufacturer", "consumer"]}
            />

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
                <svg className="h-4 w-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <FormButton name="Sign In" loader={loader} />

            <Link
              to="/register"
              className="flex justify-center w-full mt-2 text-sm text-content-muted hover:text-content-secondary transition-colors duration-200"
            >
              Don't have an account?{" "}
              <span className="ml-1 text-accent font-medium">Create one</span>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
