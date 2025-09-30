"use client";

import { useState } from "react";
import { FiLogOut, FiUser } from "react-icons/fi";
import { signOut } from "next-auth/react";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b shadow flex items-center justify-between px-6 z-30">
      {/* Logo */}
      <div className="text-xl font-bold text-blue-600">MyAdmin</div>

      {/* Profile */}
      <div className="relative">
        <button
          className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span className="text-lg font-semibold">A</span>
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden">
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full">
              <FiUser /> Profile
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
