"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Currency", href: "/currencyExchangeRate" },
    { name: "Gold & Silver", href: "/goldRate" },
    { name: "FD Rates", href: "/fdRate" },
    { name: "NEPSE Data", href: "/nepseData" },
    { name: "AGM", href: "/agm" },
    
  ];

  return (
    <nav className="w-full border-b bg-white shadow-sm ">
      <div className="max-w-6xl mx-auto flex justify-center items-center p-5 ">
        
        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                pathname === item.href
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

      </div>
    </nav>
  );
}