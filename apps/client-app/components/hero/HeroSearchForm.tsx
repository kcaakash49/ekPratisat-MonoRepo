"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import type { PropertyCategory } from "../../data/categories";

type HeroSearchFormProps = {
  categories: PropertyCategory[];
};

const optionClassName = "bg-white text-secondary-950";

export default function HeroSearchForm({ categories }: HeroSearchFormProps) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [type, setType] = useState("sale");
  const [categoryId, setCategoryId] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();
    const query = q.trim();

    if (query) params.set("q", query);
    if (type) params.set("type", type);
    if (categoryId) params.set("c_id", categoryId);

    const queryString = params.toString();
    router.push(queryString ? `/properties?${queryString}` : "/properties");
  };

  return (
    <form
      className="grid max-w-4xl grid-cols-2 items-stretch gap-1.5 rounded-2xl bg-white p-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.18)] ring-1 ring-secondary-200/80 transition-colors duration-300 sm:p-2 md:max-xl:grid-cols-[minmax(0,1.25fr)_minmax(120px,0.62fr)_minmax(140px,0.7fr)_minmax(132px,0.58fr)]"
      onSubmit={handleSubmit}
    >
      <div className="relative col-span-2 flex items-center md:max-xl:col-span-1">
        <Search className="absolute left-4 h-5 w-5 text-secondary-400" />
        <input
          type="text"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="City, neighborhood, or ZIP"
          className="w-full bg-transparent py-2.5 pl-11 pr-3 text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none min-[390px]:py-3 sm:py-3 sm:pl-12 sm:pr-4 sm:text-base lg:py-3.5"
        />
      </div>

      <div className="col-span-1 flex items-center">
        <div className="relative w-full">
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="w-full cursor-pointer appearance-none bg-transparent py-2.5 pl-4 pr-9 font-medium text-secondary-700 transition-colors hover:text-gold-600 focus:outline-none min-[390px]:py-3 sm:py-3 lg:py-3.5"
            aria-label="Listing type"
          >
            <option className={optionClassName} value="sale">Buy</option>
            <option className={optionClassName} value="rent">Rent</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
        </div>
      </div>

      <div className="col-span-1 flex items-center">
        <div className="relative w-full">
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="w-full cursor-pointer appearance-none bg-transparent py-2.5 pl-4 pr-9 font-medium text-secondary-700 transition-colors hover:text-gold-600 focus:outline-none min-[390px]:py-3 sm:py-3 lg:py-3.5"
            aria-label="Property type"
          >
            <option className={optionClassName} value="">All Types</option>
            {categories.map((category) => (
              <option className={optionClassName} key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
        </div>
      </div>

      <button
        type="submit"
        className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-gold-gradient px-8 py-2.5 text-base font-bold text-secondary-950 shadow-lg shadow-gold-800/20 transition-all hover:bg-gold-gradient-hover min-[390px]:py-3 sm:py-3 sm:text-lg md:max-xl:col-span-1 md:max-xl:px-5 md:max-xl:text-base lg:py-3.5"
      >
        <Search className="h-5 w-5" />
        <span>Search</span>
      </button>
    </form>
  );
}
