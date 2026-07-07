import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [mode, setMode] = useState("customer");
  const [step, setStep] = useState("request");
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [debugOtp, setDebugOtp] = useState("");
  const [adminCredentials, setAdminCredentials] = useState({ email: "", password: "" });
  const { requestOtp, verifyOtp, adminLogin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || "/";

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    const devOtp = await requestOtp({ mobile, name });
    setDebugOtp(devOtp || "");
    setStep("verify");
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    await verifyOtp({ mobile, otp, name });
    navigate(redirectTo);
  };

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    const user = await adminLogin(adminCredentials);
    navigate(user.role === "admin" ? "/admin" : "/");
  };

  return (
    <div className="section-space">
      <div className="page-shell grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2.5rem] bg-brand-700 p-8 text-white shadow-soft">
          <p className="text-sm uppercase tracking-[0.25em] text-brand-100">Welcome back</p>
          <h1 className="mt-4 font-display text-5xl font-bold">FreshMart keeps sign-in simple.</h1>
          <p className="mt-4 max-w-xl text-brand-100">
            OTP login for shoppers, secure password login for admins, and both flows connect to the same production-ready API.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-4xl bg-white/10 p-5">
              <p className="font-display text-2xl font-bold">OTP Login</p>
              <p className="mt-2 text-sm text-brand-100">Fast onboarding with mobile number verification via MSG91.</p>
            </div>
            <div className="rounded-4xl bg-white/10 p-5">
              <p className="font-display text-2xl font-bold">Admin Access</p>
              <p className="mt-2 text-sm text-brand-100">JWT-based admin session backed by hashed credentials.</p>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[2.5rem] p-6">
          <div className="grid grid-cols-2 gap-3 rounded-3xl bg-slate-100 p-2 dark:bg-slate-800">
            <button
              className={`rounded-2xl px-4 py-3 text-sm font-semibold ${mode === "customer" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}
              onClick={() => setMode("customer")}
              type="button"
            >
              Customer
            </button>
            <button
              className={`rounded-2xl px-4 py-3 text-sm font-semibold ${mode === "admin" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}
              onClick={() => setMode("admin")}
              type="button"
            >
              Admin
            </button>
          </div>

          {mode === "customer" ? (
            <form className="mt-6 space-y-4" onSubmit={step === "request" ? handleRequestOtp : handleVerifyOtp}>
              <Input label="Full name" onChange={(event) => setName(event.target.value)} placeholder="Ayush" value={name} />
              <Input label="Mobile number" onChange={(event) => setMobile(event.target.value)} placeholder="9876543210" value={mobile} />
              {step === "verify" && (
                <>
                  <Input label="Enter OTP" onChange={(event) => setOtp(event.target.value)} placeholder="6 digit OTP" value={otp} />
                  {debugOtp && (
                    <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:bg-amber-500/20 dark:text-amber-200">
                      Development OTP: {debugOtp}
                    </p>
                  )}
                </>
              )}
              <Button className="w-full" loading={loading} type="submit">
                {step === "request" ? "Send OTP" : "Verify and Continue"}
              </Button>
            </form>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={handleAdminLogin}>
              <Input
                label="Admin email"
                onChange={(event) => setAdminCredentials((current) => ({ ...current, email: event.target.value }))}
                placeholder="admin@freshmart.in"
                type="email"
                value={adminCredentials.email}
              />
              <Input
                label="Password"
                onChange={(event) => setAdminCredentials((current) => ({ ...current, password: event.target.value }))}
                placeholder="********"
                type="password"
                value={adminCredentials.password}
              />
              <Button className="w-full" loading={loading} type="submit">
                Sign in to admin panel
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

