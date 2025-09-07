"use client";

import { Search } from "lucide-react";


import { useState } from "react";

export const SearchBox = () => {
    const [search, setSearch] = useState("");



    
   
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            console.log(search);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto px-2 sm:px-4">
            <div className="relative">
                <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 dark:border-gray-600 py-2 sm:py-3 px-4 sm:px-5 pr-10 sm:pr-14 shadow-md focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
                    placeholder="Search location"
                    value={search}
                    onKeyDown={handleKeyPress}
                    name="search"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full p-1 sm:p-2 cursor-pointer transition-colors duration-200"
                    disabled={search.trim() === ""}
                >
                    <Search size={18} className="sm:w-5 sm:h-5" />
                </button>
            </div>
        </div>
    )
}