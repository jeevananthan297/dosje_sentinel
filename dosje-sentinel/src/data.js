// Mock/dummy data — no backend, no real APIs

export const CREDENTIALS = {
  "admin@dosje.gov.in": { password: "admin123", role: "admin", name: "R. Venkatesan", title: "State Admin" },
  "inspector@dosje.gov.in": { password: "inspector123", role: "inspector", name: "K. Meena", title: "Ground Inspector" },
  "institute@dosje.gov.in": { password: "institute123", role: "institute", name: "S. Iyappan", title: "Institute Representative" },
};

export const INSTITUTES = [
  { id: "INS-101", name: "Govt ITI, Madurai", region: "Madurai", riskScore: 78, lastInspection: "2026-06-12", status: "Flagged" },
  { id: "INS-102", name: "Model Skill Centre, Trichy", region: "Trichy", riskScore: 34, lastInspection: "2026-07-02", status: "Passed" },
  { id: "INS-103", name: "Women Welfare Hostel, Salem", region: "Salem", riskScore: 61, lastInspection: "2026-05-28", status: "Pending Corrective Action" },
  { id: "INS-104", name: "SC/ST Hostel, Coimbatore", region: "Coimbatore", riskScore: 22, lastInspection: "2026-08-01", status: "Passed" },
  { id: "INS-105", name: "Vocational Training Centre, Madurai", region: "Madurai", riskScore: 88, lastInspection: "2026-04-15", status: "Flagged" },
  { id: "INS-106", name: "Backward Classes Hostel, Dindigul", region: "Dindigul", riskScore: 45, lastInspection: "2026-07-20", status: "Passed" },
  { id: "INS-107", name: "Tailoring Training Institute, Theni", region: "Theni", riskScore: 55, lastInspection: "2026-06-30", status: "Pending Corrective Action" },
  { id: "INS-108", name: "Govt ITI, Sivaganga", region: "Sivaganga", riskScore: 15, lastInspection: "2026-08-10", status: "Passed" },
];

export const RISK_BREAKDOWN = (institute) => {
  // Deterministic-ish pseudo values seeded from risk score, purely for display
  const base = institute.riskScore;
  return [
    { label: "Attendance Anomalies", weight: 35, value: Math.min(100, Math.round(base * 0.9)) },
    { label: "Complaint History", weight: 25, value: Math.min(100, Math.round(base * 0.6)) },
    { label: "Past Inspection Failures", weight: 25, value: Math.min(100, Math.round(base * 0.75)) },
    { label: "Bill Irregularities", weight: 15, value: Math.min(100, Math.round(base * 0.4)) },
  ];
};

