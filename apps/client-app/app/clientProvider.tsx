

"use client";

import { BaseProvider } from "@repo/shared-provider";


export function ClientProvider({ children }: {children: React.ReactNode}){
    return (
        <BaseProvider>
            {children}
        </BaseProvider>
    )
}