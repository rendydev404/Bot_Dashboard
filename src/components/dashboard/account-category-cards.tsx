"use client";

import React from "react";
import { formatNumber } from "@/lib/utils";
import { Layers, RotateCcw } from "lucide-react";

export interface AccountCategorySummary {
  slug: string;
  label: string;
  accounts: number;
  followers: number | null;
  posts: number;
  views: number;
  interactions: number;
  er: number;
  /** Porsi penayangan kategori dari seluruh jaringan (persen) */
  viewShare: number;
}

interface AccountCategoryCardsProps {
  categories: AccountCategorySummary[];
  /** Slug kategori akun yang sedang dipilih (disorot), bila ada */
  activeSlug?: string | null;
  /** Klik kartu untuk memfilter dasbor ke kategori itu (klik lagi untuk melepas) */
  onSelect?: (slug: string) => void;
  loading?: boolean;
}

// Warna bergilir per kategori, memakai token tema agar ikut mode gelap
const TONES = [
  { dot: "bg-accent", bar: "bg-accent", soft: "bg-accent-soft text-accent" },
  { dot: "bg-success", bar: "bg-success", soft: "bg-success-soft text-success" },
  { dot: "bg-warning", bar: "bg-warning", soft: "bg-warning-soft text-warning" },
  { dot: "bg-danger", bar: "bg-danger", soft: "bg-danger-soft text-danger" },
];

export function AccountCategoryCards({
  categories,
  activeSlug,
  onSelect,
  loading = false,
}: AccountCategoryCardsProps) {
  if (!loading && categories.length === 0) return null;

  const totalAccounts = categories.reduce((s, c) => s + c.accounts, 0);

  return (
    <section className="card p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-subtle text-muted">
            <Layers className="w-[18px] h-[18px]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-fg">Kategori akun</h3>
            <p className="text-[13px] text-muted mt-0.5">
              Performa tiap kelompok akun pada periode terpilih.
              {onSelect && " Klik kartu untuk memfilter dasbor."}
            </p>
          </div>
        </div>

        {/* Saat terfilter: tombol lepas filter; selain itu komposisi jumlah akun per kategori */}
        {!loading && activeSlug && onSelect ? (
          <button
            type="button"
            onClick={() => onSelect("all")}
            className="h-9 px-3 self-start sm:self-auto inline-flex items-center gap-1.5 rounded-lg bg-subtle hover:bg-line text-sm font-medium text-fg cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Semua kategori
          </button>
        ) : !loading && totalAccounts > 0 && (
          <div className="flex flex-col gap-1.5 sm:w-64">
            <div className="flex h-2 rounded-full overflow-hidden bg-subtle">
              {categories.map((c, i) => (
                <div
                  key={c.slug}
                  className={TONES[i % TONES.length].bar}
                  style={{ width: `${(c.accounts / totalAccounts) * 100}%` }}
                  title={`${c.label}: ${c.accounts} akun`}
                />
              ))}
            </div>
            <p className="text-xs text-muted sm:text-right">
              {totalAccounts} akun dalam {categories.length} kategori
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {loading
          ? [0, 1, 2].map((i) => (
              <div key={i} className="h-[132px] rounded-xl bg-subtle animate-pulse" />
            ))
          : categories.map((c, i) => {
              const tone = TONES[i % TONES.length];
              const active = activeSlug === c.slug;
              const dimmed = !!activeSlug && !active;
              return (
                <button
                  key={c.slug}
                  type="button"
                  disabled={!onSelect}
                  aria-pressed={active}
                  onClick={() => onSelect?.(active ? "all" : c.slug)}
                  className={`text-left rounded-xl border p-4 transition-all enabled:cursor-pointer ${
                    active
                      ? "border-accent bg-accent-soft/40 ring-2 ring-accent/20"
                      : "border-line enabled:hover:border-line-strong"
                  } ${dimmed ? "opacity-60 hover:opacity-100" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${tone.dot}`} />
                      <span className="font-semibold text-fg truncate" title={c.label}>
                        {c.label}
                      </span>
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md shrink-0 ${tone.soft}`}
                    >
                      {c.accounts} akun
                    </span>
                  </div>

                  <dl className="mt-3 grid grid-cols-3 gap-2 text-[13px]">
                    <div>
                      <dt className="text-muted">Pengikut</dt>
                      <dd className="font-semibold text-fg tabular-nums">
                        {c.followers !== null ? formatNumber(c.followers) : "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted">Postingan</dt>
                      <dd className="font-semibold text-fg tabular-nums">{formatNumber(c.posts)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted">ER</dt>
                      <dd className="font-semibold text-fg tabular-nums">{c.er}%</dd>
                    </div>
                  </dl>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-muted mb-1">
                      <span>{formatNumber(c.views)} penayangan</span>
                      <span className="tabular-nums">{c.viewShare}%</span>
                    </div>
                    <div className="h-1.5 bg-subtle rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${tone.bar}`}
                        style={{ width: `${Math.max(c.views > 0 ? 3 : 0, c.viewShare)}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
      </div>
    </section>
  );
}
