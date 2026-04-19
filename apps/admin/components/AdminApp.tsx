"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  ApiError,
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  downloadLeadsCsv,
  getSetting,
  saveSetting,
  Session
} from "../lib/api";
import { LoginForm } from "./LoginForm";

type View = "dashboard" | "leads" | "posts" | "header" | "footer" | "menu" | "projects" | "catalogue" | "capabilities";
type PublishStatus = "draft" | "published" | "archived";
type LocalizedText = { vi: string; en?: string };
type SeoFields = { title?: LocalizedText; description?: LocalizedText; image?: string };
type MediaAsset = { id: string; url: string; alt?: LocalizedText; type?: "image" | "pdf"; folder?: string };
type SpecRow = { label: LocalizedText; value: LocalizedText };

type NewsArticle = {
  id: string;
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText;
  category: LocalizedText;
  tags: string[];
  publishedAt?: string | null;
  status: PublishStatus;
  enPublished: boolean;
  image?: string | null;
  seo?: SeoFields;
};

type ProjectItem = {
  id: string;
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText;
  sector: LocalizedText;
  location: LocalizedText;
  year: number;
  scale: LocalizedText;
  role: LocalizedText;
  result: LocalizedText;
  featured: boolean;
  status: PublishStatus;
  enPublished: boolean;
  heroImage?: string | null;
  gallery?: MediaAsset[] | null;
  seo?: SeoFields;
};

type CatalogueCategory = {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  status: PublishStatus;
  enPublished: boolean;
};

type CatalogueProduct = {
  id: string;
  slug: string;
  categoryId: string;
  name: LocalizedText;
  summary: LocalizedText;
  specs: SpecRow[];
  status: PublishStatus;
  enPublished: boolean;
  image?: string | null;
  seo?: SeoFields;
};

type CapabilityItem = {
  id: string;
  type: string;
  title: LocalizedText;
  description: LocalizedText;
  metric?: LocalizedText | null;
  image?: string | null;
  status: PublishStatus;
  enPublished: boolean;
};

type Lead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  status: string;
  source?: string;
  createdAt: string;
};

type HeaderSettings = {
  logoUrl: string;
  brandName: LocalizedText;
  tagline: LocalizedText;
  cta: { enabled: boolean; href: string; label: LocalizedText };
};

type FooterSettings = {
  brandTagline: LocalizedText;
  capabilitiesTitle: LocalizedText;
  proofTitle: LocalizedText;
  contactTitle: LocalizedText;
  contactCopy: LocalizedText;
  pendingRecords: LocalizedText;
  copyright: LocalizedText;
  contactCta: { enabled: boolean; href: string; label: LocalizedText };
};

type MenuItem = {
  id: string;
  href: string;
  placement: "header" | "footerCapabilities" | "footerProof";
  order: number;
  enabled: boolean;
  label: LocalizedText;
};

type CmsKind = "news" | "projects" | "capabilities" | "catalogue-categories" | "catalogue-products";

const labels: Record<View, string> = {
  dashboard: "Dashboard",
  leads: "Lead liên hệ",
  posts: "Bài đăng",
  header: "Header",
  footer: "Footer",
  menu: "Menu",
  projects: "Dự án",
  catalogue: "Catalogue",
  capabilities: "Năng lực"
};

const viewDescriptions: Record<View, string> = {
  dashboard: "Theo dõi nhanh lead, nội dung publish/draft và các việc cần xử lý.",
  leads: "Lọc, xem chi tiết và cập nhật trạng thái lead hợp tác từ website.",
  posts: "Quản lý bài đăng song ngữ, trạng thái xuất bản và SEO.",
  header: "Cấu hình logo, thương hiệu, tagline và CTA trên header public.",
  footer: "Cấu hình footer B2B, copy liên hệ hợp tác và CTA cuối trang.",
  menu: "Quản lý menu header và các nhóm link footer theo locale.",
  projects: "Quản lý dự án tiêu biểu, vai trò, quy mô và bằng chứng triển khai.",
  catalogue: "Quản lý danh mục và hạng mục/cấu kiện có thể hợp tác sản xuất.",
  capabilities: "Quản lý nhà máy, thiết bị, quy trình và proof block năng lực."
};

const navSections: Array<{ title: string; items: View[] }> = [
  { title: "Tổng quan", items: ["dashboard", "leads"] },
  { title: "Nội dung", items: ["posts", "projects", "catalogue"] },
  { title: "Cấu hình site", items: ["header", "footer", "menu"] },
  { title: "Bằng chứng năng lực", items: ["capabilities"] }
];

const dataViews: View[] = ["dashboard", "leads", "posts", "projects", "capabilities"];

const adminLoginDisabled = process.env.NEXT_PUBLIC_ADMIN_LOGIN_DISABLED !== "false";
const bypassSession: Session = {
  accessToken: "",
  user: {
    sub: "local-admin-bypass",
    email: "local-admin@hoanglong.local",
    role: "SUPER_ADMIN",
    name: "Local Admin"
  }
};

const emptySeo = { title: { vi: "", en: "" }, description: { vi: "", en: "" } };

export function AdminApp() {
  const [session, setSession] = useState<Session | null>(adminLoginDisabled ? bypassSession : null);
  const [view, setView] = useState<View>("dashboard");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const loading = dataViews.includes(view) && data === null && !error;

  useEffect(() => {
    if (adminLoginDisabled) return;
    const raw = localStorage.getItem("hlg_admin_session");
    if (raw) setSession(JSON.parse(raw));
  }, []);

  useEffect(() => {
    if (!session) return;
    if (["header", "footer", "menu", "catalogue"].includes(view)) {
      setData(null);
      setError("");
      return;
    }
    setError("");
    setData(null);
    const path = view === "dashboard" ? "/dashboard" : view === "posts" ? "/news" : `/${view}`;
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
  }, [session, view, refreshKey]);

  if (!session) return <LoginForm onLogin={setSession} />;
  const refresh = () => setRefreshKey((value) => value + 1);
  const open = (nextView: View) => {
    setData(null);
    setError("");
    setView(nextView);
    setRefreshKey((value) => value + 1);
  };

  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/assets/hoang-long-logo.svg" alt="Hoàng Long JSC" />
          <div>
            <h1>Hoàng Long Group CMS</h1>
            <p>Admin nội dung B2B</p>
          </div>
        </div>
        <nav className="sidebar-nav" aria-label="Admin navigation">
          {navSections.map((section) => (
            <div className="nav-group" key={section.title}>
              <span>{section.title}</span>
              {section.items.map((item) => (
                <button className={view === item ? "active" : ""} key={item} onClick={() => open(item)}>
                  {labels[item]}
                </button>
              ))}
            </div>
          ))}
        </nav>
        {adminLoginDisabled ? (
          <p className="auth-disabled">Đăng nhập admin đang tạm tắt.</p>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem("hlg_admin_session");
              setSession(null);
            }}
          >
            Đăng xuất
          </button>
        )}
      </aside>
      <section className="main">
        <div className="topline">
          <div>
            <h2>{labels[view]}</h2>
            <p>{viewDescriptions[view]}</p>
          </div>
          <div className="topline-actions">
            <span className="badge">{session.user.role}</span>
            {adminLoginDisabled ? <span className="badge draft">Login bypass</span> : null}
            {view === "leads" ? (
              <button className="button light" type="button" onClick={() => downloadLeadsCsv(session.accessToken)}>
                Export CSV
              </button>
            ) : null}
          </div>
        </div>
        {error ? <p className="notice">{error}</p> : null}
        {view === "dashboard" ? <Dashboard data={data} loading={loading} open={open} /> : null}
        {view === "leads" ? <LeadManager token={session.accessToken} data={data} loading={loading} refresh={refresh} /> : null}
        {view === "posts" ? <PostManager token={session.accessToken} data={data} loading={loading} refresh={refresh} /> : null}
        {view === "projects" ? <ProjectManager token={session.accessToken} data={data} loading={loading} refresh={refresh} /> : null}
        {view === "catalogue" ? <CatalogueManager token={session.accessToken} /> : null}
        {view === "capabilities" ? <CapabilityManager token={session.accessToken} data={data} loading={loading} refresh={refresh} /> : null}
        {view === "header" ? <HeaderEditor token={session.accessToken} /> : null}
        {view === "footer" ? <FooterEditor token={session.accessToken} /> : null}
        {view === "menu" ? <MenuEditor token={session.accessToken} /> : null}
      </section>
    </main>
  );
}

