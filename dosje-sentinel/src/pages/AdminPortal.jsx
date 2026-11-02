import { useState } from "react";
import { motion } from "framer-motion";
import {
  Gauge, BarChart3, Video, Kanban, Wrench, Send, FileStack,
  Archive as ArchiveIcon, ArrowUpDown, ChevronRight, X, Search, Sparkles,
} from "lucide-react";
import Shell from "../components/Shell";
import { Card, CardHeader, StatusBadge, Table, Button } from "../components/ui";
import {
  INSTITUTES, riskColor, RISK_BREAKDOWN, CCTV_FEEDS_ALL, KANBAN, CORRECTIVE_MEASURES,
  INSPECTORS, ARCHIVE, REPORTS_HISTORY, BILLS_HISTORY, TRAINEES,
} from "../data";

const NAV = [
  { id: "risk-overview", label: "Risk Overview", icon: Gauge },
  { id: "analytics", label: "Risk Analytics", icon: BarChart3 },
  { id: "cctv", label: "CCTV Records", icon: Video },
  { id: "inspections", label: "Ongoing Inspections", icon: Kanban },
  { id: "corrective", label: "Corrective Measures", icon: Wrench },
  { id: "compose", label: "Mail Composer", icon: Send },
  { id: "summary", label: "Submissions Summary", icon: FileStack },
  { id: "archive", label: "Inspection Archive", icon: ArchiveIcon },
];

export default function AdminPortal({ user, onLogout }) {
  const [active, setActive] = useState("risk-overview");
  const [selectedInstitute, setSelectedInstitute] = useState(INSTITUTES[0]);

  return (
    <Shell user={user} nav={NAV} active={active} onNavigate={setActive} onLogout={onLogout}>
      {active === "risk-overview" && (
        <RiskOverview onSelect={(inst) => { setSelectedInstitute(inst); setActive("analytics"); }} />
      )}
      {active === "analytics" && <RiskAnalytics institute={selectedInstitute} onChangeInstitute={setSelectedInstitute} />}
      {active === "cctv" && <CctvRecords />}
      {active === "inspections" && <InspectionsBoard />}
      {active === "corrective" && <CorrectiveMeasures />}
      {active === "compose" && <MailComposer />}
      {active === "summary" && <SubmissionsSummary />}
      {active === "archive" && <InspectionArchive />}
    </Shell>
  );
}

