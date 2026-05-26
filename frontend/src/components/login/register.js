import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormButton from "../../common/formButton";
import Input from "../../common/input";
import Select from "../../common/select";
import registerService from "../../services/registerService";

function Register() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [secret, setSecret] = useState("");

  const [username, setUsername] = useState("");
  const [org, setOrg] = useState("manufacturer");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    setError("");
    setSuccess("");
    setSecret("");

    try {
      const res = await registerService.register({ orgName: org, username });
      setLoader(false);

      if (res.data.success) {
        const registeredOrg = org;
        const registeredUser = username;
        setSuccess("User registered successfully. You can sign in now.");
        setSecret(res.data.message.secret);
        exportKey(res.data.message.privateKey);
        setTimeout(() => {
          navigate("/login", {
            replace: true,
            state: { registeredAs: registeredOrg, username: registeredUser },
          });
        }, 2500);
        return;
      } else {
        setError(res.data.error.message);
      }
    } catch (error) {
      setLoader(false);
      setSuccess("");
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong!");
      }
    }
  };

  const exportKey = (key) => {
    const element = document.createElement("a");
    const file = new Blob([key], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${username}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background orbs */}
      <div aria-hidden="true" className="gradient-orb w-96 h-96 bg-cyan-600 top-[-80px] right-[-80px]" />
      <div aria-hidden="true" className="gradient-orb w-64 h-64 bg-indigo-600 bottom-[-60px] left-[-60px]" />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-muted ring-1 ring-accent/30 mb-4">
            <svg className="h-7 w-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-content-primary">Create an Account</h1>
          <p className="text-content-muted text-sm mt-1">Join the Supply Chain Nexus</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 shadow-glow-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Select
              label="Organization Role"
              value={org}
              onChange={setOrg}
              options={["manufacturer", "consumer"]}
            />

            <Input
              label="Username"
              type="text"
              id="username"
              required
              value={username}
              onChange={setUsername}
            />

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
                <svg className="h-4 w-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 space-y-1">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-green-400">{success}</p>
                </div>
                {secret && (
                  <div className="mt-2 rounded-md bg-surface-raised px-3 py-2">
                    <p className="text-xs text-content-muted mb-1">Your secret (save this!):</p>
                    <p className="text-xs font-mono text-accent break-all">{secret}</p>
                  </div>
                )}
                <p className="text-xs text-content-muted mt-2">
                  Your private key has been downloaded automatically. Redirecting to login…
                </p>
              </div>
            )}

            <FormButton name="Register" loader={loader} />

            <Link
              to="/login"
              className="flex justify-center w-full mt-2 text-sm text-content-muted hover:text-content-secondary transition-colors duration-200"
            >
              Already have an account?{" "}
              <span className="ml-1 text-accent font-medium">Sign in</span>
            </Link>
          </form>
        </div>

        <p className="text-center text-xs text-content-muted mt-6">
          Your private key file will be downloaded automatically upon registration.
        </p>
      </div>
    </div>
  );
}

export default Register;
