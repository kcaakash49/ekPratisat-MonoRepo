"use client";


import React from "react";
import { ThemeProvider } from "./theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export function BaseProvider({ children }: { children: React.ReactNode }) {

    return (
        
            <ThemeProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </ThemeProvider>

    )
}