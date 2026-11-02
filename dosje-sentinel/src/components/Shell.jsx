import { useState } from "react";
import { Bell, LogOut, ShieldCheck, Menu, X } from "lucide-react";
import { ALERTS } from "../data";

const SEV_STYLE = {
  red: "bg-red-100 text-red-700",
  orange: "bg-orange-100 text-orange-700",
  yellow: "bg-yellow-100 text-yellow-700",
};

export default function Shell({ user, nav, active, onNavigate, onLogout, children }) {
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const showAlerts = user.role === "admin";

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-60 shrink-0 bg-navy-900 text-white flex-col">
        <SidebarContent nav={nav} active={active} onNavigate={onNavigate} />
      </aside>

      {/* Sidebar - mobile drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-navy-900 text-white flex flex-col">
            <div className="flex justify-end p-3">
              <button onClick={() => setMobileNavOpen(false)} className="text-white/70">
                <X size={20} />
              </button>
            </div>
            <SidebarContent nav={nav} active={active} onNavigate={(id) => { onNavigate(id); setMobileNavOpen(false); }} />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-slate-500" onClick={() => setMobileNavOpen(true)}>
              <Menu size={22} />
            </button>
            <p className="font-semibold text-navy-900 hidden sm:block">
              {nav.find((n) => n.id === active)?.label ?? "Dashboard"}
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {showAlerts && (
              <div className="relative">
                <button
                  onClick={() => setAlertsOpen((v) => !v)}
                  className="relative w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600"
                >
                  <Bell size={19} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                {alertsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 font-semibold text-sm text-navy-900">
                      Alerts & Notifications
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {ALERTS.map((a) => (
                        <div key={a.id} className="px-4 py-3 flex items-start gap-2.5">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${SEV_STYLE[a.severity]} mt-0.5 shrink-0`}>
                            {a.severity.toUpperCase()}
                          </span>
                          <p className="text-sm text-slate-700 leading-snug">{a.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-navy-800 text-white text-xs font-semibold flex items-center justify-center">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="text-sm font-medium text-navy-900">{user.name}</p>
                <p className="text-[11px] text-slate-500">{user.title}</p>
              </div>
              <button onClick={onLogout} className="ml-1 text-slate-400 hover:text-red-500" title="Log out">
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 min-w-0">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({ nav, active, onNavigate }) {
  return (
    <>
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10">
        <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center ring-1 ring-white/20">
          <ShieldCheck size={16} />
        </div>
        <div className="leading-tight">
          <p className="font-bold text-sm">DoSJE Sentinel</p>
        </div>
      </div>
      <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? "bg-white text-navy-900 font-medium" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="px-5 py-4 text-[11px] text-white/30 border-t border-white/10">
        Demo build · mock data only
      </div>
    </>
  );
}