export function riskColor(score) {
  if (score >= 70) return { text: "text-red-600", bg: "bg-red-50", ring: "ring-red-200", bar: "bg-red-500", badge: "bg-red-100 text-red-700" };
  if (score >= 40) return { text: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-200", bar: "bg-amber-500", badge: "bg-amber-100 text-amber-700" };
  return { text: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-200", bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700" };
}

export const TRAINEES = [
  { id: "TR-001", name: "Arun Kumar", role: "Trainee", joined: "2025-01-10", status: "Active" },
  { id: "TR-002", name: "Divya S", role: "Trainee", joined: "2025-02-14", status: "Active" },
  { id: "TR-003", name: "Karthik R", role: "Employee", joined: "2024-11-03", status: "Active" },
  { id: "TR-004", name: "Meena V", role: "Trainee", joined: "2025-03-22", status: "On Leave" },
  { id: "TR-005", name: "Suresh Babu", role: "Trainee", joined: "2025-01-30", status: "Active" },
  { id: "TR-006", name: "Priya Dharshini", role: "Employee", joined: "2024-09-18", status: "Active" },
  { id: "TR-007", name: "Mohammed Ali", role: "Trainee", joined: "2025-04-05", status: "Active" },
];

export const INBOX = [
  { id: 1, from: "Admin Office", subject: "Reminder: Submit Q3 Bills by 15th", date: "2026-08-28", body: "Please ensure all commodity bills for Q3 are uploaded to the portal before the 15th to avoid delay in fund release." },
  { id: 2, from: "Admin Office", subject: "Corrective Action Required — Attendance Mismatch", date: "2026-08-20", body: "The last inspection flagged a mismatch between physical and submitted attendance records for July. Please respond with clarification within 5 working days." },
  { id: 3, from: "Admin Office", subject: "Upcoming Surprise Inspection Window", date: "2026-08-10", body: "Institutes with a risk score above 60 may be selected for a surprise inspection between Aug 15–30. Ensure all documentation is in order." },
  { id: 4, from: "Admin Office", subject: "New Reporting Format", date: "2026-07-30", body: "A revised monthly report format is now in effect. Please use the updated template for all future submissions." },
];

export const REPORTS_HISTORY = [
  { id: "RPT-501", date: "2026-08-01", notes: "Monthly progress report for July", file: "july_report.pdf" },
  { id: "RPT-500", date: "2026-07-01", notes: "Monthly progress report for June", file: "june_report.pdf" },
  { id: "RPT-499", date: "2026-06-02", notes: "Monthly progress report for May", file: "may_report.pdf" },
];

export const BILLS_HISTORY = [
  { id: "BIL-901", date: "2026-08-05", commodity: "Rice (50kg bags)", amount: 18500, file: "rice_bill_aug.pdf" },
  { id: "BIL-900", date: "2026-07-04", commodity: "Sewing Machine Parts", amount: 9200, file: "parts_bill_jul.pdf" },
  { id: "BIL-899", date: "2026-06-10", commodity: "Stationery", amount: 3400, file: "stationery_jun.pdf" },
];

export const CHECKLIST_TEMPLATE = [
  { id: "c1", label: "Attendance register matches physical headcount" },
  { id: "c2", label: "Hostel/kitchen hygiene standards met" },
  { id: "c3", label: "Bills and receipts match declared expenditure" },
  { id: "c4", label: "CCTV cameras functional and footage retrievable" },
  { id: "c5", label: "Grievance register reviewed, no unresolved complaints" },
  { id: "c6", label: "Staff attendance and duty roster verified" },
];

export const PREVIOUS_INSPECTIONS = [
  { id: "INSP-77", institute: "Govt ITI, Madurai", date: "2026-06-12", status: "Flagged" },
  { id: "INSP-76", institute: "SC/ST Hostel, Coimbatore", date: "2026-05-30", status: "Passed" },
  { id: "INSP-75", institute: "Backward Classes Hostel, Dindigul", date: "2026-05-14", status: "Pending Corrective Action" },
  { id: "INSP-74", institute: "Model Skill Centre, Trichy", date: "2026-04-22", status: "Passed" },
];

export const CCTV_FEEDS = [
  { id: "CAM-1", institute: "Govt ITI, Madurai", region: "Madurai", type: "Live" },
  { id: "CAM-2", institute: "Vocational Training Centre, Madurai", region: "Madurai", type: "Recorded" },
  { id: "CAM-3", institute: "Govt ITI, Madurai", region: "Madurai", type: "Live" },
  { id: "CAM-4", institute: "Vocational Training Centre, Madurai", region: "Madurai", type: "Recorded" },
];

export const CCTV_FEEDS_ALL = [
  ...CCTV_FEEDS,
  { id: "CAM-5", institute: "Model Skill Centre, Trichy", region: "Trichy", type: "Live" },
  { id: "CAM-6", institute: "Women Welfare Hostel, Salem", region: "Salem", type: "Recorded" },
  { id: "CAM-7", institute: "SC/ST Hostel, Coimbatore", region: "Coimbatore", type: "Live" },
  { id: "CAM-8", institute: "Backward Classes Hostel, Dindigul", region: "Dindigul", type: "Recorded" },
];

export const CORRECTIVE_MEASURES = [
  { institute: "Govt ITI, Madurai", violation: "Attendance mismatch", status: "In Progress", reinspection: "Yes" },
  { institute: "Women Welfare Hostel, Salem", violation: "Incomplete grievance log", status: "Pending", reinspection: "Yes" },
  { institute: "Tailoring Training Institute, Theni", violation: "Bill discrepancy", status: "Completed", reinspection: "No" },
  { institute: "Vocational Training Centre, Madurai", violation: "CCTV non-functional (2 units)", status: "In Progress", reinspection: "Yes" },
];

export const KANBAN = {
  Assigned: [
    { id: "K1", institute: "Women Welfare Hostel, Salem", inspector: "K. Meena" },
    { id: "K2", institute: "Tailoring Training Institute, Theni", inspector: "P. Rajan" },
  ],
  "In Progress": [
    { id: "K3", institute: "Govt ITI, Madurai", inspector: "K. Meena" },
  ],
  Submitted: [
    { id: "K4", institute: "Backward Classes Hostel, Dindigul", inspector: "S. Lakshmi" },
  ],
  "Under Review": [
    { id: "K5", institute: "Model Skill Centre, Trichy", inspector: "P. Rajan" },
  ],
};

export const ALERTS = [
  { id: 1, text: "Vocational Training Centre, Madurai risk score crossed 85", severity: "red" },
  { id: 2, text: "Corrective action overdue: Women Welfare Hostel, Salem", severity: "orange" },
  { id: 3, text: "Re-inspection pending: Govt ITI, Madurai", severity: "orange" },
  { id: 4, text: "Tailoring Training Institute, Theni flagged for bill review", severity: "yellow" },
];

export const INSPECTORS = ["K. Meena", "P. Rajan", "S. Lakshmi", "N. Bhavani"];

export const ARCHIVE = [
  { id: "ARC-1", institute: "Govt ITI, Madurai", date: "2026-06-12", result: "Flagged", notes: "2 attendance discrepancies found, CCTV footage requested for cross-verification.", evidence: 4 },
  { id: "ARC-2", institute: "SC/ST Hostel, Coimbatore", date: "2026-05-30", result: "Passed", notes: "All checklist items satisfactory. No corrective action required.", evidence: 6 },
  { id: "ARC-3", institute: "Backward Classes Hostel, Dindigul", date: "2026-05-14", result: "Pending Corrective Action", notes: "Kitchen hygiene below standard, re-inspection scheduled.", evidence: 5 },
];