function RiskOverview({ onSelect }) {
  const [sortDesc, setSortDesc] = useState(true);
  const [runOpen, setRunOpen] = useState(false);
  const sorted = [...INSTITUTES].sort((a, b) => (sortDesc ? b.riskScore - a.riskScore : a.riskScore - b.riskScore));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{INSTITUTES.length} institutes tracked</p>
        <Button onClick={() => setRunOpen(true)}>
          <span className="flex items-center gap-1.5"><Sparkles size={15} /> Run Surprise Inspection Selection</span>
        </Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="px-5 py-2.5 font-medium">Institute</th>
                <th className="px-5 py-2.5 font-medium">Region</th>
                <th className="px-5 py-2.5 font-medium">
                  <button onClick={() => setSortDesc((v) => !v)} className="flex items-center gap-1 hover:text-navy-800">
                    Risk Score <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="px-5 py-2.5 font-medium">Last Inspection</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((inst) => {
                const c = riskColor(inst.riskScore);
                return (
                  <tr key={inst.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => onSelect(inst)}>
                    <td className="px-5 py-3 font-medium text-navy-900">{inst.name}</td>
                    <td className="px-5 py-3 text-slate-600">{inst.region}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center justify-center w-10 h-7 rounded-md text-xs font-semibold ${c.badge}`}>{inst.riskScore}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{inst.lastInspection}</td>
                    <td className="px-5 py-3"><StatusBadge status={inst.status} /></td>
                    <td className="px-5 py-3 text-slate-300"><ChevronRight size={16} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      {runOpen && <SurpriseSelectionModal onClose={() => setRunOpen(false)} />}
    </div>
  );
}

function SurpriseSelectionModal({ onClose }) {
  const [phase, setPhase] = useState("shuffling"); // shuffling | done
  const N = 3;
  const top = [...INSTITUTES].sort((a, b) => b.riskScore - a.riskScore).slice(0, N);
  const [assignments, setAssignments] = useState([]);

  useState(() => {
    const result = top.map((inst, i) => ({ institute: inst, inspector: INSPECTORS[i % INSPECTORS.length] }));
    const t = setTimeout(() => { setAssignments(result); setPhase("done"); }, 1600);
    return () => clearTimeout(t);
  });

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader
          title="Surprise Inspection Selection"
          subtitle={`Top ${N} institutes by risk score, auto-assigned`}
          action={<button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>}
        />
        <div className="p-5">
          {phase === "shuffling" ? (
            <div className="py-10 flex flex-col items-center gap-3">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                    className="w-3 h-3 rounded-full bg-navy-800"
                  />
                ))}
              </div>
              <p className="text-sm text-slate-500">Selecting institutes and assigning inspectors...</p>
            </div>
          ) : (
            <motion.table initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="py-2 font-medium">Institute</th>
                  <th className="py-2 font-medium">Risk Score</th>
                  <th className="py-2 font-medium">Assigned Inspector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((a, i) => (
                  <motion.tr key={a.institute.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                    <td className="py-2.5 font-medium text-navy-900">{a.institute.name}</td>
                    <td className="py-2.5">{a.institute.riskScore}</td>
                    <td className="py-2.5 text-slate-600">{a.inspector}</td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          )}
        </div>
        {phase === "done" && (
          <div className="px-5 pb-5">
            <Button onClick={onClose} className="w-full">Done</Button>
          </div>
        )}
      </Card>
    </div>
  );
}

function RiskAnalytics({ institute, onChangeInstitute }) {
  const breakdown = RISK_BREAKDOWN(institute);
  const c = riskColor(institute.riskScore);
  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-5">
      <Card className="h-fit">
        <CardHeader title="Institutes" />
        <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-100">
          {INSTITUTES.map((inst) => (
            <button
              key={inst.id}
              onClick={() => onChangeInstitute(inst)}
              className={`w-full text-left px-4 py-2.5 text-sm ${institute.id === inst.id ? "bg-slate-50 font-medium text-navy-900" : "text-slate-600 hover:bg-slate-50"}`}
            >
              {inst.name}
            </button>
          ))}
        </div>
      </Card>
      <Card>
        <CardHeader title={institute.name} subtitle={`${institute.region} · Risk Score: ${institute.riskScore}/100`} />
        <div className="p-5 space-y-5">
          <div className={`inline-block px-3 py-1.5 rounded-lg text-sm font-semibold ${c.badge}`}>
            {institute.riskScore >= 70 ? "High Risk" : institute.riskScore >= 40 ? "Moderate Risk" : "Low Risk"}
          </div>
          {breakdown.map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-700">{f.label}</span>
                <span className="text-slate-500">weight {f.weight}% · value {f.value}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${f.value}%` }}
                  transition={{ duration: 0.6 }}
                  className={`h-full rounded-full ${c.bar}`}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CctvRecords() {
  const [region, setRegion] = useState("All");
  const [type, setType] = useState("All");
  const [query, setQuery] = useState("");
  const regions = ["All", ...new Set(CCTV_FEEDS_ALL.map((f) => f.region))];

  const filtered = CCTV_FEEDS_ALL.filter((f) =>
    (region === "All" || f.region === region) &&
    (type === "All" || f.type === type) &&
    (query === "" || f.institute.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2.5">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search institute..." className="pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy-700/30" />
        </div>
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="text-sm rounded-lg border border-slate-200 px-3 py-2">
          {regions.map((r) => <option key={r}>{r}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="text-sm rounded-lg border border-slate-200 px-3 py-2">
          {["All", "Live", "Recorded"].map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((f) => (
          <Card key={f.id} className="overflow-hidden">
            <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
              <Video size={26} className="text-white/20" />
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
        {filtered.length === 0 && <p className="text-sm text-slate-400 col-span-full">No feeds match your filters.</p>}
      </div>
    </div>
  );
}

function InspectionsBoard() {
  const cols = Object.keys(KANBAN);
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cols.map((col) => (
        <div key={col}>
          <p className="text-xs font-semibold text-slate-500 mb-2 px-1">{col} <span className="text-slate-400">({KANBAN[col].length})</span></p>
          <div className="space-y-2.5">
            {KANBAN[col].map((item) => (
              <Card key={item.id} className="p-3.5">
                <p className="text-sm font-medium text-navy-900">{item.institute}</p>
                <p className="text-xs text-slate-500 mt-1">Inspector: {item.inspector}</p>
              </Card>
            ))}
            {KANBAN[col].length === 0 && <p className="text-xs text-slate-300 px-1">No items</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function CorrectiveMeasures() {
  return (
    <Card>
      <CardHeader title="Corrective Measures & Re-Inspection Status" />
      <Table
        columns={["Institute", "Violation Found", "Corrective Status", "Re-inspection Scheduled"]}
        rows={CORRECTIVE_MEASURES}
        renderRow={(r, i) => (
          <tr key={i}>
            <td className="px-5 py-3 font-medium text-navy-900">{r.institute}</td>
            <td className="px-5 py-3 text-slate-600">{r.violation}</td>
            <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
            <td className="px-5 py-3 text-slate-600">{r.reinspection}</td>
          </tr>
        )}
      />
    </Card>
  );
}

function MailComposer() {
  const recipients = [...INSTITUTES.map((i) => i.name), ...INSPECTORS];
  const [to, setTo] = useState(recipients[0]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState([]);

  function send(e) {
    e.preventDefault();
    if (!subject || !body) return;
    setSent([{ to, subject, body, date: new Date().toISOString().slice(0, 10) }, ...sent]);
    setSubject("");
    setBody("");
  }

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card>
        <CardHeader title="Compose Mail" />
        <form onSubmit={send} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">To</label>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2">
              {recipients.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-700/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-700/30" />
          </div>
          <Button type="submit">Send</Button>
        </form>
      </Card>
      <Card>
        <CardHeader title="Sent" subtitle={`${sent.length} messages`} />
        <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
          {sent.length === 0 && <p className="text-sm text-slate-400 px-5 py-4">No mails sent yet.</p>}
          {sent.map((m, i) => (
            <div key={i} className="px-5 py-3">
              <div className="flex justify-between text-xs text-slate-400">
                <span>To: {m.to}</span><span>{m.date}</span>
              </div>
              <p className="text-sm font-medium text-navy-900 mt-0.5">{m.subject}</p>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{m.body}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SubmissionsSummary() {
  const [tab, setTab] = useState("attendance");
  const [query, setQuery] = useState("");
  const tabs = [
    { id: "attendance", label: "Attendance" },
    { id: "bills", label: "Bills" },
    { id: "reports", label: "Reports" },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between px-5 pt-4 flex-wrap gap-3">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`text-xs font-medium px-3 py-1.5 rounded-md ${tab === t.id ? "bg-white shadow-sm text-navy-900" : "text-slate-500"}`}>{t.label}</button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-200" />
        </div>
      </div>
      <div className="mt-3">
        {tab === "attendance" && (
          <Table
            columns={["Name", "Role", "Status"]}
            rows={TRAINEES.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))}
            renderRow={(t) => (
              <tr key={t.id}><td className="px-5 py-3 font-medium text-navy-900">{t.name}</td><td className="px-5 py-3 text-slate-600">{t.role}</td><td className="px-5 py-3"><StatusBadge status={t.status} /></td></tr>
            )}
          />
        )}
        {tab === "bills" && (
          <Table
            columns={["ID", "Date", "Commodity", "Amount"]}
            rows={BILLS_HISTORY.filter((b) => b.commodity.toLowerCase().includes(query.toLowerCase()))}
            renderRow={(b) => (
              <tr key={b.id}><td className="px-5 py-3 font-medium text-navy-900">{b.id}</td><td className="px-5 py-3 text-slate-600">{b.date}</td><td className="px-5 py-3 text-slate-600">{b.commodity}</td><td className="px-5 py-3 text-slate-600">₹{b.amount.toLocaleString("en-IN")}</td></tr>
            )}
          />
        )}
        {tab === "reports" && (
          <Table
            columns={["ID", "Date", "Notes"]}
            rows={REPORTS_HISTORY.filter((r) => r.notes.toLowerCase().includes(query.toLowerCase()))}
            renderRow={(r) => (
              <tr key={r.id}><td className="px-5 py-3 font-medium text-navy-900">{r.id}</td><td className="px-5 py-3 text-slate-600">{r.date}</td><td className="px-5 py-3 text-slate-600">{r.notes}</td></tr>
            )}
          />
        )}
      </div>
    </Card>
  );
}

function InspectionArchive() {
  const [openId, setOpenId] = useState(null);
  const selected = ARCHIVE.find((a) => a.id === openId);
  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-5">
      <Card>
        <CardHeader title="Completed Inspections Archive" />
        <div className="divide-y divide-slate-100">
          {ARCHIVE.map((a) => (
            <button key={a.id} onClick={() => setOpenId(a.id)} className="w-full text-left px-5 py-3.5 hover:bg-slate-50 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-navy-900">{a.institute}</p>
                <p className="text-xs text-slate-500">{a.date} · {a.evidence} evidence files</p>
              </div>
              <StatusBadge status={a.result} />
            </button>
          ))}
        </div>
      </Card>
      <Card className="h-fit">
        <CardHeader title="Details" />
        <div className="p-5">
          {selected ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-navy-900">{selected.institute}</p>
              <p className="text-xs text-slate-500">{selected.date}</p>
              <StatusBadge status={selected.result} />
              <p className="text-sm text-slate-600 leading-relaxed">{selected.notes}</p>
              <div className="grid grid-cols-3 gap-2 pt-2">
                {Array.from({ length: selected.evidence }).map((_, i) => (
                  <div key={i} className="aspect-square bg-slate-100 rounded-md flex items-center justify-center text-slate-300 text-[10px]">IMG {i + 1}</div>
                ))}
              </div>
            </div>
          ) : <p className="text-sm text-slate-400">Select an inspection to view evidence and notes.</p>}
        </div>
      </Card>
    </div>
  );
}
