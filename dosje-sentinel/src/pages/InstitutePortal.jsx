import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList, FileText, Receipt, Mail, Users, Gauge,
  Upload, CheckCircle2, ChevronRight, X, Paperclip,
} from "lucide-react";
import Shell from "../components/Shell";
import { Card, CardHeader, StatusBadge, Table, Button } from "../components/ui";
import {
  TRAINEES, INBOX, REPORTS_HISTORY, BILLS_HISTORY, INSTITUTES, riskColor, RISK_BREAKDOWN,
} from "../data";

const NAV = [
  { id: "attendance", label: "Attendance", icon: ClipboardList },
  { id: "reports", label: "Report Submission", icon: FileText },
  { id: "bills", label: "Bill Upload", icon: Receipt },
  { id: "mails", label: "Mails", icon: Mail },
  { id: "trainees", label: "Trainee Details", icon: Users },
  { id: "risk", label: "Risk Score", icon: Gauge },
];

const MY_INSTITUTE = INSTITUTES[0]; // Govt ITI, Madurai — this rep's institute

export default function InstitutePortal({ user, onLogout }) {
  const [active, setActive] = useState("attendance");

  return (
    <Shell user={user} nav={NAV} active={active} onNavigate={setActive} onLogout={onLogout}>
      {active === "attendance" && <AttendanceScreen />}
      {active === "reports" && <ReportsScreen />}
      {active === "bills" && <BillsScreen />}
      {active === "mails" && <MailsScreen />}
      {active === "trainees" && <TraineesScreen />}
      {active === "risk" && <RiskScreen onViewBreakdown={() => setActive("risk-detail")} />}
      {active === "risk-detail" && <RiskDetail onBack={() => setActive("risk")} />}
    </Shell>
  );
}

