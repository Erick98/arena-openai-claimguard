"use client";

import { useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  DollarSign,
  FileText,
  Lock,
  LogOut,
  Plus,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  TimerReset,
  TrendingUp,
  Users,
} from "lucide-react";

type Role = "practice" | "admin";
type CaseStatus = "at_risk" | "appeal_ready" | "submitted" | "recovered";

type ClaimCase = {
  id: string;
  patient: string;
  payer: string;
  service: string;
  amount: number;
  cpt: string;
  missing: string;
  deadline: string;
  status: CaseStatus;
  risk: number;
  owner: string;
  createdAt: string;
};

type Session = {
  email: string;
  role: Role;
};

const demoAccounts = [
  { email: "practice@claimguard.demo", password: "DemoPass!2026", role: "practice" as Role },
  { email: "admin@claimguard.demo", password: "AdminPass!2026", role: "admin" as Role },
];

const seedCases: ClaimCase[] = [
  {
    id: "CG-1007",
    patient: "Marisol Vega",
    payer: "UnitedHealthcare MA",
    service: "Cardiac CT prior auth",
    amount: 18400,
    cpt: "75574",
    missing: "recent ECG, failed stress test note",
    deadline: "2026-07-08",
    status: "at_risk",
    risk: 91,
    owner: "Dr. Patel",
    createdAt: "2026-07-01",
  },
  {
    id: "CG-1008",
    patient: "Eli Moreno",
    payer: "Aetna Commercial",
    service: "MRI lumbar spine appeal",
    amount: 6200,
    cpt: "72148",
    missing: "six-week conservative therapy proof",
    deadline: "2026-07-10",
    status: "appeal_ready",
    risk: 73,
    owner: "R. Chen",
    createdAt: "2026-07-02",
  },
  {
    id: "CG-1009",
    patient: "Anika Shah",
    payer: "BCBS PPO",
    service: "Infusion continuation",
    amount: 12900,
    cpt: "96413",
    missing: "lab trend and dose rationale",
    deadline: "2026-07-12",
    status: "submitted",
    risk: 48,
    owner: "M. Ibarra",
    createdAt: "2026-07-03",
  },
  {
    id: "CG-1010",
    patient: "James Lee",
    payer: "Humana MA",
    service: "Home health recertification",
    amount: 3900,
    cpt: "G0179",
    missing: "face-to-face encounter attestation",
    deadline: "2026-07-06",
    status: "recovered",
    risk: 26,
    owner: "K. Owens",
    createdAt: "2026-06-28",
  },
];

const payerRules = [
  "UnitedHealthcare MA: attach failed conservative therapy and exact ordering-provider NPI.",
  "Aetna Commercial: include clinical guideline citation and dated symptom progression.",
  "Humana MA: face-to-face encounter must be signed before submission.",
  "BCBS PPO: lab trend, weight-based dose and previous response are required.",
];

const sourceHighlights = [
  "Premier reported $25.7B in provider claims-adjudication cost in 2023, up 23%.",
  "CMS prior authorization interoperability rules make API readiness and turnaround tracking mandatory.",
  "HFMA emphasizes standardized denial categories and trend data to reduce avoidable spend.",
  "Independent practices lack the enterprise RCM teams that large systems use to fight denials.",
];

