"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const { data: session } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) redirect("/login");

  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        Welcome {session.user.email}, role: {session.user.role}
      </p>
    </div>
  );
}
