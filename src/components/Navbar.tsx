"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Designer", href: "/designer" },
  { name: "Order", href: "/order" },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <div className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link href="/" className="text-xl font-bold">
        Matrix Print Lab
      </Link>

      <div className="flex gap-6">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`hover:underline ${
              pathname === item.href ? "underline" : "text-gray-300"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
