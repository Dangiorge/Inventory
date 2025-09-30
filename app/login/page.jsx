"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md space-y-6 transform transition duration-500 hover:scale-105"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 float">
          Login
        </h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition transform hover:scale-105">
          Sign In
        </button>

        <p className="text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}
