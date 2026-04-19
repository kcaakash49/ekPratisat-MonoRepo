"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, MapPin, Home, Zap } from "lucide-react";

interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export default function HomeHeroSearch({ categories }: { categories: Category[] }) {
  const router = useRouter();

  // Local state for the "Launch"
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [c_id, setC_id] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (type) params.set("type", type);
    if (c_id) params.set("c_id", c_id);

    // Redirect to properties page with these params
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Search Container */}
      <div className="bg-white/90 dark:bg-secondary-800/90 backdrop-blur-md p-1 md:p-2 rounded-3xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-2 border border-white/20">
        
        {/* Keyword/Location Input */}
        <div className="relative flex-[1.5] flex items-center md:border-r border-secondary-200 dark:border-secondary-700 group">
          <MapPin className="absolute left-5 h-5 w-5 text-gold group-focus-within:scale-110 transition-transform" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="City, neighborhood, or title..."
            className="w-full pl-14 pr-4 py-5 bg-transparent text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none text-base font-medium"
          />
        </div>

        {/* Type Selector (Buy/Rent) */}
        <div className="flex flex-1 items-center md:border-r border-secondary-200 dark:border-secondary-700">
          <div className="relative w-full px-4">
            <div className="flex items-center gap-2 mb-1 md:hidden">
                <Zap size={14} className="text-gold" />
                <span className="text-[10px] uppercase font-bold text-secondary-400">Transaction</span>
            </div>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full appearance-none bg-transparent text-secondary-400 dark:text-white focus:outline-none cursor-pointer font-bold hover:text-gold transition-colors py-4 md:py-0 px-2"
            >
              <option value="" hidden className="dark:bg-secondary-800">Type</option>
              <option value="sale" className="dark:bg-secondary-800">Sale</option>
              <option value="rent" className="dark:bg-secondary-800">Rent</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-secondary-400" />
          </div>
        </div>

        {/* Category Selector */}
        <div className="flex flex-1 items-center">
          <div className="relative w-full px-4">
            <div className="flex items-center gap-2 mb-1 md:hidden">
                <Home size={14} className="text-gold" />
                <span className="text-[10px] uppercase font-bold text-secondary-400">Property Type</span>
            </div>
            <select 
              value={c_id}
              onChange={(e) => setC_id(e.target.value)}
              className="w-full appearance-none bg-transparent text-secondary-400 dark:text-white focus:outline-none cursor-pointer font-bold hover:text-gold transition-colors py-4 md:py-0 px-2"
            >
              <option value="" hidden className="dark:bg-secondary-800">Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="dark:bg-secondary-800">
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-secondary-400" />
          </div>
        </div>

        {/* SEARCH BUTTON */}
        <button 
          onClick={handleSearch}
          className="bg-gold-gradient hover:shadow-gold/40 transition-all text-white rounded-2xl md:rounded-full px-10 py-5 flex items-center justify-center gap-3 font-black text-lg shadow-xl active:scale-95"
        >
          <Search className="h-6 w-6 stroke-[3px]" />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
}