function AttendanceScreen() {
  const [status, setStatus] = useState(() => Object.fromEntries(TRAINEES.map((t) => [t.id, true])));
  const [submitted, setSubmitted] = useState(false);

  return (
    <Card>
      <CardHeader title="Daily Attendance" subtitle={`Mark attendance for ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`} />
      <div className="divide-y divide-slate-100">
        {TRAINEES.map((t) => (
          <div key={t.id} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="text-sm font-medium text-navy-900">{t.name}</p>
              <p className="text-xs text-slate-500">{t.id} · {t.role}</p>
            </div>
            <button
              onClick={() => setStatus((s) => ({ ...s, [t.id]: !s[t.id] }))}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                status[t.id] ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
              }`}
            >
              {status[t.id] ? "Present" : "Absent"}
            </button>
          </div>
        ))}
      </div>
      <div className="px-5 py-4 border-t border-slate-100 flex items-center gap-3">
        <Button onClick={() => setSubmitted(true)}>Submit Attendance</Button>
        {submitted && <span className="text-sm text-emerald-600 flex items-center gap-1"><CheckCircle2 size={15} /> Submitted for today</span>}
      </div>
    </Card>
  );
}

function ReportsScreen() {
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState("");
  const [history, setHistory] = useState(REPORTS_HISTORY);

  function handleSubmit(e) {
    e.preventDefault();
    if (!notes) return;
    setHistory([{ id: `RPT-${500 + history.length + 2}`, date: new Date().toISOString().slice(0, 10), notes, file: fileName || "report.pdf" }, ...history]);
    setNotes("");
    setFileName("");
  }

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card>
        <CardHeader title="Submit New Report" />
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <FileDrop fileName={fileName} setFileName={setFileName} />
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Describe this report..."
              className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-700/30"
            />
          </div>
          <Button type="submit">Submit Report</Button>
        </form>
      </Card>
      <Card>
        <CardHeader title="Submission History" />
        <Table
          columns={["ID", "Date", "Notes", "File"]}
          rows={history}
          renderRow={(r) => (
            <tr key={r.id}>
              <td className="px-5 py-3 font-medium text-navy-900">{r.id}</td>
              <td className="px-5 py-3 text-slate-600">{r.date}</td>
              <td className="px-5 py-3 text-slate-600 max-w-[220px] truncate">{r.notes}</td>
              <td className="px-5 py-3 text-slate-500 flex items-center gap-1"><Paperclip size={13} />{r.file}</td>
            </tr>
          )}
        />
      </Card>
    </div>
  );
}

function BillsScreen() {
  const [form, setForm] = useState({ amount: "", commodity: "", date: "", fileName: "" });
  const [history, setHistory] = useState(BILLS_HISTORY);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.amount || !form.commodity || !form.date) return;
    setHistory([{ id: `BIL-${900 + history.length + 2}`, date: form.date, commodity: form.commodity, amount: Number(form.amount), file: form.fileName || "bill.pdf" }, ...history]);
    setForm({ amount: "", commodity: "", date: "", fileName: "" });
  }

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card>
        <CardHeader title="Upload Bill" />
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <FileDrop fileName={form.fileName} setFileName={(f) => setForm((s) => ({ ...s, fileName: f }))} label="bill/receipt" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Commodity</label>
              <input value={form.commodity} onChange={(e) => setForm((s) => ({ ...s, commodity: e.target.value }))} className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-700/30" placeholder="e.g. Rice (50kg bags)" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Amount (₹)</label>
              <input type="number" value={form.amount} onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))} className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-700/30" placeholder="0" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))} className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-700/30" />
          </div>
          <Button type="submit">Upload Bill</Button>
        </form>
      </Card>
      <Card>
        <CardHeader title="Past Uploads" />
        <Table
          columns={["ID", "Date", "Commodity", "Amount", "File"]}
          rows={history}
          renderRow={(b) => (
            <tr key={b.id}>
              <td className="px-5 py-3 font-medium text-navy-900">{b.id}</td>
              <td className="px-5 py-3 text-slate-600">{b.date}</td>
              <td className="px-5 py-3 text-slate-600">{b.commodity}</td>
              <td className="px-5 py-3 text-slate-600">₹{b.amount.toLocaleString("en-IN")}</td>
              <td className="px-5 py-3 text-slate-500 flex items-center gap-1"><Paperclip size={13} />{b.file}</td>
            </tr>
          )}
        />
      </Card>
    </div>
  );
}

function FileDrop({ fileName, setFileName, label = "file" }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-600 mb-1 block">Upload {label}</label>
      <label className="flex items-center gap-2 border border-dashed border-slate-300 rounded-lg px-3 py-3 text-sm text-slate-500 cursor-pointer hover:bg-slate-50">
        <Upload size={16} />
        {fileName || `Click to attach a ${label} (mock)`}
        <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
      </label>
    </div>
  );
}

function MailsScreen() {
  const [openId, setOpenId] = useState(INBOX[0]?.id ?? null);
  const selected = INBOX.find((m) => m.id === openId);
  return (
    <Card className="grid md:grid-cols-[320px_1fr] overflow-hidden min-h-[420px]">
      <div className="border-r border-slate-100 divide-y divide-slate-100 overflow-y-auto">
        {INBOX.map((m) => (
          <button
            key={m.id}
            onClick={() => setOpenId(m.id)}
            className={`w-full text-left px-4 py-3 ${openId === m.id ? "bg-slate-50" : "hover:bg-slate-50"}`}
          >
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
        ) : (
          <p className="text-sm text-slate-400">Select a mail to read</p>
        )}
      </div>
    </Card>
  );
}

function TraineesScreen() {
  return (
    <Card>
      <CardHeader title="Trainee / Employee Details" subtitle={`${TRAINEES.length} records`} />
      <Table
        columns={["Name", "Role", "ID", "Joined", "Status"]}
        rows={TRAINEES}
        renderRow={(t) => (
          <tr key={t.id}>
            <td className="px-5 py-3 font-medium text-navy-900">{t.name}</td>
            <td className="px-5 py-3 text-slate-600">{t.role}</td>
            <td className="px-5 py-3 text-slate-600">{t.id}</td>
            <td className="px-5 py-3 text-slate-600">{t.joined}</td>
            <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
          </tr>
        )}
      />
    </Card>
  );
}

function RiskScreen({ onViewBreakdown }) {
  const c = riskColor(MY_INSTITUTE.riskScore);
  return (
    <div className="max-w-md">
      <Card className={`p-6 ${c.bg} ring-1 ${c.ring}`}>
        <p className="text-sm font-medium text-slate-600 mb-1">Current Risk Score</p>
        <p className="text-xs text-slate-500 mb-4">{MY_INSTITUTE.name}</p>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-6xl font-bold ${c.text}`}
        >
          {MY_INSTITUTE.riskScore}
        </motion.p>
        <p className={`text-xs font-medium mt-1 ${c.text}`}>
          {MY_INSTITUTE.riskScore >= 70 ? "High Risk" : MY_INSTITUTE.riskScore >= 40 ? "Moderate Risk" : "Low Risk"}
        </p>
        <button onClick={onViewBreakdown} className="mt-5 text-sm font-medium text-navy-800 flex items-center gap-1 hover:gap-1.5 transition-all">
          View Breakdown <ChevronRight size={15} />
        </button>
      </Card>
    </div>
  );
}

function RiskDetail({ onBack }) {
  const breakdown = RISK_BREAKDOWN(MY_INSTITUTE);
  return (
    <Card>
      <CardHeader
        title="Risk Score Breakdown (Read-only)"
        subtitle={MY_INSTITUTE.name}
        action={<button onClick={onBack} className="text-xs text-slate-400 hover:text-slate-600"><X size={16} /></button>}
      />
      <div className="p-5 space-y-4">
        {breakdown.map((f) => (
          <div key={f.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-700">{f.label} <span className="text-slate-400">({f.weight}% weight)</span></span>
              <span className="font-medium text-navy-900">{f.value}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${f.value}%` }}
                transition={{ duration: 0.6 }}
                className="h-full bg-navy-700 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
