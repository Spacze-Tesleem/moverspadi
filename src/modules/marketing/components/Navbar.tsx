"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

import Link from "next/link";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Become a mover", href: "/become-a-mover" },
  { name: "Company", href: "/company" },
];


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Close mobile menu on resize to prevent layout glitches
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
              Movers<span className="text-green-600">Padi</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-green-600"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center gap-4 md:flex">
            <button onClick={() => router.push("/auth/role?mode=login")} className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Login
            </button>
            <button onClick={() => router.push("/auth/role?mode=signup")} className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 active:scale-95">
              Sign up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100 border-b" : "max-h-0 opacity-0 overflow-hidden"
        } bg-white`}
      >
        <div className="space-y-1 px-4 pb-6 pt-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-md px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600"
            >
              {link.name}
              <ChevronRight className="h-4 w-4 opacity-50" />
            </Link>
          ))}
          <div className="mt-4 grid grid-cols-2 gap-4 px-3">
            <button onClick={() => router.push("/auth/role?mode=login")} className="flex justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
              Login
            </button>
            <button onClick={() => router.push("/auth/role?mode=signup")} className="flex justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 cursor-pointer">
              Sign up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}