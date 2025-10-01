"use client";

import { useState } from "react";
import {
  FiHome,
  FiUser,
  FiSettings,
  FiChevronDown,
  FiLogOut,
} from "react-icons/fi";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const [hovered, setHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const menu = [
    { icon: <FiHome />, label: "Home", href: "/dashboard" },
    { icon: <FiUser />, label: "Users", href: "/dashboard/users" },
    {
      icon: <FiSettings />,
      label: "Invetory",
      children: [
        { label: "Items", href: "/dashboard/inventory/items" },
        { label: "Category", href: "/dashboard/inventory/category" },
      ],
    },
    {
      icon: <FiSettings />,
      label: "Tasks",
      children: [
        { label: "board", href: "/dashboard/tasktraker/board" },
        { label: "Security", href: "/dashboard/settings/security" },
      ],
    },
    {
      icon: <FiSettings />,
      label: "Settings",
      children: [
        { label: "Profile", href: "/dashboard/settings/profile" },
        { label: "Add User", href: "/dashboard/settings/createuser" },
      ],
    },
  ];

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-white border-r shadow-md fixed top-16 left-0 h-full transition-all duration-300 z-20 
        ${hovered ? "w-64" : "w-20"}`}
    >
      <nav className="mt-4 space-y-2">
        {menu.map((item, idx) => (
          <div key={idx}>
            {item.children ? (
              <div>
                <button
                  onClick={() =>
                    item.children &&
                    setDropdownOpen(dropdownOpen === idx ? null : idx)
                  }
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 transition"
                >
                  <span className="text-xl">{item.icon}</span>
                  {hovered && <span>{item.label}</span>}
                  {item.children && hovered && (
                    <FiChevronDown
                      className={`ml-auto transition-transform ${
                        dropdownOpen === idx ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  )}
                </button>
                {item.children && dropdownOpen === idx && hovered && (
                  <div className="ml-12 flex flex-col space-y-1">
                    {item.children.map((child, i) => (
                      <Link
                        key={i}
                        href={child.href}
                        className="px-3 py-2 rounded hover:bg-gray-100 text-sm"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <a
                  href={item.href}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 transition"
                >
                  <span className="text-xl">{item.icon}</span>
                  {hovered && <span>{item.label}</span>}
                  {item.children && hovered && (
                    <FiChevronDown
                      className={`ml-auto transition-transform ${
                        dropdownOpen === idx ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  )}
                </a>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* <div className="absolute bottom-4 left-0 w-full">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 w-full"
        >
          <FiLogOut className="text-xl" />
          {hovered && <span>Logout</span>}
        </button>
      </div> */}
    </aside>
  );
}
