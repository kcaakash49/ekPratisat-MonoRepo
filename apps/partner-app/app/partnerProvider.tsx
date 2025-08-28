"use client";

import { BaseProvider } from "@repo/shared-provider";


export function PartnerProvider({ children }: {children: React.ReactNode}){
    return (
        <BaseProvider>
            {children}
        </BaseProvider>
    )
}