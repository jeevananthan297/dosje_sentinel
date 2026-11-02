import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, ClipboardCheck, ListChecks, History, Video, PhoneCall,
  WifiOff, Camera, MapPin, X, PhoneOff, Wifi, CheckCircle2, RefreshCw,
} from "lucide-react";
import Shell from "../components/Shell";
import { Card, CardHeader, StatusBadge, Table, Button } from "../components/ui";
import { INBOX, INSTITUTES, CHECKLIST_TEMPLATE, PREVIOUS_INSPECTIONS, CCTV_FEEDS, riskColor } from "../data";

const NAV = [
  { id: "mails", label: "Mails from Admin", icon: Mail },
  { id: "allocation", label: "Inspection Allocation", icon: ClipboardCheck },
  { id: "checklist", label: "Checklist & Evidence", icon: ListChecks },
  { id: "previous", label: "Previous Inspections", icon: History },
  { id: "cctv", label: "CCTV Access", icon: Video },
  { id: "vc", label: "Random VC Call", icon: PhoneCall },
];

const ASSIGNED = INSTITUTES[4]; // Vocational Training Centre, Madurai — high risk, current assignment

export default function InspectorPortal({ user, onLogout }) {
  const [active, setActive] = useState("mails");
  const [riskToast, setRiskToast] = useState(null);

  return (
    <Shell user={user} nav={NAV} active={active} onNavigate={setActive} onLogout={onLogout}>
      {active === "mails" && <MailsScreen />}
      {active === "allocation" && <AllocationScreen />}
      {active === "checklist" && <ChecklistScreen onSubmitFlag={(from, to) => setRiskToast({ from, to })} />}
      {active === "previous" && <PreviousScreen />}
      {active === "cctv" && <CctvScreen />}
      {active === "vc" && <VcScreen />}

      <AnimatePresence>
        {riskToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onAnimationComplete={() => setTimeout(() => setRiskToast(null), 2800)}
            className="fixed bottom-6 right-6 bg-navy-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50"
          >
            <RefreshCw size={15} />
            Risk score updated: {riskToast.from} → <span className="font-semibold text-red-300">{riskToast.to}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  );
}

function MailsScreen() {
  const [openId, setOpenId] = useState(INBOX[0]?.id ?? null);
  const selected = INBOX.find((m) => m.id === openId);
  return (
    <Card className="grid md:grid-cols-[320px_1fr] overflow-hidden min-h-[420px]">
      <div className="border-r border-slate-100 divide-y divide-slate-100 overflow-y-auto">
        {INBOX.map((m) => (
          <button key={m.id} onClick={() => setOpenId(m.id)} className={`w-full text-left px-4 py-3 ${openId === m.id ? "bg-slate-50" : "hover:bg-slate-50"}`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-navy-900">{m.from}</p>
              <p className="text-[11px] text-slate-400">{m.date}</p>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 truncate">{m.subject}</p>
          </button>
        ))}
      </div>
      <div className="p-6">
        {selected ? (
          <>
            <p className="text-xs text-slate-400 mb-1">{selected.date} · from {selected.from}</p>
            <h3 className="text-lg font-semibold text-navy-900 mb-4">{selected.subject}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{selected.body}</p>
          </>
        ) : <p className="text-sm text-slate-400">Select a mail to read</p>}
      </div>
    </Card>
  );
}

function AllocationScreen() {
  const c = riskColor(ASSIGNED.riskScore);
  return (
    <Card className="max-w-lg">
      <CardHeader title="Current Assigned Inspection" />
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-semibold text-navy-900">{ASSIGNED.name}</p>
            <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={13} /> {ASSIGNED.region}</p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-700">First Inspection</span>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-500">Due Date</p>
            <p className="text-sm font-medium text-navy-900">15 Sept 2026</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Triggering Risk Score</p>
            <p className={`text-sm font-semibold ${c.text}`}>{ASSIGNED.riskScore} / 100</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ChecklistScreen({ onSubmitFlag }) {
  const [offline, setOffline] = useState(false);
  const [queued, setQueued] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [items, setItems] = useState(() => Object.fromEntries(CHECKLIST_TEMPLATE.map((c) => [c.id, { checked: false, remarks: "" }])));
  const [cameraOpen, setCameraOpen] = useState(false);
  const [evidenceCount, setEvidenceCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  function toggleOffline() {
    if (offline) {
      // going back online -> sync
      setOffline(false);
      if (queued > 0) {
        setSyncing(true);
        setTimeout(() => {
          setSyncing(false);
          setSynced(true);
          setQueued(0);
          setTimeout(() => setSynced(false), 2500);
        }, 1600);
      }
    } else {
      setOffline(true);
      setSynced(false);
    }
  }

  function updateItem(id, patch) {
    setItems((s) => ({ ...s, [id]: { ...s[id], ...patch } }));
    if (offline) setQueued((q) => q + 1);
  }

  function handleSubmit() {
    setSubmitted(true);
    const flagged = Object.values(items).filter((i) => !i.checked).length;
    if (flagged > 0) {
      const from = ASSIGNED.riskScore;
      const to = Math.min(100, from + flagged * 4);
      onSubmitFlag(from, to);
    }
  }

  return (
    <div className="space-y-4">
      {offline && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-2.5 rounded-lg flex items-center gap-2">
          <WifiOff size={15} /> You are offline — data will sync when connection is restored.
          {queued > 0 && <span className="ml-auto text-xs font-semibold bg-amber-200 px-2 py-0.5 rounded-full">{queued} queued</span>}
        </div>
      )}
      {syncing && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-2.5 rounded-lg flex items-center gap-2">
          <RefreshCw size={15} className="animate-spin" /> Syncing {queued} items...
        </div>
      )}
      {synced && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-2.5 rounded-lg flex items-center gap-2">
          <CheckCircle2 size={15} /> All synced
        </div>
      )}

      <Card>
        <CardHeader
          title={`Checklist — ${ASSIGNED.name}`}
          subtitle="5–6 standard verification items"
          action={
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
              {offline ? <WifiOff size={14} className="text-amber-600" /> : <Wifi size={14} className="text-emerald-600" />}
              Offline Mode
              <span
                onClick={toggleOffline}
                className={`w-9 h-5 rounded-full relative transition-colors ${offline ? "bg-amber-500" : "bg-slate-200"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${offline ? "left-4.5 translate-x-4" : "left-0.5"}`} />
              </span>
            </label>
          }
        />
        <div className="divide-y divide-slate-100">
          {CHECKLIST_TEMPLATE.map((c) => (
            <div key={c.id} className="px-5 py-3.5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={items[c.id].checked}
                  onChange={(e) => updateItem(c.id, { checked: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-navy-800"
                />
                <span className="text-sm text-navy-900">{c.label}</span>
              </label>
              <input
                value={items[c.id].remarks}
                onChange={(e) => updateItem(c.id, { remarks: e.target.value })}
                placeholder="Remarks (optional)"
                className="mt-2 ml-7 w-[calc(100%-1.75rem)] text-xs rounded-md border border-slate-200 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-navy-700/30"
              />
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <Button variant="secondary" onClick={() => setCameraOpen(true)}>
            <span className="flex items-center gap-1.5"><Camera size={15} /> Capture Evidence {evidenceCount > 0 && `(${evidenceCount})`}</span>
          </Button>
          <Button onClick={handleSubmit}>Submit Checklist</Button>
          {submitted && <span className="text-sm text-emerald-600 flex items-center gap-1"><CheckCircle2 size={15} /> Submitted</span>}
        </div>
      </Card>

      {cameraOpen && (
        <CameraOverlay
          onClose={() => setCameraOpen(false)}
          onCapture={() => { setEvidenceCount((n) => n + 1); setCameraOpen(false); }}
        />
      )}
    </div>
  );
}

function CameraOverlay({ onClose, onCapture }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const lat = "9.9252° N";
  const lng = "78.1198° E";

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md aspect-[3/4] bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl overflow-hidden ring-1 ring-white/10">
        <button onClick={onClose} className="absolute top-3 right-3 z-10 text-white/70 hover:text-white">
          <X size={22} />
        </button>
        <div className="absolute inset-0 flex items-center justify-center text-white/20">
          <Camera size={72} />
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm text-white text-xs px-4 py-3 space-y-1">
          <p className="font-mono">{now.toLocaleString("en-IN")}</p>
          <p className="font-mono text-white/70">GPS: {lat}, {lng}</p>
        </div>
      </div>
      <div className="absolute bottom-8 flex items-center gap-4">
        <button
          onClick={onCapture}
          className="w-16 h-16 rounded-full bg-white ring-4 ring-white/30 hover:scale-105 transition-transform"
        />
      </div>
      <p className="absolute bottom-2 text-white/40 text-[11px]">Capture Now only — gallery upload disabled</p>
    </div>
  );
}

function PreviousScreen() {
  return (
    <Card>
      <CardHeader title="Previous Inspections" subtitle="Conducted by you" />
      <Table
        columns={["ID", "Institute", "Date", "Status"]}
        rows={PREVIOUS_INSPECTIONS}
        renderRow={(r) => (
          <tr key={r.id}>
            <td className="px-5 py-3 font-medium text-navy-900">{r.id}</td>
            <td className="px-5 py-3 text-slate-600">{r.institute}</td>
            <td className="px-5 py-3 text-slate-600">{r.date}</td>
            <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
          </tr>
        )}
      />
    </Card>
  );
}

function CctvScreen() {
  const [mode, setMode] = useState("Live");
  const feeds = CCTV_FEEDS.filter((f) => f.type === mode);
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">Showing feeds for your assigned region only</p>
        <div className="bg-white border border-slate-200 rounded-lg p-1 flex text-xs font-medium">
          {["Live", "Recorded"].map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 rounded-md ${mode === m ? "bg-navy-800 text-white" : "text-slate-600"}`}>{m}</button>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {feeds.map((f) => (
          <Card key={f.id} className="overflow-hidden">
            <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
              <Video size={28} className="text-white/20" />
              {f.type === "Live" && (
                <span className="absolute top-2 left-2 text-[10px] font-semibold bg-red-600 text-white px-1.5 py-0.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-navy-900">{f.institute}</p>
              <p className="text-xs text-slate-500">{f.id} · {f.region}</p>
            </div>
          </Card>
        ))}
        {feeds.length === 0 && <p className="text-sm text-slate-400 col-span-full">No {mode.toLowerCase()} feeds available.</p>}
      </div>
    </div>
  );
}

function VcScreen() {
  const [state, setState] = useState("idle"); // idle | connecting | active
  const [target, setTarget] = useState("");

  function start(who) {
    setTarget(who);
    setState("connecting");
    setTimeout(() => setState("active"), 1800);
  }

  return (
    <Card className="max-w-lg">
      <CardHeader title="Random VC Call" subtitle="Verify presence via unannounced video call" />
      <div className="p-5">
        {state === "idle" && (
          <div className="grid gap-2.5">
            {["Project Incharge", "Staff", "Beneficiary"].map((who) => (
              <Button key={who} variant="secondary" onClick={() => start(who)}>
                <span className="flex items-center gap-2"><PhoneCall size={15} /> Call {who}</span>
              </Button>
            ))}
          </div>
        )}
        {state === "connecting" && (
          <div className="flex flex-col items-center py-10 gap-3">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.1 }}
              className="w-16 h-16 rounded-full bg-navy-800 flex items-center justify-center text-white"
            >
              <PhoneCall size={24} />
            </motion.div>
            <p className="text-sm text-slate-500">Connecting to {target}...</p>
          </div>
        )}
        {state === "active" && (
          <div>
            <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center text-white/30 mb-4">
              Video Tile — {target}
            </div>
            <div className="flex justify-center">
              <button onClick={() => setState("idle")} className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3">
                <PhoneOff size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
