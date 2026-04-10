"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@repo/ui/button";
import { ToggleTheme } from "@repo/components/toggleTheme";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-secondary-50 text-white dark:bg-gray-800 dark:text-white backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
           <Image src="/logofinal.webp" alt="Logo" width={180} height={80} />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {["Properties", "About", "Services", "Contact"].map((item) => (
            <a
              key={item}
              href={`${item.toLowerCase()}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-gray-600 dark:text-gray-300 dark:hover:text-white"
            >
              {item}
            </a>
          ))}
          <Button className="bg-yellow-600 hover:bg-yellow-800 dark:bg-yellow-600 dark:hover:bg-yellow-800 text-accent-foreground hover:opacity-90 transition-opacity px-6">
            List Property
          </Button>
          <ToggleTheme />
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-3">
          {["Properties", "About", "Services", "Contact"].map((item) => (
            <a
              key={item}
              href={`${item.toLowerCase()}`}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </a>
          ))}
          <Button variant="ghost" className="bg-yellow-100 dark:bg-yellow-200">List Property</Button>
          <ToggleTheme/>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
