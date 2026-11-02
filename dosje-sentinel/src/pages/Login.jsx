import { useState } from "react";
import { ShieldCheck, Lock, Mail, AlertCircle } from "lucide-react";
import { CREDENTIALS } from "../data";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const user = CREDENTIALS[email.trim().toLowerCase()];
    if (!user || user.password !== password) {
      setError("Invalid email or password. Try one of the demo accounts below.");
      return;
    }
    setError("");
    onLogin(user);
  }

  function fillDemo(mail) {
    setEmail(mail);
    setPassword(CREDENTIALS[mail].password);
    setError("");
  }

  return (
    <div className="min-h-screen w-full bg-navy-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      <div className="relative w-full max-w-5xl grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">
        {/* Left brand panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-navy-900 to-navy-800 text-white p-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center ring-1 ring-white/20">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">DoSJE Sentinel</p>
              <p className="text-xs text-white/60">Dept. of Social Justice & Empowerment</p>
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold leading-snug mb-3">Risk-based monitoring for welfare scheme institutes.</p>
            <p className="text-sm text-white/70 leading-relaxed">
              Track attendance, bills, and inspections across every institute — and let
              risk scoring flag where a ground visit matters most.
            </p>
          </div>
          <div className="text-xs text-white/40">Demo build · Mock data only</div>
        </div>

        {/* Right form panel */}
        <div className="bg-white p-8 sm:p-10 flex flex-col justify-center">
          <div className="md:hidden flex items-center gap-2 mb-6">
            <ShieldCheck size={22} className="text-navy-800" />
            <p className="font-bold text-navy-900">DoSJE Sentinel</p>
          </div>
          <h1 className="text-xl font-bold text-navy-900 mb-1">Sign in to your portal</h1>
          <p className="text-sm text-slate-500 mb-6">Use your registered department email.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@dosje.gov.in"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700/40 focus:border-navy-700"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700/40 focus:border-navy-700"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-navy-800 hover:bg-navy-700 text-white font-medium text-sm py-2.5 rounded-lg transition-colors"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-500 mb-2">Demo accounts</p>
            <div className="flex flex-col gap-1.5">
              {Object.entries(CREDENTIALS).map(([mail, u]) => (
                <button
                  key={mail}
                  onClick={() => fillDemo(mail)}
                  className="text-left text-xs px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between transition-colors"
                >
                  <span className="text-slate-600">{mail}</span>
                  <span className="text-navy-700 font-medium">{u.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
