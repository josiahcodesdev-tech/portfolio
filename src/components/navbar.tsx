"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHome && !scrolled
          ? "bg-transparent"
          : scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <Link
            href="/"
            className={`font-display text-2xl font-bold ${isHome && !scrolled ? "text-white" : "text-navy"}`}
          >
            Josiah <span className="text-gold">Mwangi</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-gold ${
                  pathname === link.href
                    ? "text-gold"
                    : isHome && !scrolled
                      ? "text-white/90"
                      : "text-dark-text"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact">
              <Button className="bg-gold text-navy font-semibold hover:bg-gold-hover rounded-full px-6 py-2.5 text-sm cursor-pointer shadow-sm">
                Book a Consultation
              </Button>
            </Link>
          </div>

          <button
            className={`lg:hidden transition-colors hover:text-gold ${isHome && !scrolled ? "text-white" : "text-navy"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-3 px-3 text-sm font-medium rounded-lg transition-colors hover:text-gold hover:bg-light-gray ${
                  pathname === link.href ? "text-gold bg-gold-light" : "text-dark-text"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link href="/contact" onClick={() => setMobileOpen(false)}>
                <Button className="bg-gold text-navy font-semibold hover:bg-gold-hover rounded-full px-6 py-2.5 text-sm w-full cursor-pointer">
                  Book a Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
