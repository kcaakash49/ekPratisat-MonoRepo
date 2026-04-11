"use client";

import { useEffect, useState } from "react";
import { Menu, X, Heart, Home, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@repo/ui/button";
import { ToggleTheme } from "@repo/components/toggleTheme";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@repo/query-hook";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Navbar = () => {
  console.log("Rendering Navbar");
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: user, isLoading } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        queryClient.clear();
        toast.success("Logged out");
        setShowDropdown(false);
      }
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-300">

      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between">

        {/* Left Section: Logo */}
        <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
          <Image
            src="/logofinal.webp"
            alt="Ek Pratisat Logo"
            width={160}
            height={60}
            className="w-32 md:w-40 lg:w-44"
          />
        </Link>

        {/* Right Section: Desktop Links & Auth */}
        <div className="hidden md:flex items-center lg:gap-8 md:gap-4">

          {/* Main Links */}
          <div className="flex items-center lg:gap-6 md:gap-4 mr-2">
            {["Properties", "About", "Services", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors whitespace-nowrap"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Action Area */}
          <div className="flex items-center lg:gap-4 md:gap-3 border-l pl-4 lg:pl-8 border-gray-200 dark:border-gray-700">
            <ToggleTheme />

            {/* <Button className="hidden lg:flex bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white shadow-lg shadow-yellow-600/20 px-5">
              List Property
            </Button> */}
            <Button className="flex bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white shadow-lg shadow-yellow-600/20 px-3 lg:px-5 transition-all" onClick={() => router.push("/user/add-property")}>
              {/* Show just "List" on medium screens, "List Property" on large */}
              <span className="md:hidden lg:inline">List Property</span>
              <span className="hidden md:inline lg:hidden">Create</span>

              {/* Optional: Add a small plus icon for extra clarity on small screens */}
              <Home className="ml-1 lg:ml-2 h-4 w-4 lg:block" />
            </Button>

            {/* Auth Logic */}
            {(!isLoading && mounted)&& (
              user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-1 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  >
                    {user.profileImageUrl ? (
                      <div className="relative h-9 w-9 lg:h-10 lg:w-10 rounded-full overflow-hidden border-2 border-yellow-500 shadow-sm">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}${user.profileImageUrl}`}
                          alt={user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-yellow-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                      <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-20 animate-in fade-in zoom-in duration-200">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-1">
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Account</p>
                          <p className="text-sm font-semibold truncate text-gray-700 dark:text-gray-200">{user.name}</p>
                        </div>
                        <Link href="/my-listings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <Home className="h-4 w-4" /> My Listings
                        </Link>
                        <Link href="/favorites" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <Heart className="h-4 w-4" /> My Favorites
                        </Link>
                        <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                          >
                            <LogOut className="h-4 w-4" /> Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/auth/signin">
                  <Button variant="outline" className="border-yellow-600 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all">
                    Sign In
                  </Button>
                </Link>
              )
            )}
          </div>
        </div>

        {/* Mobile Controls */}

        <div className="flex md:hidden items-center gap-4">

          <ToggleTheme />

          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 dark:text-gray-300">

            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}

          </button>

        </div>

      </div>



      {/* Mobile Menu */}

      {isOpen && (

        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-6 space-y-4 animate-in slide-in-from-top duration-300">

          {["Properties", "About", "Services", "Contact"].map((item) => (

            <Link

              key={item}

              href={`/${item.toLowerCase()}`}

              className="block text-lg font-medium text-gray-600 dark:text-gray-300"

              onClick={() => setIsOpen(false)}

            >

              {item}

            </Link>

          ))}

          <hr className="border-gray-100 dark:border-gray-800" />

          {user ? (

            <div className="space-y-3">

              <Link href="/my-listings" className="block text-sm">My Listings</Link>

              <Link href="/favorites" className="block text-sm">Favorites</Link>

              <button onClick={handleLogout} className="text-red-500 font-medium">Logout</button>

            </div>

          ) : (

            <Link href="/auth/signin" className="block">

              <Button className="w-full bg-yellow-600 dark:bg-yellow-600">Sign In</Button>

            </Link>

          )}

          <Button className="w-full bg-gray-100 dark:bg-gray-800 text-yellow-600 border border-yellow-600">List Property</Button>

        </div>

      )}
    </nav>
  );
};

export default Navbar;