function Dashboard({ data, loading, open }: { data: any; loading: boolean; open: (view: View) => void }) {
  if (loading) return <DashboardSkeleton />;
  const items = [
    ["Lead mới", data?.newLeads ?? 0, "leads" as View, data?.newLeads ? "needs-attention" : ""],
    ["Bài đăng", `${data?.publishedArticles ?? 0}/${data?.draftArticles ?? 0}`, "posts" as View, data?.draftArticles ? "needs-attention" : ""],
    ["Dự án", `${data?.publishedProjects ?? 0}/${data?.draftProjects ?? 0}`, "projects" as View, data?.draftProjects ? "needs-attention" : ""],
    ["Catalogue", data?.products ?? 0, "catalogue" as View, ""],
    ["Năng lực", data?.capabilities ?? 0, "capabilities" as View, ""],
    ["Thiếu EN", data?.missingEn ?? 0, "posts" as View, data?.missingEn ? "needs-attention" : ""]
  ];
  const tasks = [
    [`${data?.newLeads ?? 0} lead mới cần xử lý`, "leads" as View],
    [`${data?.draftArticles ?? 0} bài viết đang draft`, "posts" as View],
    [`${data?.draftProjects ?? 0} dự án đang draft`, "projects" as View],
    [`${data?.missingEn ?? 0} nội dung published thiếu EN`, "posts" as View],
    ["Kiểm tra menu/header/footer sau khi chỉnh", "menu" as View]
  ];
  return (
    <>
      <div className="grid dashboard-grid">
        {items.map(([label, value, target, tone]) => (
          <button className={`card kpi-card ${tone}`} key={label} type="button" onClick={() => open(target as View)}>
            <span>{label}</span>
            <strong>{value}</strong>
            {label === "Bài đăng" || label === "Dự án" ? <small>published / draft</small> : null}
          </button>
        ))}
      </div>
      <div className="dashboard-panels">
        <section className="panel padded-panel">
          <div className="panel-title">
            <h3>Việc cần xử lý</h3>
          </div>
          <div className="task-list">
            {tasks.map(([task, target]) => (
              <button key={task} type="button" onClick={() => open(target as View)}>
                <span>{task}</span>
                <strong>Mở</strong>
              </button>
            ))}
          </div>
        </section>
        <section className="panel padded-panel">
          <div className="panel-title">
            <h3>Quick actions</h3>
          </div>
          <div className="quick-actions">
            <button className="button" type="button" onClick={() => open("posts")}>
              Tạo bài
            </button>
            <button className="button" type="button" onClick={() => open("projects")}>
              Tạo dự án
            </button>
            <button className="button light" type="button" onClick={() => open("catalogue")}>
              Thêm hạng mục
            </button>
            <button className="button light" type="button" onClick={() => open("menu")}>
              Chỉnh menu
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

function LeadManager({ data, loading, token, refresh }: { data: Lead[] | null; loading: boolean; token: string; refresh: () => void }) {
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);
  const leads = (Array.isArray(data) ? data : []).filter((lead) => {
    const created = lead.createdAt.slice(0, 10);
    const matchesStatus = status === "all" || lead.status === status;
    const matchesFrom = !from || created >= from;
    const matchesTo = !to || created <= to;
    const text = `${lead.name} ${lead.company || ""} ${lead.email} ${lead.phone || ""}`.toLowerCase();
    return matchesStatus && matchesFrom && matchesTo && text.includes(query.toLowerCase());
  });

  async function update(id: string, nextStatus: string) {
    await apiPatch(`/leads/${id}/status`, token, { status: nextStatus });
    refresh();
  }

  return (
    <div className="with-drawer">
      <div>
        <div className="toolbar">
          <span className="toolbar-count">{leads.length} lead</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm công ty, email, số điện thoại" />
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="new">new</option>
            <option value="in_progress">in_progress</option>
            <option value="resolved">resolved</option>
            <option value="archived">archived</option>
          </select>
          <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
          <input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
          <button
            className="button light compact"
            type="button"
            onClick={() => {
              setQuery("");
              setStatus("all");
              setFrom("");
              setTo("");
            }}
          >
            Reset
          </button>
        </div>
        {loading ? <TableSkeleton /> : null}
        <div className="panel">
          <table className="data-table">
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
              {!loading && leads.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState title="Chưa có lead phù hợp" copy="Thử đổi bộ lọc hoặc kiểm tra lại khoảng ngày." />
                  </td>
                </tr>
              ) : null}
              {leads.map((lead) => (
                <tr key={lead.id} className={selected?.id === lead.id ? "selected-row" : ""} onClick={() => setSelected(lead)}>
                  <td data-label="Ngày">{new Date(lead.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td data-label="Người gửi">
                    {lead.name}
                    <br />
                    <span className="muted">{lead.company || "-"}</span>
                  </td>
                  <td data-label="Liên hệ">
                    {lead.email}
                    <br />
                    <span className="muted">{lead.phone || "-"}</span>
                  </td>
                  <td data-label="Nội dung">
                    <span className="line-clamp">{lead.message}</span>
                  </td>
                  <td data-label="Trạng thái">
                    <select
                      value={lead.status}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) => update(lead.id, event.target.value)}
                    >
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
      </div>
      <aside className="panel drawer-panel">
        <span>Detail</span>
        {selected ? (
          <>
            <h3>{selected.name}</h3>
            <p>{selected.message}</p>
            <dl>
              <dt>Công ty</dt>
              <dd>{selected.company || "-"}</dd>
              <dt>Email</dt>
              <dd>{selected.email}</dd>
              <dt>Điện thoại</dt>
              <dd>{selected.phone || "-"}</dd>
              <dt>Source</dt>
              <dd>{selected.source || "website"}</dd>
              <dt>Ngày gửi</dt>
              <dd>{new Date(selected.createdAt).toLocaleString("vi-VN")}</dd>
              <dt>Trạng thái</dt>
              <dd>{selected.status}</dd>
            </dl>
          </>
        ) : (
          <p>Chọn một lead để xem chi tiết.</p>
        )}
      </aside>
    </div>
  );
}

function PostManager({ data, loading, token, refresh }: { data: NewsArticle[] | null; loading: boolean; token: string; refresh: () => void }) {
  const items = Array.isArray(data) ? data : [];
  return (
    <NewsCrud
      token={token}
      items={items}
      loading={loading}
      refresh={refresh}
      title="Bài đăng"
      collection="news"
      emptyLabel="bài đăng"
      formLabel="bài đăng"
    />
  );
}

function ProjectManager({ data, loading, token, refresh }: { data: ProjectItem[] | null; loading: boolean; token: string; refresh: () => void }) {
  return <ProjectCrud token={token} items={Array.isArray(data) ? data : []} loading={loading} refresh={refresh} />;
}

function CapabilityManager({ data, loading, token, refresh }: { data: CapabilityItem[] | null; loading: boolean; token: string; refresh: () => void }) {
  return <CapabilityCrud token={token} items={Array.isArray(data) ? data : []} loading={loading} refresh={refresh} />;
}

function CatalogueManager({ token }: { token: string }) {
  const [tab, setTab] = useState<"categories" | "products">("products");
  const [categories, setCategories] = useState<CatalogueCategory[]>([]);
  const [products, setProducts] = useState<CatalogueProduct[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((value) => value + 1);

  useEffect(() => {
    Promise.all([
      apiGet<CatalogueCategory[]>("/catalogue-categories", token),
      apiGet<CatalogueProduct[]>("/catalogue-products", token)
    ]).then(([nextCategories, nextProducts]) => {
      setCategories(nextCategories);
      setProducts(nextProducts);
    });
  }, [token, refreshKey]);

  return (
    <>
      <div className="segmented">
        <button className={tab === "products" ? "active" : ""} type="button" onClick={() => setTab("products")}>
          Sản phẩm/Hạng mục
        </button>
        <button className={tab === "categories" ? "active" : ""} type="button" onClick={() => setTab("categories")}>
          Danh mục
        </button>
      </div>
      {tab === "products" ? (
        <CatalogueProductCrud token={token} items={products} categories={categories} refresh={refresh} />
      ) : (
        <CatalogueCategoryCrud token={token} items={categories} refresh={refresh} />
      )}
    </>
  );
}

function NewsCrud({
  token,
  items,
  loading,
  refresh
}: {
  token: string;
  items: NewsArticle[];
  loading: boolean;
  refresh: () => void;
  title: string;
  collection: CmsKind;
  emptyLabel: string;
  formLabel: string;
}) {
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [creating, setCreating] = useState(false);
  const filtered = useFilteredItems(items);

  if (creating || editing) {
    return (
      <NewsForm
        token={token}
        article={editing}
        onCancel={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSaved={() => {
          setCreating(false);
          setEditing(null);
          refresh();
        }}
      />
    );
  }

  return (
    <CrudTable
      title="Bài đăng"
      items={filtered.items}
      loading={loading}
      toolbar={filtered.toolbar}
      onCreate={() => setCreating(true)}
      onEdit={(item) => setEditing(item as NewsArticle)}
      onDelete={(item) => softDelete("news", item as NewsArticle, token, refresh)}
      columns={[
        ["Tiêu đề", (item) => item.title?.vi || item.title?.en || item.id],
        ["Slug", (item) => item.slug],
        ["Trạng thái", (item) => <StatusBadge status={item.status} />],
        ["EN", (item) => <EnBadge enabled={item.enPublished} />],
        ["Ngày đăng", (item) => (item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("vi-VN") : "-")]
      ]}
    />
  );
}

function ProjectCrud({ token, items, loading, refresh }: { token: string; items: ProjectItem[]; loading: boolean; refresh: () => void }) {
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [creating, setCreating] = useState(false);
  const filtered = useFilteredItems(items, ["all", "featured"]);

  if (creating || editing) {
    return (
      <ProjectForm
        token={token}
        project={editing}
        onCancel={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSaved={() => {
          setCreating(false);
          setEditing(null);
          refresh();
        }}
      />
    );
  }

  return (
    <CrudTable
      title="Dự án"
      items={filtered.items}
      loading={loading}
      toolbar={filtered.toolbar}
      onCreate={() => setCreating(true)}
      onEdit={(item) => setEditing(item as ProjectItem)}
      onDelete={(item) => softDelete("projects", item as ProjectItem, token, refresh)}
      columns={[
        ["Tiêu đề", (item) => item.title?.vi || item.id],
        ["Slug", (item) => item.slug],
        ["Năm", (item) => item.year],
        ["Featured", (item) => (item.featured ? "yes" : "no")],
        ["Trạng thái", (item) => <StatusBadge status={item.status} />],
        ["EN", (item) => <EnBadge enabled={item.enPublished} />]
      ]}
    />
  );
}

function CapabilityCrud({ token, items, loading, refresh }: { token: string; items: CapabilityItem[]; loading: boolean; refresh: () => void }) {
  const [editing, setEditing] = useState<CapabilityItem | null>(null);
  const [creating, setCreating] = useState(false);
  const filtered = useFilteredItems(items);

  if (creating || editing) {
    return (
      <CapabilityForm
        token={token}
        capability={editing}
        onCancel={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSaved={() => {
          setCreating(false);
          setEditing(null);
          refresh();
        }}
      />
    );
  }

  return (
    <CrudTable
      title="Năng lực"
      items={filtered.items}
      loading={loading}
      toolbar={filtered.toolbar}
      onCreate={() => setCreating(true)}
      onEdit={(item) => setEditing(item as CapabilityItem)}
      onDelete={(item) => softDelete("capabilities", item as CapabilityItem, token, refresh)}
      columns={[
        ["Tiêu đề", (item) => item.title?.vi || item.id],
        ["Type", (item) => item.type],
        ["Metric", (item) => item.metric?.vi || "-"],
        ["Trạng thái", (item) => <StatusBadge status={item.status} />],
        ["EN", (item) => <EnBadge enabled={item.enPublished} />]
      ]}
    />
  );
}

function CatalogueCategoryCrud({ token, items, refresh }: { token: string; items: CatalogueCategory[]; refresh: () => void }) {
  const [editing, setEditing] = useState<CatalogueCategory | null>(null);
  const [creating, setCreating] = useState(false);
  const filtered = useFilteredItems(items);
  if (creating || editing) {
    return (
      <CategoryForm
        token={token}
        category={editing}
        onCancel={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSaved={() => {
          setCreating(false);
          setEditing(null);
          refresh();
        }}
      />
    );
  }
  return (
    <CrudTable
      title="Danh mục catalogue"
      items={filtered.items}
      loading={false}
      toolbar={filtered.toolbar}
      onCreate={() => setCreating(true)}
      onEdit={(item) => setEditing(item as CatalogueCategory)}
      onDelete={(item) => softDelete("catalogue-categories", item as CatalogueCategory, token, refresh)}
      columns={[
        ["Tên", (item) => item.name?.vi || item.id],
        ["Slug", (item) => item.slug],
        ["Trạng thái", (item) => <StatusBadge status={item.status} />],
        ["EN", (item) => <EnBadge enabled={item.enPublished} />]
      ]}
    />
  );
}

function CatalogueProductCrud({
  token,
  items,
  categories,
  refresh
}: {
  token: string;
  items: CatalogueProduct[];
  categories: CatalogueCategory[];
  refresh: () => void;
}) {
  const [editing, setEditing] = useState<CatalogueProduct | null>(null);
  const [creating, setCreating] = useState(false);
  const filtered = useFilteredItems(items);
  if (creating || editing) {
    return (
      <ProductForm
        token={token}
        product={editing}
        categories={categories}
        onCancel={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSaved={() => {
          setCreating(false);
          setEditing(null);
          refresh();
        }}
      />
    );
  }
  return (
    <CrudTable
      title="Sản phẩm/Hạng mục catalogue"
      items={filtered.items}
      loading={false}
      toolbar={filtered.toolbar}
      onCreate={() => setCreating(true)}
      onEdit={(item) => setEditing(item as CatalogueProduct)}
      onDelete={(item) => softDelete("catalogue-products", item as CatalogueProduct, token, refresh)}
      columns={[
        ["Tên", (item) => item.name?.vi || item.id],
        ["Slug", (item) => item.slug],
        ["Danh mục", (item) => categories.find((category) => category.id === item.categoryId)?.name?.vi || item.categoryId],
        ["Trạng thái", (item) => <StatusBadge status={item.status} />],
        ["EN", (item) => <EnBadge enabled={item.enPublished} />]
      ]}
    />
  );
}

function useFilteredItems<T extends { status?: string; featured?: boolean; slug?: string; title?: LocalizedText; name?: LocalizedText; year?: number }>(
  items: T[],
  extraFilters: string[] = ["all"]
) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [extra, setExtra] = useState("all");
  const filtered = items.filter((item) => {
    const text = `${item.title?.vi || ""} ${item.title?.en || ""} ${item.name?.vi || ""} ${item.slug || ""} ${item.year || ""}`.toLowerCase();
    const matchesStatus = status === "all" || item.status === status;
    const matchesExtra = extra === "all" || (extra === "featured" ? item.featured : true);
    return matchesStatus && matchesExtra && text.includes(query.toLowerCase());
  });
  const toolbar = (
    <div className="toolbar">
      <span className="toolbar-count">{filtered.length}/{items.length} bản ghi</span>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tiêu đề, slug, năm" />
      <select value={status} onChange={(event) => setStatus(event.target.value)}>
        <option value="all">Tất cả trạng thái</option>
        <option value="draft">draft</option>
        <option value="published">published</option>
        <option value="archived">archived</option>
      </select>
      {extraFilters.includes("featured") ? (
        <select value={extra} onChange={(event) => setExtra(event.target.value)}>
          <option value="all">Tất cả dự án</option>
          <option value="featured">Featured</option>
        </select>
      ) : null}
      <button
        className="button light compact"
        type="button"
        onClick={() => {
          setQuery("");
          setStatus("all");
          setExtra("all");
        }}
      >
        Reset
      </button>
    </div>
  );
  return { items: filtered, toolbar };
}

function CrudTable({
  title,
  items,
  loading,
  toolbar,
  columns,
  onCreate,
  onEdit,
  onDelete
}: {
  title: string;
  items: any[];
  loading: boolean;
  toolbar: ReactNode;
  columns: Array<[string, (item: any) => ReactNode]>;
  onCreate: () => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}) {
  return (
    <>
      <div className="list-head">
        <div>
          <h3>{title}</h3>
          <p>{items.length} bản ghi đang hiển thị</p>
        </div>
        <button className="button" type="button" onClick={onCreate}>
          Tạo mới
        </button>
      </div>
      {toolbar}
      {loading ? <TableSkeleton /> : null}
      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(([label]) => (
                <th key={label}>{label}</th>
              ))}
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {!loading && items.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1}>
                  <EmptyState title="Chưa có bản ghi" copy="Tạo mới hoặc đổi bộ lọc để xem dữ liệu khác." actionLabel="Tạo mới" onAction={onCreate} />
                </td>
              </tr>
            ) : null}
            {items.map((item) => (
              <tr key={item.id}>
                {columns.map(([label, render]) => (
                  <td data-label={label} key={label}>
                    {render(item)}
                  </td>
                ))}
                <td data-label="Thao tác">
                  <div className="table-actions">
                    <button className="button light compact" type="button" onClick={() => onEdit(item)}>
                      Sửa
                    </button>
                    <button className="button danger compact" type="button" onClick={() => onDelete(item)}>
                      Xoá mềm
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge ${status}`}>{status}</span>;
}

function EnBadge({ enabled }: { enabled: boolean }) {
  return <span className={`badge ${enabled ? "published" : "draft"}`}>{enabled ? "EN published" : "EN hidden"}</span>;
}

function EmptyState({ title, copy, actionLabel, onAction }: { title: string; copy: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{copy}</p>
      {actionLabel && onAction ? (
        <button className="button light compact" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="panel skeleton-panel" aria-label="Đang tải dữ liệu">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="grid dashboard-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <article className="card kpi-card skeleton-card" key={index}>
            <span />
            <strong />
          </article>
        ))}
      </div>
      <div className="dashboard-panels">
        <section className="panel padded-panel skeleton-panel">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} />
          ))}
        </section>
        <section className="panel padded-panel skeleton-panel">
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index} />
          ))}
        </section>
      </div>
    </>
  );
}

async function softDelete(collection: CmsKind, item: { id: string; title?: LocalizedText; name?: LocalizedText; slug?: string }, token: string, refresh: () => void) {
  const label = item.title?.vi || item.name?.vi || item.slug || item.id;
  if (!window.confirm(`Xoá mềm "${label}"?\n\nBản ghi sẽ bị ẩn khỏi public website nhưng vẫn giữ trong hệ thống.`)) return;
  await apiDelete(`/${collection}/${item.id}`, token);
  refresh();
}

function NewsForm({ article, token, onCancel, onSaved }: { article: NewsArticle | null; token: string; onCancel: () => void; onSaved: () => void }) {
  const [form, setForm] = useState(() => newsToForm(article));
  return (
    <ContentEditor
      title={article ? "Sửa bài đăng" : "Tạo bài đăng"}
      form={form}
      setForm={setForm}
      token={token}
      collection="news"
      id={article?.id}
      toPayload={newsPayload}
      onCancel={onCancel}
      onSaved={onSaved}
      preview={<ArticlePreview form={form} />}
    >
      <FormSection title="Nội dung chính">
        <CommonFields token={token} form={form} setForm={setForm} titleLabel="Tiêu đề" imageLabel="Ảnh đại diện URL" />
        <TextPair labelVi="Excerpt VI" labelEn="Excerpt EN" vi={form.excerptVi} en={form.excerptEn} onVi={(value) => patch(setForm, { excerptVi: value })} onEn={(value) => patch(setForm, { excerptEn: value })} />
        <TextPair
          textarea
          rows={9}
          labelVi="Nội dung VI"
          labelEn="Body EN"
          vi={form.bodyVi}
          en={form.bodyEn}
          onVi={(value) => patch(setForm, { bodyVi: value })}
          onEn={(value) => patch(setForm, { bodyEn: value })}
        />
      </FormSection>
      <FormSection title="Thông tin phân loại">
        <div className="form-grid two">
          <TextPair labelVi="Danh mục VI" labelEn="Category EN" vi={form.categoryVi} en={form.categoryEn} onVi={(value) => patch(setForm, { categoryVi: value })} onEn={(value) => patch(setForm, { categoryEn: value })} />
          <Field label="Tags, phân tách bằng dấu phẩy" value={form.tags} onChange={(value) => patch(setForm, { tags: value })} />
        </div>
      </FormSection>
    </ContentEditor>
  );
}

function ProjectForm({ project, token, onCancel, onSaved }: { project: ProjectItem | null; token: string; onCancel: () => void; onSaved: () => void }) {
  const [form, setForm] = useState(() => projectToForm(project));
  return (
    <ContentEditor
      title={project ? "Sửa dự án" : "Tạo dự án"}
      form={form}
      setForm={setForm}
      token={token}
      collection="projects"
      id={project?.id}
      toPayload={projectPayload}
      onCancel={onCancel}
      onSaved={onSaved}
      preview={<ProjectPreview form={form} />}
    >
      <FormSection title="Nội dung chính">
        <CommonFields token={token} form={form} setForm={setForm} titleLabel="Tên dự án" imageLabel="Hero image URL" imageField="heroImage" />
        <TextPair labelVi="Excerpt VI" labelEn="Excerpt EN" vi={form.excerptVi} en={form.excerptEn} onVi={(value) => patch(setForm, { excerptVi: value })} onEn={(value) => patch(setForm, { excerptEn: value })} />
        <TextPair textarea rows={7} labelVi="Body VI" labelEn="Body EN" vi={form.bodyVi} en={form.bodyEn} onVi={(value) => patch(setForm, { bodyVi: value })} onEn={(value) => patch(setForm, { bodyEn: value })} />
      </FormSection>
      <FormSection title="Thông tin dự án">
        <div className="form-grid two">
          <TextPair labelVi="Sector VI" labelEn="Sector EN" vi={form.sectorVi} en={form.sectorEn} onVi={(value) => patch(setForm, { sectorVi: value })} onEn={(value) => patch(setForm, { sectorEn: value })} />
          <TextPair labelVi="Location VI" labelEn="Location EN" vi={form.locationVi} en={form.locationEn} onVi={(value) => patch(setForm, { locationVi: value })} onEn={(value) => patch(setForm, { locationEn: value })} />
          <TextPair labelVi="Scale VI" labelEn="Scale EN" vi={form.scaleVi} en={form.scaleEn} onVi={(value) => patch(setForm, { scaleVi: value })} onEn={(value) => patch(setForm, { scaleEn: value })} />
          <TextPair labelVi="Role VI" labelEn="Role EN" vi={form.roleVi} en={form.roleEn} onVi={(value) => patch(setForm, { roleVi: value })} onEn={(value) => patch(setForm, { roleEn: value })} />
          <TextPair labelVi="Result VI" labelEn="Result EN" vi={form.resultVi} en={form.resultEn} onVi={(value) => patch(setForm, { resultVi: value })} onEn={(value) => patch(setForm, { resultEn: value })} />
          <Field label="Năm" value={form.year} onChange={(value) => patch(setForm, { year: value })} />
          <TextArea label="Gallery URLs, mỗi dòng một URL" value={form.gallery} onChange={(value) => patch(setForm, { gallery: value })} />
          <label className="check-row">
            <input type="checkbox" checked={form.featured} onChange={(event) => patch(setForm, { featured: event.target.checked })} />
            Featured project
          </label>
        </div>
      </FormSection>
    </ContentEditor>
  );
}

function CapabilityForm({ capability, token, onCancel, onSaved }: { capability: CapabilityItem | null; token: string; onCancel: () => void; onSaved: () => void }) {
  const [form, setForm] = useState(() => capabilityToForm(capability));
  return (
    <ContentEditor
      title={capability ? "Sửa năng lực" : "Tạo năng lực"}
      form={form}
      setForm={setForm}
      token={token}
      collection="capabilities"
      id={capability?.id}
      toPayload={capabilityPayload}
      onCancel={onCancel}
      onSaved={onSaved}
      preview={<CapabilityPreview form={form} />}
    >
      <FormSection title="Nội dung năng lực">
        <CommonFields token={token} form={form} setForm={setForm} titleLabel="Tiêu đề năng lực" imageLabel="Image URL" slug={false} excerpt={false} />
        <TextPair textarea rows={5} labelVi="Description VI" labelEn="Description EN" vi={form.descriptionVi} en={form.descriptionEn} onVi={(value) => patch(setForm, { descriptionVi: value })} onEn={(value) => patch(setForm, { descriptionEn: value })} />
      </FormSection>
      <FormSection title="Phân loại và chỉ số">
        <div className="form-grid two">
          <Field label="Type" value={form.type} onChange={(value) => patch(setForm, { type: value })} />
          <TextPair labelVi="Metric VI" labelEn="Metric EN" vi={form.metricVi} en={form.metricEn} onVi={(value) => patch(setForm, { metricVi: value })} onEn={(value) => patch(setForm, { metricEn: value })} />
        </div>
      </FormSection>
    </ContentEditor>
  );
}

function CategoryForm({ category, token, onCancel, onSaved }: { category: CatalogueCategory | null; token: string; onCancel: () => void; onSaved: () => void }) {
  const [form, setForm] = useState(() => categoryToForm(category));
  return (
    <ContentEditor
      title={category ? "Sửa danh mục catalogue" : "Tạo danh mục catalogue"}
      form={form}
      setForm={setForm}
      token={token}
      collection="catalogue-categories"
      id={category?.id}
      toPayload={categoryPayload}
      onCancel={onCancel}
      onSaved={onSaved}
      preview={<CategoryPreview form={form} />}
    >
      <FormSection title="Nội dung danh mục">
        <CommonFields token={token} form={form} setForm={setForm} titleLabel="Tên danh mục" image={false} excerpt={false} />
        <TextPair textarea rows={5} labelVi="Description VI" labelEn="Description EN" vi={form.descriptionVi} en={form.descriptionEn} onVi={(value) => patch(setForm, { descriptionVi: value })} onEn={(value) => patch(setForm, { descriptionEn: value })} />
      </FormSection>
    </ContentEditor>
  );
}

function ProductForm({
  product,
  categories,
  token,
  onCancel,
  onSaved
}: {
  product: CatalogueProduct | null;
  categories: CatalogueCategory[];
  token: string;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(() => productToForm(product, categories[0]?.id || ""));
  return (
    <ContentEditor
      title={product ? "Sửa hạng mục catalogue" : "Tạo hạng mục catalogue"}
      form={form}
      setForm={setForm}
      token={token}
      collection="catalogue-products"
      id={product?.id}
      toPayload={productPayload}
      onCancel={onCancel}
      onSaved={onSaved}
      preview={<ProductPreview form={form} categories={categories} />}
    >
      <FormSection title="Nội dung hạng mục">
        <CommonFields token={token} form={form} setForm={setForm} titleLabel="Tên hạng mục" imageLabel="Image URL" />
        <TextPair labelVi="Summary VI" labelEn="Summary EN" vi={form.summaryVi} en={form.summaryEn} onVi={(value) => patch(setForm, { summaryVi: value })} onEn={(value) => patch(setForm, { summaryEn: value })} />
      </FormSection>
      <FormSection title="Danh mục và specs">
        <label className="field">
          Danh mục
          <select value={form.categoryId} onChange={(event) => patch(setForm, { categoryId: event.target.value })}>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name.vi}
              </option>
            ))}
          </select>
        </label>
        <SpecsEditor specs={form.specs} onChange={(specs) => patch(setForm, { specs })} />
      </FormSection>
    </ContentEditor>
  );
}

function ContentEditor<TForm extends Record<string, any>>({
  title,
  form,
  setForm,
  token,
  collection,
  id,
  toPayload,
  children,
  preview,
  onCancel,
  onSaved
}: {
  title: string;
  form: TForm;
  setForm: React.Dispatch<React.SetStateAction<TForm>>;
  token: string;
  collection: CmsKind;
  id?: string;
  toPayload: (form: TForm) => any;
  children: ReactNode;
  preview: ReactNode;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function save() {
    setSaving(true);
    setError("");
    try {
      const payload = toPayload(form);
      if (id) await apiPatch(`/${collection}/${id}`, token, payload);
      else await apiPost(`/${collection}`, token, payload);
      onSaved();
    } catch {
      setError("Không lưu được nội dung. Kiểm tra dữ liệu bắt buộc hoặc slug trùng.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="editor-layout">
      <section className="panel editor-panel">
        <div className="editor-head">
          <h3>{title}</h3>
          <div className="table-actions">
            <button className="button light" type="button" onClick={onCancel}>
              Huỷ
            </button>
            <button className="button" type="button" onClick={save} disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </div>
        {error ? <p className="notice">{error}</p> : null}
        <div className="form-stack">{children}</div>
        <FormSection title="Xuất bản">
          <div className="form-grid two">
            <label className="field">
              Trạng thái
              <select
                value={form.status}
                onChange={(event) => patch(setForm, { status: event.target.value as PublishStatus } as unknown as Partial<TForm>)}
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </label>
            <label className="check-row">
              <input
                type="checkbox"
                checked={!!form.enPublished}
                onChange={(event) => patch(setForm, { enPublished: event.target.checked } as unknown as Partial<TForm>)}
              />
              Hiển thị bản tiếng Anh
            </label>
          </div>
        </FormSection>
        <SeoSection form={form} setForm={setForm} />
      </section>
      <aside className="panel preview-panel">{preview}</aside>
    </div>
  );
}

function CommonFields({
  token,
  form,
  setForm,
  titleLabel,
  imageLabel = "Image URL",
  imageField = "image",
  slug = true,
  image = true,
  excerpt = true
}: {
  token: string;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  titleLabel: string;
  imageLabel?: string;
  imageField?: string;
  slug?: boolean;
  image?: boolean;
  excerpt?: boolean;
}) {
  return (
    <div className="form-grid two">
      <TextPair labelVi={`${titleLabel} VI`} labelEn={`${titleLabel} EN`} vi={form.titleVi} en={form.titleEn} onVi={(value) => patch(setForm, { titleVi: value })} onEn={(value) => patch(setForm, { titleEn: value })} />
      {slug ? (
        <div className="field with-action">
          <label>Slug</label>
          <div>
            <input value={form.slug} onChange={(event) => patch(setForm, { slug: event.target.value })} />
            <button className="button light" type="button" onClick={() => patch(setForm, { slug: slugify(form.titleVi) })}>
              Tạo slug
            </button>
          </div>
        </div>
      ) : null}
      {image ? (
        <MediaUrlField token={token} label={imageLabel} value={form[imageField] || ""} onChange={(value) => patch(setForm, { [imageField]: value })} />
      ) : null}
      {excerpt ? null : null}
    </div>
  );
}

function TextPair({
  labelVi,
  labelEn,
  vi,
  en,
  onVi,
  onEn,
  textarea = false,
  rows = 4
}: {
  labelVi: string;
  labelEn: string;
  vi: string;
  en: string;
  onVi: (value: string) => void;
  onEn: (value: string) => void;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <>
      {textarea ? <TextArea rows={rows} label={labelVi} value={vi} onChange={onVi} /> : <Field label={labelVi} value={vi} onChange={onVi} />}
      {textarea ? <TextArea rows={rows} label={labelEn} value={en} onChange={onEn} /> : <Field label={labelEn} value={en} onChange={onEn} />}
    </>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="form-section">
      <h4>{title}</h4>
      {children}
    </section>
  );
}

function SeoSection({ form, setForm }: { form: any; setForm: React.Dispatch<React.SetStateAction<any>> }) {
  return (
    <FormSection title="SEO">
      <div className="form-grid two">
        <Field label="SEO title VI" value={form.seoTitleVi || ""} onChange={(value) => patch(setForm, { seoTitleVi: value })} />
        <Field label="SEO title EN" value={form.seoTitleEn || ""} onChange={(value) => patch(setForm, { seoTitleEn: value })} />
        <TextArea label="SEO description VI" value={form.seoDescriptionVi || ""} onChange={(value) => patch(setForm, { seoDescriptionVi: value })} />
        <TextArea label="SEO description EN" value={form.seoDescriptionEn || ""} onChange={(value) => patch(setForm, { seoDescriptionEn: value })} />
      </div>
    </FormSection>
  );
}

function MediaUrlField({ token, label, value, onChange }: { token: string; label: string; value: string; onChange: (value: string) => void }) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  useEffect(() => {
    apiGet<MediaAsset[]>("/media", token).then(setAssets).catch(() => setAssets([]));
  }, [token]);
  return (
    <label className="field">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} />
      {assets.length ? (
        <select value="" onChange={(event) => event.target.value && onChange(event.target.value)}>
          <option value="">Chọn media có sẵn</option>
          {assets.map((asset) => (
            <option key={asset.id} value={asset.url}>
              {asset.alt?.vi || asset.url}
            </option>
          ))}
        </select>
      ) : null}
    </label>
  );
}

function SpecsEditor({ specs, onChange }: { specs: SpecRow[]; onChange: (specs: SpecRow[]) => void }) {
  const rows = specs.length ? specs : [{ label: { vi: "", en: "" }, value: { vi: "", en: "" } }];
  function update(index: number, patch: Partial<SpecRow>) {
    onChange(rows.map((row, current) => (current === index ? { ...row, ...patch } : row)));
  }
  return (
    <div className="spec-editor">
      <div className="panel-title">
        <h3>Specs</h3>
        <button className="button light" type="button" onClick={() => onChange([...rows, { label: { vi: "", en: "" }, value: { vi: "", en: "" } }])}>
          Thêm dòng
        </button>
      </div>
      {rows.map((row, index) => (
        <div className="spec-row" key={index}>
          <input placeholder="Label VI" value={row.label.vi} onChange={(event) => update(index, { label: { ...row.label, vi: event.target.value } })} />
          <input placeholder="Label EN" value={row.label.en || ""} onChange={(event) => update(index, { label: { ...row.label, en: event.target.value } })} />
          <input placeholder="Value VI" value={row.value.vi} onChange={(event) => update(index, { value: { ...row.value, vi: event.target.value } })} />
          <input placeholder="Value EN" value={row.value.en || ""} onChange={(event) => update(index, { value: { ...row.value, en: event.target.value } })} />
          <button className="button danger" type="button" onClick={() => onChange(rows.filter((_, current) => current !== index))}>
            Xoá
          </button>
        </div>
      ))}
    </div>
  );
}

function SettingsEditor<T>({
  settingKey,
  token,
  fallback,
  render,
  preview
}: {
  settingKey: string;
  token: string;
  fallback: T;
  render: (value: T, setValue: (value: T) => void) => ReactNode;
  preview: (value: T) => ReactNode;
}) {
  const [value, setValue] = useState<T>(fallback);
  const [state, setState] = useState<"loading" | "ready" | "saving" | "saved" | "error">("loading");

  useEffect(() => {
    getSetting<T>(settingKey, token)
      .then((data) => {
        setValue(data || fallback);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, [fallback, settingKey, token]);

  async function save() {
    if (settingHasInvalidHref(value)) {
      setState("error");
      return;
    }
    setState("saving");
    try {
      const next = await saveSetting(settingKey, token, value);
      setValue(next);
      setState("saved");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="editor-layout">
      <section className="panel editor-panel">
        <div className="editor-head">
          <h3>{settingKey}</h3>
          <button className="button" type="button" onClick={save} disabled={state === "loading" || state === "saving"}>
            {state === "saving" ? "Đang lưu..." : "Lưu cấu hình"}
          </button>
        </div>
        {state === "loading" ? <p>Đang tải cấu hình...</p> : null}
        {state === "error" ? <p className="notice">Không tải/lưu được cấu hình. Kiểm tra href nội bộ bắt đầu bằng / hoặc link ngoài bằng http.</p> : null}
        {state === "saved" ? <p className="success">Đã lưu cấu hình. Refresh website để xem thay đổi.</p> : null}
        {state !== "loading" ? render(value, setValue) : null}
      </section>
      <aside className="panel preview-panel">{preview(value)}</aside>
    </div>
  );
}

function HeaderEditor({ token }: { token: string }) {
  const fallback: HeaderSettings = {
    logoUrl: "/assets/hoang-long-logo.svg",
    brandName: { vi: "Hoàng Long Group", en: "Hoang Long Group" },
    tagline: { vi: "Manufacturing + Construction", en: "Manufacturing + Construction" },
    cta: { enabled: false, href: "/contact", label: { vi: "Liên hệ hợp tác", en: "Partner with us" } }
  };
  return (
    <SettingsEditor
      settingKey="site.header"
      token={token}
      fallback={fallback}
      render={(value, setValue) => <HeaderForm token={token} value={value} setValue={setValue} />}
      preview={(value) => <HeaderPreview value={value} />}
    />
  );
}

function FooterEditor({ token }: { token: string }) {
  const fallback: FooterSettings = {
    brandTagline: { vi: "", en: "" },
    capabilitiesTitle: { vi: "Năng lực chính", en: "Core capabilities" },
    proofTitle: { vi: "Bằng chứng", en: "Proof" },
    contactTitle: { vi: "Liên hệ hợp tác", en: "Partner inquiry" },
    contactCopy: { vi: "", en: "" },
    pendingRecords: { vi: "", en: "" },
    copyright: { vi: "Tất cả quyền được bảo lưu.", en: "All rights reserved." },
    contactCta: { enabled: true, href: "/contact", label: { vi: "Liên hệ hợp tác", en: "Partner with us" } }
  };
  return (
    <SettingsEditor
      settingKey="site.footer"
      token={token}
      fallback={fallback}
      render={(value, setValue) => <FooterForm value={value} setValue={setValue} />}
      preview={(value) => <FooterPreview value={value} />}
    />
  );
}

function MenuEditor({ token }: { token: string }) {
  return (
    <SettingsEditor
      settingKey="site.navigation"
      token={token}
      fallback={[] as MenuItem[]}
      render={(value, setValue) => <MenuForm value={value} setValue={setValue} />}
      preview={(value) => <MenuPreview value={value} />}
    />
  );
}

function HeaderForm({ token, value, setValue }: { token: string; value: HeaderSettings; setValue: (value: HeaderSettings) => void }) {
  const update = (patch: Partial<HeaderSettings>) => setValue({ ...value, ...patch });
  const cta = value.cta || { enabled: false, href: "/contact", label: { vi: "", en: "" } };
  return (
    <FormSection title="Header">
      <div className="form-grid two">
        <MediaUrlField token={token} label="Logo URL" value={value.logoUrl} onChange={(logoUrl) => update({ logoUrl })} />
        <Field label="CTA href" value={cta.href} onChange={(href) => update({ cta: { ...cta, href } })} />
        <Field label="Brand VI" value={value.brandName?.vi || ""} onChange={(vi) => update({ brandName: { ...value.brandName, vi } })} />
        <Field label="Brand EN" value={value.brandName?.en || ""} onChange={(en) => update({ brandName: { ...value.brandName, en } })} />
        <Field label="Tagline VI" value={value.tagline?.vi || ""} onChange={(vi) => update({ tagline: { ...value.tagline, vi } })} />
        <Field label="Tagline EN" value={value.tagline?.en || ""} onChange={(en) => update({ tagline: { ...value.tagline, en } })} />
        <Field label="CTA label VI" value={cta.label?.vi || ""} onChange={(vi) => update({ cta: { ...cta, label: { ...cta.label, vi } } })} />
        <Field label="CTA label EN" value={cta.label?.en || ""} onChange={(en) => update({ cta: { ...cta, label: { ...cta.label, en } } })} />
        <label className="check-row">
          <input type="checkbox" checked={cta.enabled} onChange={(event) => update({ cta: { ...cta, enabled: event.target.checked } })} />
          Hiển thị CTA trên header
        </label>
      </div>
    </FormSection>
  );
}

function FooterForm({ value, setValue }: { value: FooterSettings; setValue: (value: FooterSettings) => void }) {
  const updateText = (field: keyof FooterSettings, locale: keyof LocalizedText, text: string) =>
    setValue({ ...value, [field]: { ...(value[field] as LocalizedText), [locale]: text } });
  const cta = value.contactCta || { enabled: true, href: "/contact", label: { vi: "", en: "" } };
  return (
    <FormSection title="Footer">
      <div className="form-grid two">
        <TextArea label="Brand tagline VI" value={value.brandTagline?.vi || ""} onChange={(text) => updateText("brandTagline", "vi", text)} />
        <TextArea label="Brand tagline EN" value={value.brandTagline?.en || ""} onChange={(text) => updateText("brandTagline", "en", text)} />
        <Field label="Capabilities title VI" value={value.capabilitiesTitle?.vi || ""} onChange={(text) => updateText("capabilitiesTitle", "vi", text)} />
        <Field label="Capabilities title EN" value={value.capabilitiesTitle?.en || ""} onChange={(text) => updateText("capabilitiesTitle", "en", text)} />
        <Field label="Proof title VI" value={value.proofTitle?.vi || ""} onChange={(text) => updateText("proofTitle", "vi", text)} />
        <Field label="Proof title EN" value={value.proofTitle?.en || ""} onChange={(text) => updateText("proofTitle", "en", text)} />
        <Field label="Contact title VI" value={value.contactTitle?.vi || ""} onChange={(text) => updateText("contactTitle", "vi", text)} />
        <Field label="Contact title EN" value={value.contactTitle?.en || ""} onChange={(text) => updateText("contactTitle", "en", text)} />
        <TextArea label="Contact copy VI" value={value.contactCopy?.vi || ""} onChange={(text) => updateText("contactCopy", "vi", text)} />
        <TextArea label="Contact copy EN" value={value.contactCopy?.en || ""} onChange={(text) => updateText("contactCopy", "en", text)} />
        <TextArea label="Pending records VI" value={value.pendingRecords?.vi || ""} onChange={(text) => updateText("pendingRecords", "vi", text)} />
        <TextArea label="Pending records EN" value={value.pendingRecords?.en || ""} onChange={(text) => updateText("pendingRecords", "en", text)} />
        <Field label="Copyright VI" value={value.copyright?.vi || ""} onChange={(text) => updateText("copyright", "vi", text)} />
        <Field label="Copyright EN" value={value.copyright?.en || ""} onChange={(text) => updateText("copyright", "en", text)} />
        <Field label="CTA href" value={cta.href} onChange={(href) => setValue({ ...value, contactCta: { ...cta, href } })} />
        <Field label="CTA label VI" value={cta.label.vi} onChange={(vi) => setValue({ ...value, contactCta: { ...cta, label: { ...cta.label, vi } } })} />
        <Field label="CTA label EN" value={cta.label.en || ""} onChange={(en) => setValue({ ...value, contactCta: { ...cta, label: { ...cta.label, en } } })} />
        <label className="check-row">
          <input type="checkbox" checked={cta.enabled} onChange={(event) => setValue({ ...value, contactCta: { ...cta, enabled: event.target.checked } })} />
          Hiển thị CTA footer
        </label>
      </div>
    </FormSection>
  );
}

function MenuForm({ value, setValue }: { value: MenuItem[]; setValue: (value: MenuItem[]) => void }) {
  const rows = [...(value || [])].sort((a, b) => a.placement.localeCompare(b.placement) || a.order - b.order);
  function updateRow(index: number, patch: Partial<MenuItem>) {
    setValue(rows.map((row, currentIndex) => (currentIndex === index ? { ...row, ...patch } : row)));
  }
  function addRow() {
    setValue([
      ...rows,
      {
        id: `menu-${Date.now()}`,
        href: "/",
        placement: "header",
        order: rows.length + 1,
        enabled: true,
        label: { vi: "Menu mới", en: "New menu" }
      }
    ]);
  }
  return (
    <>
      <div className="toolbar">
        <button className="button light" type="button" onClick={addRow}>
          Thêm menu item
        </button>
      </div>
      <div className="settings-table">
        {rows.map((item, index) => (
          <div className="settings-row" key={item.id}>
            <label>
              Label VI
              <input value={item.label.vi} onChange={(event) => updateRow(index, { label: { ...item.label, vi: event.target.value } })} />
            </label>
            <label>
              Label EN
              <input value={item.label.en || ""} onChange={(event) => updateRow(index, { label: { ...item.label, en: event.target.value } })} />
            </label>
            <label>
              Href
              <input value={item.href} onChange={(event) => updateRow(index, { href: event.target.value })} />
            </label>
            <label>
              Placement
              <select value={item.placement} onChange={(event) => updateRow(index, { placement: event.target.value as MenuItem["placement"] })}>
                <option value="header">header</option>
                <option value="footerCapabilities">footerCapabilities</option>
                <option value="footerProof">footerProof</option>
              </select>
            </label>
            <label>
              Order
              <input type="number" value={item.order} onChange={(event) => updateRow(index, { order: Number(event.target.value) })} />
            </label>
            <label className="check-row compact">
              <input type="checkbox" checked={item.enabled} onChange={(event) => updateRow(index, { enabled: event.target.checked })} />
              Bật
            </label>
            <button className="button light" type="button" onClick={() => setValue([...rows, { ...item, id: `menu-${Date.now()}`, order: item.order + 1 }])}>
              Duplicate
            </button>
            <button className="button danger" type="button" onClick={() => setValue(rows.filter((_, currentIndex) => currentIndex !== index))}>
              Xoá
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function ArticlePreview({ form }: { form: any }) {
  return (
    <>
      <span>Preview bài đăng</span>
      <img src={form.image || "/assets/industrial-hero.png"} alt="" />
      <div className="preview-badges">
        <StatusBadge status={form.status} />
        <EnBadge enabled={form.enPublished} />
      </div>
      <h3>{form.titleVi || "Tiêu đề bài đăng"}</h3>
      <p>{form.excerptVi || "Mô tả ngắn sẽ hiển thị ở danh sách bài viết."}</p>
    </>
  );
}

function ProjectPreview({ form }: { form: any }) {
  return (
    <>
      <span>Preview dự án</span>
      <img src={form.heroImage || "/assets/industrial-hero.png"} alt="" />
      <div className="preview-badges">
        <StatusBadge status={form.status} />
        <EnBadge enabled={form.enPublished} />
      </div>
      <h3>{form.titleVi || "Tên dự án"}</h3>
      <p>{form.excerptVi || "Mô tả ngắn dự án."}</p>
      <dl>
        <dt>Năm</dt>
        <dd>{form.year || "-"}</dd>
        <dt>Vai trò</dt>
        <dd>{form.roleVi || "-"}</dd>
        <dt>Kết quả</dt>
        <dd>{form.resultVi || "-"}</dd>
      </dl>
    </>
  );
}

function CapabilityPreview({ form }: { form: any }) {
  return (
    <>
      <span>Preview năng lực</span>
      <img src={form.image || "/assets/industrial-hero.png"} alt="" />
      <div className="preview-badges">
        <StatusBadge status={form.status} />
        <EnBadge enabled={form.enPublished} />
      </div>
      <h3>{form.titleVi || "Tiêu đề năng lực"}</h3>
      <p>{form.descriptionVi || "Mô tả năng lực."}</p>
      <small>{form.type || "type"}</small>
    </>
  );
}

function CategoryPreview({ form }: { form: any }) {
  return (
    <>
      <span>Preview danh mục</span>
      <div className="preview-badges">
        <StatusBadge status={form.status} />
        <EnBadge enabled={form.enPublished} />
      </div>
      <h3>{form.titleVi || "Tên danh mục"}</h3>
      <p>{form.descriptionVi || "Mô tả danh mục catalogue."}</p>
    </>
  );
}

function ProductPreview({ form, categories }: { form: any; categories: CatalogueCategory[] }) {
  const category = categories.find((item) => item.id === form.categoryId);
  return (
    <>
      <span>Preview hạng mục</span>
      <img src={form.image || "/assets/industrial-hero.png"} alt="" />
      <div className="preview-badges">
        <StatusBadge status={form.status} />
        <EnBadge enabled={form.enPublished} />
      </div>
      <h3>{form.titleVi || "Tên hạng mục"}</h3>
      <p>{form.summaryVi || "Mô tả ngắn hạng mục."}</p>
      <small>{category?.name.vi || "Chưa chọn danh mục"}</small>
      <ul className="preview-specs">
        {(form.specs || []).map((spec: SpecRow, index: number) => (
          <li key={index}>
            <strong>{spec.label.vi || "Label"}</strong> {spec.value.vi || "Value"}
          </li>
        ))}
      </ul>
    </>
  );
}

function HeaderPreview({ value }: { value: HeaderSettings }) {
  return (
    <div className="chrome-preview">
      <span>Header desktop/mobile</span>
      <div className="preview-header">
        <img src={value.logoUrl || "/assets/hoang-long-logo.svg"} alt="" />
        <div>
          <small>{value.tagline?.vi}</small>
          <strong>{value.brandName?.vi}</strong>
        </div>
      </div>
      {value.cta?.enabled ? <button className="button">{value.cta.label.vi}</button> : <p className="muted">CTA đang tắt</p>}
    </div>
  );
}

function FooterPreview({ value }: { value: FooterSettings }) {
  return (
    <div className="chrome-preview dark">
      <span>Footer responsive</span>
      <h3>{value.contactTitle?.vi}</h3>
      <p>{value.brandTagline?.vi}</p>
      <p>{value.contactCopy?.vi}</p>
      {value.contactCta?.enabled ? <button className="button">{value.contactCta.label.vi}</button> : null}
    </div>
  );
}

function MenuPreview({ value }: { value: MenuItem[] }) {
  const enabled = value.filter((item) => item.enabled).sort((a, b) => a.order - b.order);
  return (
    <div className="chrome-preview">
      <span>Preview menu</span>
      <h3>Header</h3>
      <div className="pill-list">
        {enabled.filter((item) => item.placement === "header").map((item) => (
          <span key={item.id}>{item.label.vi}</span>
        ))}
      </div>
      <h3>Footer năng lực</h3>
      <div className="pill-list">
        {enabled.filter((item) => item.placement === "footerCapabilities").map((item) => (
          <span key={item.id}>{item.label.vi}</span>
        ))}
      </div>
      <h3>Footer bằng chứng</h3>
      <div className="pill-list">
        {enabled.filter((item) => item.placement === "footerProof").map((item) => (
          <span key={item.id}>{item.label.vi}</span>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <label className="field">
      {label}
      <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function newsToForm(article: NewsArticle | null) {
  return {
    titleVi: article?.title?.vi || "",
    titleEn: article?.title?.en || "",
    slug: article?.slug || "",
    excerptVi: article?.excerpt?.vi || "",
    excerptEn: article?.excerpt?.en || "",
    bodyVi: article?.body?.vi || "",
    bodyEn: article?.body?.en || "",
    categoryVi: article?.category?.vi || "Tin tức",
    categoryEn: article?.category?.en || "News",
    tags: article?.tags?.join(", ") || "",
    publishedAt: article?.publishedAt || "",
    status: article?.status || ("draft" as PublishStatus),
    enPublished: article?.enPublished || false,
    image: article?.image || "/assets/industrial-hero.png",
    ...seoToForm(article?.seo)
  };
}

function projectToForm(project: ProjectItem | null) {
  return {
    titleVi: project?.title?.vi || "",
    titleEn: project?.title?.en || "",
    slug: project?.slug || "",
    excerptVi: project?.excerpt?.vi || "",
    excerptEn: project?.excerpt?.en || "",
    bodyVi: project?.body?.vi || "",
    bodyEn: project?.body?.en || "",
    sectorVi: project?.sector?.vi || "",
    sectorEn: project?.sector?.en || "",
    locationVi: project?.location?.vi || "",
    locationEn: project?.location?.en || "",
    scaleVi: project?.scale?.vi || "",
    scaleEn: project?.scale?.en || "",
    roleVi: project?.role?.vi || "",
    roleEn: project?.role?.en || "",
    resultVi: project?.result?.vi || "",
    resultEn: project?.result?.en || "",
    year: String(project?.year || new Date().getFullYear()),
    featured: project?.featured || false,
    status: project?.status || ("draft" as PublishStatus),
    enPublished: project?.enPublished || false,
    heroImage: project?.heroImage || "/assets/industrial-hero.png",
    gallery: (project?.gallery || []).map((item) => item.url).join("\n"),
    ...seoToForm(project?.seo)
  };
}

function capabilityToForm(item: CapabilityItem | null) {
  return {
    titleVi: item?.title?.vi || "",
    titleEn: item?.title?.en || "",
    type: item?.type || "factory",
    descriptionVi: item?.description?.vi || "",
    descriptionEn: item?.description?.en || "",
    metricVi: item?.metric?.vi || "",
    metricEn: item?.metric?.en || "",
    status: item?.status || ("draft" as PublishStatus),
    enPublished: item?.enPublished || false,
    image: item?.image || "/assets/industrial-hero.png",
    ...seoToForm(undefined)
  };
}

function categoryToForm(category: CatalogueCategory | null) {
  return {
    titleVi: category?.name?.vi || "",
    titleEn: category?.name?.en || "",
    slug: category?.slug || "",
    descriptionVi: category?.description?.vi || "",
    descriptionEn: category?.description?.en || "",
    status: category?.status || ("draft" as PublishStatus),
    enPublished: category?.enPublished || false,
    ...seoToForm(undefined)
  };
}

function productToForm(product: CatalogueProduct | null, fallbackCategoryId: string) {
  return {
    titleVi: product?.name?.vi || "",
    titleEn: product?.name?.en || "",
    slug: product?.slug || "",
    categoryId: product?.categoryId || fallbackCategoryId,
    summaryVi: product?.summary?.vi || "",
    summaryEn: product?.summary?.en || "",
    specs: product?.specs?.length ? product.specs : [{ label: { vi: "", en: "" }, value: { vi: "", en: "" } }],
    status: product?.status || ("draft" as PublishStatus),
    enPublished: product?.enPublished || false,
    image: product?.image || "/assets/industrial-hero.png",
    ...seoToForm(product?.seo)
  };
}

function seoToForm(seo: SeoFields | undefined) {
  return {
    seoTitleVi: seo?.title?.vi || "",
    seoTitleEn: seo?.title?.en || "",
    seoDescriptionVi: seo?.description?.vi || "",
    seoDescriptionEn: seo?.description?.en || ""
  };
}

function newsPayload(form: ReturnType<typeof newsToForm>) {
  return {
    slug: form.slug || slugify(form.titleVi),
    title: textPayload(form.titleVi, form.titleEn),
    excerpt: textPayload(form.excerptVi, form.excerptEn),
    body: textPayload(form.bodyVi, form.bodyEn),
    category: textPayload(form.categoryVi, form.categoryEn),
    tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    publishedAt: form.status === "published" ? form.publishedAt || new Date().toISOString() : null,
    status: form.status,
    enPublished: form.enPublished,
    image: form.image || null,
    seo: seoPayload(form)
  };
}

function projectPayload(form: ReturnType<typeof projectToForm>) {
  return {
    slug: form.slug || slugify(form.titleVi),
    title: textPayload(form.titleVi, form.titleEn),
    excerpt: textPayload(form.excerptVi, form.excerptEn),
    body: textPayload(form.bodyVi, form.bodyEn),
    sector: textPayload(form.sectorVi, form.sectorEn),
    location: textPayload(form.locationVi, form.locationEn),
    year: Number(form.year) || new Date().getFullYear(),
    scale: textPayload(form.scaleVi, form.scaleEn),
    role: textPayload(form.roleVi, form.roleEn),
    result: textPayload(form.resultVi, form.resultEn),
    featured: form.featured,
    status: form.status,
    enPublished: form.enPublished,
    heroImage: form.heroImage || null,
    gallery: form.gallery.split("\n").map((url) => url.trim()).filter(Boolean).map((url) => ({ id: url, url, type: "image", alt: { vi: form.titleVi, en: form.titleEn } })),
    seo: seoPayload(form)
  };
}

function capabilityPayload(form: ReturnType<typeof capabilityToForm>) {
  return {
    type: form.type,
    title: textPayload(form.titleVi, form.titleEn),
    description: textPayload(form.descriptionVi, form.descriptionEn),
    metric: form.metricVi || form.metricEn ? textPayload(form.metricVi, form.metricEn) : null,
    status: form.status,
    enPublished: form.enPublished,
    image: form.image || null
  };
}

function categoryPayload(form: ReturnType<typeof categoryToForm>) {
  return {
    slug: form.slug || slugify(form.titleVi),
    name: textPayload(form.titleVi, form.titleEn),
    description: textPayload(form.descriptionVi, form.descriptionEn),
    status: form.status,
    enPublished: form.enPublished
  };
}

function productPayload(form: ReturnType<typeof productToForm>) {
  return {
    slug: form.slug || slugify(form.titleVi),
    categoryId: form.categoryId,
    name: textPayload(form.titleVi, form.titleEn),
    summary: textPayload(form.summaryVi, form.summaryEn),
    specs: form.specs.filter((spec) => spec.label.vi || spec.value.vi),
    status: form.status,
    enPublished: form.enPublished,
    image: form.image || null,
    seo: seoPayload(form)
  };
}

function textPayload(vi: string, en?: string) {
  return { vi, en: en || undefined };
}

function seoPayload(form: any) {
  return {
    ...emptySeo,
    title: textPayload(form.seoTitleVi || "", form.seoTitleEn || ""),
    description: textPayload(form.seoDescriptionVi || "", form.seoDescriptionEn || "")
  };
}

function patch<T>(setForm: React.Dispatch<React.SetStateAction<T>>, patchValue: Partial<T>) {
  setForm((current) => ({ ...current, ...patchValue }));
}

function settingHasInvalidHref(value: unknown) {
  const hrefs: string[] = [];
  const collect = (input: any) => {
    if (!input || typeof input !== "object") return;
    if (typeof input.href === "string") hrefs.push(input.href);
    Object.values(input).forEach(collect);
  };
  collect(value);
  return hrefs.some((href) => href && !href.startsWith("/") && !href.startsWith("http") && !href.startsWith("mailto:") && !href.startsWith("tel:"));
}

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
