"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Search, ChevronDown, X, Filter } from "lucide-react";

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

  const [isPending, startTransition] = useTransition();

  // Keep local state in sync if URL changes (e.g., clicking a category card)
  useEffect(() => {
    setQ(sp.get("q") ?? "");
    setCategory(sp.get("c_id") ?? "");
    setType(sp.get("type") ?? "");
  }, [sp]);

  const applyFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(sp.toString());

    // Apply the updates passed (q, c_id, or type)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    params.set("page", "1"); // Reset to page 1 on search

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const resetAll = () => {
    setQ("");
    setCategory("");
    setType("");
    startTransition(() => router.push(pathname));
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-12 -mt-10 relative z-20 px-4">
      <div className="bg-white dark:bg-secondary-800 backdrop-blur-md border border-secondary-200 dark:border-secondary-700 rounded-2xl md:rounded-full shadow-2xl p-2 md:p-3">
        <div className="flex flex-col md:flex-row items-center gap-2">

          {/* Keyword Search */}
          <div className="flex-1 flex items-center px-4 w-full border-b md:border-b-0 md:border-r border-secondary-100 dark:border-secondary-700 py-2">
            <Search className="text-gold mr-3" size={20} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters({ q })}
              placeholder="Search location or title..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-secondary-400 dark:text-white"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex-1 flex items-center px-4 w-full border-b md:border-b-0 md:border-r border-secondary-100 dark:border-secondary-700 py-2">
            <Filter className="text-gold mr-3 shrink-0" size={18} />

            <div className="relative w-full group">
              {/* The Select Box */}
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  applyFilters({ c_id: e.target.value });
                }}
                className="bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-700 rounded-lg px-3 py-2 text-sm w-full cursor-pointer dark:text-white appearance-none focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all pr-10"
              >
                <option value="" className="dark:bg-secondary-800">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="dark:bg-secondary-800">
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

          {/* Type Dropdown (Rent/Sale) */}
          <div className="flex-1 flex items-center px-4 w-full py-2">
            <div className="flex bg-secondary-100 dark:bg-secondary-900 rounded-full p-1 w-full">
              {['', 'rent', 'sale'].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setType(t);
                    applyFilters({ type: t });
                  }}
                  className={`flex-1 text-[10px] md:text-xs font-bold py-1.5 rounded-full transition-all ${type === t
                      ? 'bg-gold-gradient text-white shadow-md'
                      : 'text-secondary-500 hover:text-secondary-900 dark:hover:text-white'
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
              className="flex-1 md:flex-none bg-secondary-900 dark:bg-black text-white px-8 py-3 rounded-xl md:rounded-full text-sm font-bold hover:bg-gold-gradient transition-all active:scale-95 disabled:opacity-50"
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