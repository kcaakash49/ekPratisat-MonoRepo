// components/Pagination.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter();
  const sp = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(sp.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-16">
      {/* Previous Button */}
      <button
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="p-2 rounded-lg border border-secondary-200 dark:border-secondary-700 disabled:opacity-30 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
      >
        <ChevronLeft size={20} className="dark:text-white" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
              currentPage === p
                ? "bg-gold-gradient text-white shadow-lg"
                : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="p-2 rounded-lg border border-secondary-200 dark:border-secondary-700 disabled:opacity-30 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
      >
        <ChevronRight size={20} className="dark:text-white" />
      </button>
    </div>
  );
}