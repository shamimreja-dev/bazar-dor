"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-4">

      <div className="max-w-lg text-center">

        <div className="text-8xl">
          🛒
        </div>

        <h1 className="mt-6 text-5xl font-extrabold text-gray-900">
          404
        </h1>

        <h2 className="mt-3 text-2xl font-bold text-gray-900">
          পেজটি পাওয়া যায়নি
        </h2>

        <p className="mt-3 leading-7 text-gray-500">
          আপনি যে পেজটি খুঁজছেন সেটি হয়তো সরানো হয়েছে,
          অথবা ঠিকানাটি ভুল হয়েছে।
        </p>

        <Link
          href="/"
          className="mt-7 inline-block rounded-xl bg-green-600 px-7 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          🏠 হোমে ফিরে যান
        </Link>

      </div>

    </main>
  );
}