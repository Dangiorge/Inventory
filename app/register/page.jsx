"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    if (res.ok) {
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setMessage(data.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-600 to-pink-500">
      <form
        onSubmit={handleRegister}
        className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md space-y-6 transform transition duration-500 hover:scale-105"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 float">
          Sign Up
        </h1>

        {message && <p className="text-center text-red-500">{message}</p>}

        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            required
          />
        </div>

        <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl font-bold transition transform hover:scale-105">
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-purple-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
