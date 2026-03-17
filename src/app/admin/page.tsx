"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type EntityType = "ESSENTIAL" | "IMPORTANT" | "SME" | "NOT_COVERED";

interface Entity {
  id:           string;
  name:         string;
  sector:       string;
  size:         string;
  entityType:   EntityType;
  score:        number | null;
  completedAt:  string | null;
  assessmentId: string | null;
  createdAt:    string;
}

const TYPE_META: Record<EntityType, { label: string; color: string; bg: string; border: string }> = {
  ESSENTIAL:   { label: "СУШТИНСКИ",     color: "text-red-300",     bg: "bg-red-500/15",    border: "border-red-500/30"    },
  IMPORTANT:   { label: "ВАЖЕН",         color: "text-amber-300",   bg: "bg-amber-500/15",  border: "border-amber-500/30"  },
  SME:         { label: "ММСП",          color: "text-emerald-300", bg: "bg-emerald-500/15",border: "border-emerald-500/30"},
  NOT_COVERED: { label: "НЕ Е ОПФАТЕН", color: "text-slate-300",   bg: "bg-slate-500/15",  border: "border-slate-500/30"  },
};

function TypeBadge({ type }: { type: EntityType }) {
  const m = TYPE_META[type] ?? TYPE_META.NOT_COVERED;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${m.bg} ${m.color} ${m.border}`}>
      {m.label}
    </span>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("mk-MK", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatScore(score: number | null): string {
  if (score === null) return "—";
  return `${Math.round(score)}%`;
}

export default function AdminDashboard() {
  const router = useRouter();

  const [token,    setToken]   = useState<string | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [total,    setTotal]   = useState(0);
  const [page,     setPage]    = useState(1);
  const [search,   setSearch]  = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading,  setLoading] = useState(true);
  const [error,    setError]   = useState("");

  // Auth check
  useEffect(() => {
    const t = sessionStorage.getItem("adminToken");
    if (!t) { router.replace("/admin/login"); return; }
    setToken(t);
  }, [router]);

  const fetchEntities = useCallback(async (tok: string, pg: number, q: string, tf: string) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(pg) });
      if (q)  params.set("search", q);
      if (tf) params.set("type", tf);
      const res = await fetch(`/api/admin/entities?${params}`, {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (res.status === 401) { sessionStorage.removeItem("adminToken"); router.replace("/admin/login"); return; }
      if (!res.ok) { setError("Грешка при вчитување на податоците"); return; }
      const data = await res.json();
      setEntities(data.entities);
      setTotal(data.total);
    } catch {
      setError("Грешка при поврзување со серверот");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (token) fetchEntities(token, page, search, typeFilter);
  }, [token, page, search, typeFilter, fetchEntities]);

  function handleSearch(v: string) { setSearch(v); setPage(1); }
  function handleTypeFilter(v: string) { setTypeFilter(v); setPage(1); }

  function logout() {
    sessionStorage.removeItem("adminToken");
    router.replace("/admin/login");
  }

  // Summary counts
  const counts = entities.reduce(
    (acc, e) => { acc[e.entityType] = (acc[e.entityType] ?? 0) + 1; return acc; },
    {} as Record<string, number>
  );

  function exportCSV() {
    const header = ["#","Организација","Сектор","Големина","Класификација","Резултат","Дата"];
    const rows   = entities.map((e, i) => [
      i + 1 + (page - 1) * 20,
      `"${e.name}"`,
      `"${e.sector}"`,
      e.size,
      e.entityType,
      e.score !== null ? `${Math.round(e.score)}%` : "",
      e.completedAt ? new Date(e.completedAt).toLocaleDateString("mk-MK") : "",
    ]);
    const csv  = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "mkd-cirt-entities.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.ceil(total / 20);

  if (!token) return null;

  return (
    <div className="min-h-screen bg-[#0b1120]">
      {/* Top bar */}
      <header className="border-b border-white/[0.09] bg-[#0b1120]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-[11px] text-white">MK</div>
            <div>
              <span className="text-white font-semibold text-sm">MKD-CIRT</span>
              <span className="text-slate-500 text-xs ml-2">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">← Платформа</Link>
            <button onClick={logout} className="text-xs text-red-400 hover:text-red-300 transition-colors border border-red-500/20 px-3 py-1.5 rounded-lg hover:border-red-500/40">
              Одјави се
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page title */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-white">Евидентирани субјекти</h1>
          <p className="text-sm text-slate-400 mt-1">Сите организации кои извршиле класификација или проценка</p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
          {[
            { label: "Вкупно",     value: total,                          color: "text-white",         bg: "bg-white/[0.05]",    border: "border-white/[0.1]"     },
            { label: "Суштински",  value: counts["ESSENTIAL"]   ?? 0,     color: "text-red-300",       bg: "bg-red-500/[0.08]",  border: "border-red-500/20"      },
            { label: "Важни",      value: counts["IMPORTANT"]   ?? 0,     color: "text-amber-300",     bg: "bg-amber-500/[0.08]",border: "border-amber-500/20"    },
            { label: "ММСП / Др.", value: (counts["SME"] ?? 0) + (counts["NOT_COVERED"] ?? 0), color: "text-emerald-300", bg: "bg-emerald-500/[0.08]", border: "border-emerald-500/20" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-4 border ${s.bg} ${s.border}`}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="search"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Пребарај по назив на организација..."
            className="input flex-1"
          />
          <select
            value={typeFilter}
            onChange={e => handleTypeFilter(e.target.value)}
            className="input sm:w-52"
          >
            <option value="">Сите класификации</option>
            <option value="ESSENTIAL">Суштински субјекти</option>
            <option value="IMPORTANT">Важни субјекти</option>
            <option value="SME">ММСП</option>
            <option value="NOT_COVERED">Не е опфатен</option>
          </select>
          <button onClick={exportCSV} className="btn-ghost text-xs px-4 whitespace-nowrap">
            Извоз CSV
          </button>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {error ? (
            <div className="p-8 text-center text-sm text-red-300">{error}</div>
          ) : loading ? (
            <div className="p-8 text-center text-sm text-slate-500 font-mono">Се вчитува...</div>
          ) : entities.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-slate-500 text-sm">Нема пронајдени субјекти</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                    <th className="px-4 py-3 text-left text-xs font-mono text-slate-500 uppercase tracking-wider w-10">#</th>
                    <th className="px-4 py-3 text-left text-xs font-mono text-slate-500 uppercase tracking-wider">Организација</th>
                    <th className="px-4 py-3 text-left text-xs font-mono text-slate-500 uppercase tracking-wider">Сектор</th>
                    <th className="px-4 py-3 text-left text-xs font-mono text-slate-500 uppercase tracking-wider">Класификација</th>
                    <th className="px-4 py-3 text-left text-xs font-mono text-slate-500 uppercase tracking-wider">Резултат</th>
                    <th className="px-4 py-3 text-left text-xs font-mono text-slate-500 uppercase tracking-wider">Дата</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {entities.map((e, i) => (
                    <tr key={e.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3 text-slate-600 text-xs font-mono">
                        {(page - 1) * 20 + i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{e.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{e.size}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-300 text-xs">{e.sector}</td>
                      <td className="px-4 py-3">
                        <TypeBadge type={e.entityType} />
                      </td>
                      <td className="px-4 py-3">
                        {e.score !== null ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-blue-500"
                                style={{ width: `${Math.min(100, Math.round(e.score))}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-300 font-mono">{formatScore(e.score)}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 font-mono whitespace-nowrap">
                        {formatDate(e.completedAt ?? e.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-slate-500">
              Прикажани {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} од {total}
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-ghost text-xs px-3 py-1.5 disabled:opacity-40"
              >
                ← Претходна
              </button>
              <span className="px-3 py-1.5 text-xs text-slate-400 font-mono">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-ghost text-xs px-3 py-1.5 disabled:opacity-40"
              >
                Следна →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
