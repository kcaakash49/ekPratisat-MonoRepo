"use client";


import React from "react";
import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider } from "./theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export function BaseProvider({ children, themeProps }: { children: React.ReactNode; themeProps?: Partial<ThemeProviderProps> }) {

    return (

            <ThemeProvider {...themeProps}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </ThemeProvider>

    )
}