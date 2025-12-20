
"use client"

import { useFetchListings } from "@repo/query-hook";
import AnimateLoader from "@repo/ui/animateLoader";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import PropertyTableDropdown from "./ListingsTabelDropdown";


export default function ListProperties(){
    const [page, setPage] = useState(1);
    const { data, isLoading, isError,error} = useFetchListings({page, pageSize:20})

    if (isLoading) {
        return (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <AnimateLoader />
          </div>
        );
      }
  
    if (isError) {
        toast.error("Opps! Something went wrong")
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center">
              <p className="text-red-500 text-lg mb-4">Error loading listings</p>
              <p className="text-secondary-600 dark:text-secondary-400">
                {error.message || "Opps! Something went wrong"}
              </p>
            </div>
          </div>
        )
    }
    const listings = data?.data || [];
    const meta = data?.meta || {total:0,page:1,pageSize:10,totalPages:1}

    if(listings && listings?.length === 0){
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full flex items-center justify-center shadow-inner">
                <Plus className="w-10 h-10" />
              </div>
    
              <h2 className="mt-6 text-2xl font-semibold text-secondary-800 dark:text-secondary-200">
                No Listings found
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 max-w-sm mt-2">
                {"You haven’t added any agents yet. Get started by adding your first one!"}
    
              </p>
            </motion.div>
    
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/add-property"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-md font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Your First Property Listing
              </Link>
            </motion.div>
          </div>
        )
    }
    return (
        <>
            <PropertyTableDropdown listings={listings} meta={meta} onPageChange={setPage}/>
        </>
    )
}