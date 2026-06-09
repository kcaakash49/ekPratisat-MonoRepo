"use client";

import { BaseProvider } from "@repo/shared-provider";


export function AdminProviders({ children }: {children: React.ReactNode}){
    return (
        <BaseProvider themeProps={{ forcedTheme: "light", defaultTheme: "light", enableSystem: false }}>
            {children}
        </BaseProvider>
    )
}