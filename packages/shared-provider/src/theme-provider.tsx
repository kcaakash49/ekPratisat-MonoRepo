"use client";

import { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React from 'react';

export function ThemeProvider({children, ...props} : ThemeProviderProps){
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            storageKey="theme"
            disableTransitionOnChange={false}
            {...props}    
        >
            {children}
        </NextThemesProvider>
    )
}