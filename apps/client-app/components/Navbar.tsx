"use client";

import React, { useEffect, useState } from "react";
import { SearchBox } from "./SearchBox";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ProfileDropDown from "./dropdowns/ProfileDropDown";
import BrowseCategories from "./dropdowns/BrowseCategories";
import { Button } from "@repo/ui/button";
import { ToggleTheme } from "@repo/components/toggleTheme";

const Navbar = () => {
    const pathname = usePathname();
    const { data:session } = useSession();
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    const isHomePage = pathname === "/";

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-center justify-between px-4 sm:px-8 md:px-20 py-3">
                {/* Logo Section */}
                <div className="flex-shrink-0">
                    <Link href="/">
                        <Image
                            src="/logofinal.webp"
                            alt="Logo"
                            width={160}
                            height={96}
                            className="h-12 w-20 sm:h-20 sm:w-28 md:h-24 md:w-40 transition-all duration-300"
                        />
                    </Link>
                </div>

                {/* Safe conditional rendering */}
                {isMounted && !isHomePage && (
                    <div className="hidden sm:flex justify-center px-4">
                        <SearchBox />
                    </div>
                )}

                <div className="flex-shrink-0 flex items-center gap-2">
                    <ToggleTheme/>
                    <BrowseCategories/>
                    {
                        session?.user ? <ProfileDropDown/> : <Button onClick={() => router.push("/api/auth/signin")} variant="destructive">Login</Button>
                    }
                </div>

                {/* Safe conditional rendering */}
                {isMounted && !isHomePage && (
                    <div className="w-full sm:hidden mt-2">
                        <SearchBox />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;