"use client";

import { useEffect, useMemo, useState } from "react";
import { ApiError, apiGet, apiPatch, downloadLeadsCsv, Session } from "../lib/api";
import { LoginForm } from "./LoginForm";

type View = "dashboard" | "leads" | "projects" | "catalogue-products" | "news" | "capabilities";

const labels: Record<View, string> = {
  dashboard: "Dashboard",
  leads: "Lead liên hệ",
  projects: "Dự án",
  "catalogue-products": "Catalogue",
  news: "Tin tức",
  capabilities: "Năng lực"
};

export function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("hlg_admin_session");
    if (raw) setSession(JSON.parse(raw));
  }, []);

  useEffect(() => {
    if (!session) return;
    setError("");
    setData(null);
    const path = view === "dashboard" ? "/dashboard" : `/${view}`;
    apiGet(path, session.accessToken)
      .then(setData)
      .catch((error) => {
        if (error instanceof ApiError && error.status === 401) {
          localStorage.removeItem("hlg_admin_session");
          setSession(null);
          setError("");
          return;
        }
        setError("Không tải được dữ liệu.");
      });
  }, [session, view]);

  const nav = useMemo(() => Object.keys(labels) as View[], []);

  if (!session) return <LoginForm onLogin={setSession} />;

  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/assets/hoang-long-logo.svg" alt="Hoàng Long JSC" />
          <h1>Hoàng Long Group CMS</h1>
        </div>
        {nav.map((item) => (
          <button className={view === item ? "active" : ""} key={item} onClick={() => setView(item)}>
            {labels[item]}
          </button>
        ))}
        <button
          onClick={() => {
            localStorage.removeItem("hlg_admin_session");
            setSession(null);
          }}
        >
          Đăng xuất
        </button>
      </aside>
      <section className="main">
        <div className="topline">
          <div>
            <h2>{labels[view]}</h2>
            <p>{session.user.name} · {session.user.role}</p>
          </div>
          {view === "leads" ? (
            <button className="button light" type="button" onClick={() => downloadLeadsCsv(session.accessToken)}>
              Export CSV
            </button>
          ) : null}
        </div>
        {error ? <p className="notice">{error}</p> : null}
        {view === "dashboard" ? <Dashboard data={data} /> : null}
        {view === "leads" ? <LeadTable token={session.accessToken} data={data} refresh={() => setView("dashboard")} /> : null}
        {view !== "dashboard" && view !== "leads" ? <CollectionTable data={data} /> : null}
      </section>
    </main>
  );
}

function Dashboard({ data }: { data: any }) {
  const items = [
    ["Lead mới", data?.newLeads ?? "..."],
    ["Dự án draft", data?.draftProjects ?? "..."],
    ["Dự án published", data?.publishedProjects ?? "..."],
    ["Sản phẩm", data?.products ?? "..."],
    ["Tin tức", data?.articles ?? "..."]
  ];
  return (
    <div className="grid">
      {items.map(([label, value]) => (
        <article className="card" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </article>
      ))}
    </div>
  );
}

function LeadTable({ data, token, refresh }: { data: any[] | null; token: string; refresh: () => void }) {
  async function update(id: string, status: string) {
    await apiPatch(`/leads/${id}/status`, token, { status });
    refresh();
  }

  return (
    <div className="panel">
      <table>
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Người gửi</th>
            <th>Liên hệ</th>
            <th>Nội dung</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {(data || []).map((lead) => (
            <tr key={lead.id}>
              <td>{new Date(lead.createdAt).toLocaleDateString("vi-VN")}</td>
              <td>{lead.name}<br />{lead.company}</td>
              <td>{lead.email}<br />{lead.phone}</td>
              <td>{lead.message}</td>
              <td>
                <select defaultValue={lead.status} onChange={(event) => update(lead.id, event.target.value)}>
                  <option value="new">new</option>
                  <option value="in_progress">in_progress</option>
                  <option value="resolved">resolved</option>
                  <option value="archived">archived</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CollectionTable({ data }: { data: any[] | null }) {
  return (
    <div className="panel">
      <table>
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Slug/ID</th>
            <th>Trạng thái</th>
            <th>EN</th>
          </tr>
        </thead>
        <tbody>
          {(data || []).map((item) => (
            <tr key={item.id}>
              <td>{item.title?.vi || item.name?.vi || item.id}</td>
              <td>{item.slug || item.id}</td>
              <td>{item.status || "-"}</td>
              <td>{item.enPublished ? "published" : "hidden"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
