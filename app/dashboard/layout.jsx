"use client";

import Sidebar from "@/app/components/Sidebar";
import { SessionProvider } from "next-auth/react";
import Navbar from "../components/Navbar";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/sidebar";

// import Sidebar from "./components/Sidebar";
// import Navbar from "./components/Navbar";
export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <Navbar />
      <main className="pt-20 pl-20 md:pl-25 pr-6 transition-all duration-300">
        <SessionProvider>{children}</SessionProvider>
      </main>
    </div>
  );
}
