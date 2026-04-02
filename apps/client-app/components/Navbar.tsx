"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@repo/ui/button";
import { ToggleTheme } from "@repo/components/toggleTheme";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-white backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Image src="/logofinal.webp" alt="Logo" width={180} height={80} />

        <div className="hidden md:flex items-center gap-8">
          {["Properties", "About", "Services", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item}
            </a>
          ))}
          <Button className="bg-gradient-gold text-accent-foreground hover:opacity-90 transition-opacity px-6">
            List Property
          </Button>
          <ToggleTheme />
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-3">
          {["Properties", "About", "Services", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </a>
          ))}
          <Button variant="ghost">List Property</Button>
          <ToggleTheme/>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
