"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (password.length < 8) {
      setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        setError(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
        setLoading(false);
        return;
      }

      console.log("Signup success:", data);

      alert("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");

      router.push("/signin");
    } catch (err) {
      console.error(err);
      setError("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="text-4xl">🛒</div>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            সাইন আপ
          </h1>

          <p className="mt-2 text-gray-500">
            বাজার দর অ্যাকাউন্ট তৈরি করুন
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              নাম
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              ইমেইল
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              পাসওয়ার্ড
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              required
              minLength={8}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "সাইন আপ"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          আগে থেকেই অ্যাকাউন্ট আছে?{" "}
          <a
            href="/signin"
            className="font-semibold text-green-600 hover:underline"
          >
            সাইন ইন করুন
          </a>
        </p>
      </div>
    </main>
  );
}