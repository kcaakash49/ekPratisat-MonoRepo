"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Search, ChevronDown, X, Filter, Sparkles, Check } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export default function PropertySearchBar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // Local State initialized from URL
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [category, setCategory] = useState(sp.get("c_id") ?? "");
  const [type, setType] = useState(sp.get("type") ?? "");
  const [isFeatured, setIsFeatured] = useState(sp.get("isFeatured") === "true");

  const [isPending, startTransition] = useTransition();

  // Keep local state in sync if URL changes (e.g., clicking a category card)
  useEffect(() => {
    setQ(sp.get("q") ?? "");
    setCategory(sp.get("c_id") ?? "");
    setType(sp.get("type") ?? "");
    setIsFeatured(sp.get("isFeatured") === "true");
  }, [sp]);

  const applyFilters = (updates: Record<string, string | boolean>) => {
    const params = new URLSearchParams(sp.toString());

    // Apply the updates passed (q, c_id, or type)
    Object.entries(updates).forEach(([key, value]) => {
      // if (value) params.set(key, value);
      // else params.delete(key);
      if (value === "" || value === false || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }

    });

    params.set("page", "1"); // Reset to page 1 on search

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const toggleFeatured = () => {
    const nextValue = !isFeatured;
    setIsFeatured(nextValue);
    applyFilters({ isFeatured: nextValue });
  };

  const resetAll = () => {
    setQ("");
    setCategory("");
    setType("");
    setIsFeatured(false);
    startTransition(() => router.push(pathname));
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-12 -mt-10 relative z-20 px-4">
      <div className="rounded-2xl border border-[var(--ek-border-soft)] bg-[var(--ek-bg-card)] p-2 shadow-[var(--ek-shadow-card)] backdrop-blur-md md:rounded-full md:p-3 dark:border-[var(--ek-dark-border)] dark:bg-[var(--ek-dark-surface)] dark:shadow-[var(--ek-dark-shadow-card)]">
        <div className="flex flex-col md:flex-row items-center gap-2">

          {/* Keyword Search */}
          <div className="flex-1 flex items-center px-4 w-full border-b md:border-b-0 md:border-r border-[var(--ek-border-soft)] dark:border-[var(--ek-dark-border)] py-2">
            <Search className="mr-3 text-[var(--ek-gold-text)] dark:text-[var(--ek-dark-gold)]" size={20} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters({ q })}
              placeholder="Search location or title..."
              className="w-full border-none bg-transparent text-sm text-[var(--ek-text-primary)] outline-none placeholder:text-[var(--ek-text-muted)] dark:text-[var(--ek-dark-text)] dark:placeholder:text-[var(--ek-dark-soft)]"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex-1 flex items-center px-4 w-full border-b md:border-b-0 md:border-r border-[var(--ek-border-soft)] dark:border-[var(--ek-dark-border)] py-2">
            <Filter className="mr-3 shrink-0 text-[var(--ek-gold-text)] dark:text-[var(--ek-dark-gold)]" size={18} />

            <div className="relative w-full group">
              {/* The Select Box */}
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  applyFilters({ c_id: e.target.value });
                }}
                className="w-full cursor-pointer appearance-none rounded-lg border border-[var(--ek-border-soft)] bg-[var(--ek-bg-card-soft)] px-3 py-2 pr-10 text-sm text-[var(--ek-text-primary)] outline-none transition-colors focus:border-[var(--ek-border-strong)] focus:ring-1 focus:ring-gold-500 dark:border-[var(--ek-dark-border)] dark:bg-[var(--ek-dark-elevated)] dark:text-[var(--ek-dark-text)]"
              >
                <option value="" className="dark:bg-[var(--ek-dark-surface)]">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="dark:bg-[var(--ek-dark-surface)]">
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Custom Chevron Icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary-400 group-hover:text-gold transition-colors">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
          
          {/* Feature toggle button */}
          <div className="px-2 w-full md:w-auto">
            <button
              type="button"
              aria-pressed={isFeatured}
              onClick={toggleFeatured}
              className={`flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold transition-colors transition-shadow duration-150 md:min-w-[9.75rem] ${
                isFeatured 
                ? "border-[rgba(214,169,54,0.72)] bg-[linear-gradient(135deg,rgba(255,216,87,0.98),rgba(214,169,54,0.88))] text-[#151006] shadow-[0_0_0_3px_rgba(214,169,54,0.18),0_12px_30px_rgba(154,106,0,0.22)] hover:shadow-[0_0_0_4px_rgba(214,169,54,0.22),0_14px_34px_rgba(154,106,0,0.26)] dark:border-[rgba(239,199,90,0.72)] dark:bg-[linear-gradient(135deg,rgba(239,199,90,0.95),rgba(185,132,22,0.9))] dark:text-[#151006] dark:shadow-[0_0_0_3px_rgba(239,199,90,0.18),0_14px_34px_rgba(0,0,0,0.38)]" 
                : "border-[var(--ek-border-soft)] bg-[var(--ek-bg-card-soft)] text-[var(--ek-text-secondary)] hover:border-[var(--ek-border-strong)] hover:text-[var(--ek-text-primary)] dark:border-[var(--ek-dark-border)] dark:bg-[var(--ek-dark-elevated)] dark:text-[var(--ek-dark-muted)] dark:hover:border-[var(--ek-dark-border-strong)] dark:hover:text-[var(--ek-dark-text)]"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors transition-shadow duration-150 ${
                  isFeatured
                    ? "border-[#151006] bg-[#151006] text-[#f9d45f] shadow-[0_0_14px_rgba(21,16,6,0.35)]"
                    : "border-[var(--ek-border-strong)] bg-transparent text-transparent dark:border-[var(--ek-dark-border-strong)]"
                }`}
                aria-hidden="true"
              >
                <Check size={13} strokeWidth={3} />
              </span>
              <span>{isFeatured ? "FEATURED ONLY" : "FEATURED"}</span>
              {isFeatured && (
                <span className="rounded-full bg-[#151006]/12 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-[#151006]">
                  ON
                </span>
              )}
              {!isFeatured && (
                <Sparkles size={13} className="text-[var(--ek-gold-text)] opacity-60 dark:text-[var(--ek-dark-gold)]" />
              )}
            </button>
          </div>

          {/* Type Dropdown (Rent/Sale) */}
          <div className="flex-1 flex items-center px-4 w-full py-2">
            <div className="flex w-full rounded-full bg-[rgba(154,106,0,0.08)] p-1 dark:bg-[rgba(229,184,62,0.08)]">
              {['', 'rent', 'sale'].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setType(t);
                    applyFilters({ type: t });
                  }}
                  className={`flex-1 text-[10px] md:text-xs font-bold py-1.5 rounded-full transition-all ${type === t
                    ? 'bg-gold-gradient text-[#151006] shadow-sm'
                    : 'text-[var(--ek-text-secondary)] hover:text-[var(--ek-text-primary)] dark:text-[var(--ek-dark-muted)] dark:hover:text-[var(--ek-dark-text)]'
                    }`}
                >
                  {t === '' ? 'ALL' : t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto px-2 pb-2 md:pb-0">
            <button
              onClick={() => applyFilters({ q })}
              disabled={isPending}
              className="flex-1 rounded-xl bg-gold-gradient px-8 py-3 text-sm font-bold text-[#151006] shadow-sm shadow-gold-800/15 transition-transform hover:-translate-y-0.5 hover:bg-gold-gradient-hover active:translate-y-0 disabled:opacity-50 md:flex-none md:rounded-full"
            >
              {isPending ? "..." : "Search"}
            </button>

            {(q || category || type) && (
              <button
                onClick={resetAll}
                className="p-3 text-secondary-400 hover:text-red-500 transition-colors"
                title="Reset Filters"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
