"use client";

import { useState, useEffect } from "react";
import { AddPropertyForm } from "@repo/components/addPropertyForm";
import { useUser } from "@repo/query-hook";
import Loading from "../../loading";

export default function AddProperty() {
    const { data: user, isLoading } = useUser();
    const [isMounted, setIsMounted] = useState(false);

    // Ensure we only switch away from the loading state after the client has hydrated
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 1. Show loading if we are server-rendering (!isMounted) OR fetching data (isLoading)
    if (!isMounted || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading />
            </div>
        );
    }

    // 2. Handle unauthorized state safely on the client
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-8 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-red-600 dark:text-red-400 font-bold">Unauthorized</p>
                    <p className="text-sm text-gray-500">Please log in as an admin to access this page.</p>
                </div>
            </div>
        );
    }

    const userRole = user?.role;

    return (
        <div className="p-4"> 
            <AddPropertyForm user={userRole} />
        </div>
    );
}