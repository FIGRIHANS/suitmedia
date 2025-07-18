'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Work", href: "/work" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Ideas", href: "/ideas" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`bg-[#FF5A00] sticky top-0 z-50 transition-shadow ${
          scrolled ? "shadow-lg" : ""
        } hidden md:flex`}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-8 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/suitmedia-logo.png"
              alt="Logo Suitmedia"
              className="w-18 h-18 object-contain"
            />
          </div>
          <ul className="flex gap-8 text-white font-medium relative">
            {menu.map((item) => (
              <li key={item.name} className="relative">
                <Link
                  href={item.href}
                  className="px-2 py-1 transition-colors"
                >
                  {item.name}
                </Link>
                {pathname === item.href && (
                  <span className="absolute left-0 right-0 -bottom-1 h-1 bg-white rounded transition-all"></span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile/Tablet Navbar */}
      <nav className="bg-[#FF5A00] sticky top-0 z-50 flex md:hidden items-center px-4 py-3 justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/suitmedia-logo.png"
            alt="Logo Suitmedia"
            className="w-18 h-18 object-contain"
          />
        </div>
        <button
          className="text-white text-2xl"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          &#9776;
        </button>
        {/* Sidebar Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex">
            <div className="bg-[#FF5A00] w-64 h-full p-6 flex flex-col gap-6">
              <button
                className="text-white text-2xl self-end mb-4"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
              >
                &times;
              </button>
              <ul className="flex flex-col gap-4 text-white font-medium">
                {menu.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`block px-2 py-1 transition-colors ${
                        pathname === item.href ? "border-b-2 border-white" : ""
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="flex-1"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar overlay"
            />
          </div>
        )}
      </nav>
    </>
  );
}