function money(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function statusLabel(status: CaseStatus) {
  return {
    at_risk: "At risk",
    appeal_ready: "Appeal ready",
    submitted: "Submitted",
    recovered: "Recovered",
  }[status];
}

function scoreClaim(payer: string, amount: number, missing: string) {
  const payerRisk = /ma|medicare|united|humana/i.test(payer) ? 24 : /aetna|bcbs/i.test(payer) ? 16 : 10;
  const amountRisk = amount > 12000 ? 27 : amount > 6000 ? 18 : 9;
  const docRisk = missing.split(",").length * 11;
  return Math.min(96, payerRisk + amountRisk + docRisk + 18);
}

function useStoredCases() {
  const [cases, setCases] = useState<ClaimCase[]>(seedCases);

  useEffect(() => {
    const stored = window.localStorage.getItem("claimguard-cases");
    if (stored) {
      setCases(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("claimguard-cases", JSON.stringify(cases));
  }, [cases]);

  return [cases, setCases] as const;
}

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [login, setLogin] = useState({ email: "practice@claimguard.demo", password: "DemoPass!2026" });
  const [cases, setCases] = useStoredCases();
  const [newCase, setNewCase] = useState({
    patient: "",
    payer: "UnitedHealthcare MA",
    service: "Prior authorization",
    amount: 9800,
    cpt: "",
    missing: "clinical notes, payer form",
    owner: "",
    deadline: "2026-07-14",
  });

  const metrics = useMemo(() => {
    const atRisk = cases.filter((item) => item.status === "at_risk").length;
    const recovered = cases.filter((item) => item.status === "recovered").reduce((sum, item) => sum + item.amount, 0);
    const total = cases.reduce((sum, item) => sum + item.amount, 0);
    const averageRisk = Math.round(cases.reduce((sum, item) => sum + item.risk, 0) / cases.length);
    return { atRisk, recovered, total, averageRisk };
  }, [cases]);

  function signIn() {
    const found = demoAccounts.find((account) => account.email === login.email && account.password === login.password);
    if (found) {
      setSession({ email: found.email, role: found.role });
    } else {
      alert("Use one of the demo accounts listed below the form.");
    }
  }

  function addCase() {
    if (!newCase.patient || !newCase.cpt || !newCase.owner) {
      alert("Patient, CPT and owner are required.");
      return;
    }

    const risk = scoreClaim(newCase.payer, Number(newCase.amount), newCase.missing);
    const item: ClaimCase = {
      ...newCase,
      amount: Number(newCase.amount),
      risk,
      id: `CG-${Math.floor(1100 + Math.random() * 8000)}`,
      status: risk > 78 ? "at_risk" : "appeal_ready",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setCases([item, ...cases]);
    setNewCase({ ...newCase, patient: "", cpt: "", owner: "" });
  }

  function advanceCase(id: string) {
    const order: CaseStatus[] = ["at_risk", "appeal_ready", "submitted", "recovered"];
    setCases(
      cases.map((item) => {
        if (item.id !== id) return item;
        const next = order[Math.min(order.indexOf(item.status) + 1, order.length - 1)];
        return { ...item, status: next, risk: Math.max(12, item.risk - 22) };
      }),
    );
  }

  return (
    <main>
      {!session ? (
        <Landing login={login} setLogin={setLogin} signIn={signIn} />
      ) : (
        <AppShell session={session} setSession={setSession}>
          {session.role === "practice" ? (
            <PracticeDashboard
              cases={cases}
              metrics={metrics}
              newCase={newCase}
              setNewCase={setNewCase}
              addCase={addCase}
              advanceCase={advanceCase}
            />
          ) : (
            <AdminDashboard cases={cases} metrics={metrics} advanceCase={advanceCase} />
          )}
        </AppShell>
      )}
    </main>
  );
}

function Landing({
  login,
  setLogin,
  signIn,
}: {
  login: { email: string; password: string };
  setLogin: (login: { email: string; password: string }) => void;
  signIn: () => void;
}) {
  return (
    <>
      <section className="hero">
        <nav className="nav">
          <div className="brand">
            <ShieldCheck size={24} />
            ClaimGuard
          </div>
          <a href="#login" className="navLink">
            Demo login
          </a>
        </nav>
        <div className="heroGrid">
          <div className="heroCopy">
            <div className="eyebrow">
              <Sparkles size={16} /> Denial prevention for independent practices
            </div>
            <h1>Stop losing approved revenue to missing documentation.</h1>
            <p>
              ClaimGuard predicts payer-specific denial risk before submission, turns the missing evidence into a
              work queue, and generates appeal packets your billing team can send the same day.
            </p>
            <div className="heroActions">
              <a href="#login" className="primaryButton">
                Open live demo <ArrowRight size={18} />
              </a>
              <a href="#market" className="secondaryButton">
                Market thesis
              </a>
            </div>
            <div className="statsStrip">
              <span>$25.7B provider adjudication cost</span>
              <span>CMS prior auth tailwind</span>
              <span>Small-practice wedge</span>
            </div>
          </div>
          <div className="heroPanel">
            <div className="panelHeader">
              <span>Today&apos;s denial risk</span>
              <strong>14 claims scanned</strong>
            </div>
            {seedCases.slice(0, 3).map((item) => (
              <div className="riskRow" key={item.id}>
                <div>
                  <strong>{item.service}</strong>
                  <span>{item.payer}</span>
                </div>
                <b className={item.risk > 80 ? "danger" : "warning"}>{item.risk}%</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="market" id="market">
        <div>
          <h2>Why this business wins now</h2>
          <p>
            Payers are automating reviews faster than independent practices can staff appeals. The wedge is a narrow,
            urgent workflow: detect denial risk before a claim leaves the practice, assign the missing evidence, and
            preserve the appeal trail.
          </p>
        </div>
        <div className="marketGrid">
          {sourceHighlights.map((item) => (
            <div className="marketCard" key={item}>
              <CheckCircle2 size={20} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="loginBand" id="login">
        <div className="loginCard">
          <div>
            <h2>Live product demo</h2>
            <p>Use either credential set to enter the working dashboards.</p>
          </div>
          <label>
            Email
            <input value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} />
          </label>
          <label>
            Password
            <input
              type="password"
              value={login.password}
              onChange={(event) => setLogin({ ...login, password: event.target.value })}
            />
          </label>
          <button className="primaryButton full" onClick={signIn}>
            <Lock size={18} /> Sign in
          </button>
          <div className="credentials">
            <span>practice@claimguard.demo / DemoPass!2026</span>
            <span>admin@claimguard.demo / AdminPass!2026</span>
          </div>
        </div>
      </section>
    </>
  );
}

function AppShell({
  session,
  setSession,
  children,
}: {
  session: Session;
  setSession: (session: Session | null) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand appBrand">
          <ShieldCheck size={23} />
          ClaimGuard
        </div>
        <div className="sideItem active">
          <BarChart3 size={18} /> Dashboard
        </div>
        <div className="sideItem">
          <ClipboardCheck size={18} /> Work queue
        </div>
        <div className="sideItem">
          <FileText size={18} /> Appeal packets
        </div>
        <button className="logout" onClick={() => setSession(null)}>
          <LogOut size={18} /> Sign out
        </button>
      </aside>
      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow small">{session.role === "admin" ? "Business command center" : "Practice cockpit"}</span>
            <h1>{session.role === "admin" ? "Admin dashboard" : "Denial prevention queue"}</h1>
          </div>
          <div className="userPill">
            <Users size={16} />
            {session.email}
          </div>
        </header>
        {children}
      </section>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="metric">
      <div className="metricIcon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PracticeDashboard({
  cases,
  metrics,
  newCase,
  setNewCase,
  addCase,
  advanceCase,
}: {
  cases: ClaimCase[];
  metrics: { atRisk: number; recovered: number; total: number; averageRisk: number };
  newCase: {
    patient: string;
    payer: string;
    service: string;
    amount: number;
    cpt: string;
    missing: string;
    owner: string;
    deadline: string;
  };
  setNewCase: Dispatch<
    SetStateAction<{
      patient: string;
      payer: string;
      service: string;
      amount: number;
      cpt: string;
      missing: string;
      owner: string;
      deadline: string;
    }>
  >;
  addCase: () => void;
  advanceCase: (id: string) => void;
}) {
  return (
    <>
      <div className="metrics">
        <Metric icon={<AlertTriangle size={19} />} label="At-risk cases" value={`${metrics.atRisk}`} />
        <Metric icon={<DollarSign size={19} />} label="Revenue in queue" value={money(metrics.total)} />
        <Metric icon={<TrendingUp size={19} />} label="Recovered demo revenue" value={money(metrics.recovered)} />
        <Metric icon={<Activity size={19} />} label="Average denial risk" value={`${metrics.averageRisk}%`} />
      </div>

      <div className="dashboardGrid">
        <section className="toolPanel">
          <h2>
            <Plus size={20} /> Scan a claim
          </h2>
          <div className="formGrid">
            <input placeholder="Patient" value={newCase.patient} onChange={(event) => setNewCase({ ...newCase, patient: event.target.value })} />
            <input placeholder="CPT" value={newCase.cpt} onChange={(event) => setNewCase({ ...newCase, cpt: event.target.value })} />
            <input placeholder="Owner" value={newCase.owner} onChange={(event) => setNewCase({ ...newCase, owner: event.target.value })} />
            <input
              type="number"
              placeholder="Amount"
              value={newCase.amount}
              onChange={(event) => setNewCase({ ...newCase, amount: Number(event.target.value) })}
            />
            <select value={newCase.payer} onChange={(event) => setNewCase({ ...newCase, payer: event.target.value })}>
              <option>UnitedHealthcare MA</option>
              <option>Aetna Commercial</option>
              <option>Humana MA</option>
              <option>BCBS PPO</option>
            </select>
            <input
              type="date"
              value={newCase.deadline}
              onChange={(event) => setNewCase({ ...newCase, deadline: event.target.value })}
            />
            <input
              className="wide"
              placeholder="Missing documentation"
              value={newCase.missing}
              onChange={(event) => setNewCase({ ...newCase, missing: event.target.value })}
            />
            <input
              className="wide"
              placeholder="Service"
              value={newCase.service}
              onChange={(event) => setNewCase({ ...newCase, service: event.target.value })}
            />
          </div>
          <button className="primaryButton full" onClick={addCase}>
            <Sparkles size={18} /> Predict risk and create work item
          </button>
        </section>

        <section className="toolPanel">
          <h2>
            <Target size={20} /> Payer playbook
          </h2>
          <div className="rules">
            {payerRules.map((rule) => (
              <div key={rule}>
                <CheckCircle2 size={17} />
                {rule}
              </div>
            ))}
          </div>
        </section>
      </div>

      <CaseTable cases={cases} advanceCase={advanceCase} />
    </>
  );
}

function AdminDashboard({
  cases,
  metrics,
  advanceCase,
}: {
  cases: ClaimCase[];
  metrics: { atRisk: number; recovered: number; total: number; averageRisk: number };
  advanceCase: (id: string) => void;
}) {
  const byStatus = ["at_risk", "appeal_ready", "submitted", "recovered"].map((status) => ({
    status: status as CaseStatus,
    count: cases.filter((item) => item.status === status).length,
  }));

  return (
    <>
      <div className="metrics">
        <Metric icon={<Users size={19} />} label="Demo practices" value="18" />
        <Metric icon={<DollarSign size={19} />} label="ARR at pilot conversion" value="$486K" />
        <Metric icon={<TimerReset size={19} />} label="Median time saved" value="31 min/case" />
        <Metric icon={<TrendingUp size={19} />} label="Recovered in workspace" value={money(metrics.recovered)} />
      </div>
      <div className="adminGrid">
        <section className="toolPanel">
          <h2>
            <BarChart3 size={20} /> Funnel health
          </h2>
          <div className="bars">
            {byStatus.map((item) => (
              <div className="barRow" key={item.status}>
                <span>{statusLabel(item.status)}</span>
                <div>
                  <i style={{ width: `${Math.max(14, item.count * 24)}%` }} />
                </div>
                <b>{item.count}</b>
              </div>
            ))}
          </div>
        </section>
        <section className="toolPanel">
          <h2>
            <Stethoscope size={20} /> Business signals
          </h2>
          <div className="signalGrid">
            <span>Best wedge: cardiology, imaging, infusion clinics</span>
            <span>Buyer: practice administrator / RCM manager</span>
            <span>Pricing: $499 base + 0.9% recovered revenue</span>
            <span>North star: clean-claim lift and days-to-appeal</span>
          </div>
        </section>
      </div>
      <CaseTable cases={cases} advanceCase={advanceCase} />
    </>
  );
}

function CaseTable({ cases, advanceCase }: { cases: ClaimCase[]; advanceCase: (id: string) => void }) {
  return (
    <section className="tablePanel">
      <div className="panelTitle">
        <h2>Live work queue</h2>
        <span>{cases.length} cases</span>
      </div>
      <div className="caseList">
        {cases.map((item) => (
          <article className="caseCard" key={item.id}>
            <div>
              <strong>
                {item.id} · {item.patient}
              </strong>
              <span>{item.service}</span>
            </div>
            <div>
              <small>Payer</small>
              <span>{item.payer}</span>
            </div>
            <div>
              <small>Missing</small>
              <span>{item.missing}</span>
            </div>
            <div>
              <small>Amount</small>
              <span>{money(item.amount)}</span>
            </div>
            <div>
              <small>Risk</small>
              <span className={item.risk > 80 ? "danger" : item.risk > 55 ? "warning" : "good"}>{item.risk}%</span>
            </div>
            <div>
              <small>Status</small>
              <span>{statusLabel(item.status)}</span>
            </div>
            <button className="iconButton" onClick={() => advanceCase(item.id)} title="Advance case">
              <ArrowRight size={17} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
