"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL =
  "https://api.abcz.workers.dev/api/bazardor/products";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log("Products:", data);
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#f8faf7] text-gray-900">

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4">

          <div className="flex items-center justify-between py-4">
            <Link href="/" className="text-2xl font-bold text-green-700">
              🛒 বাজার দর
              <span className="block text-xs font-normal text-gray-500">
                ২৪ আশ্বিন ১৪৩৩
              </span>
            </Link>

            <div className="flex gap-2">
              <Link
                href="/signin"
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
              >
                সাইন আপ
              </Link>
            </div>
          </div>

          {/* Category links */}
          <nav className="flex gap-6 overflow-x-auto pb-3 text-sm">
            <Link href="/" className="font-semibold text-green-700">
              সব পণ্য
            </Link>
            <Link href="/category/chal" className="whitespace-nowrap">
              চাল
            </Link>
            <Link href="/category/dal" className="whitespace-nowrap">
              ডাল
            </Link>
            <Link href="/category/sobji" className="whitespace-nowrap">
              সবজি
            </Link>
            <Link href="/category/mach" className="whitespace-nowrap">
              মাছ
            </Link>
            <Link href="/category/mangsho" className="whitespace-nowrap">
              মাংস
            </Link>
          </nav>
        </div>

        {/* Price ticker */}
        <div className="overflow-hidden bg-green-700 py-2 text-sm text-white">
          <div className="animate-pulse whitespace-nowrap text-center">
            🥔 আলু ৬০ টাকা/kg ▲ ২.১% &nbsp;&nbsp; • &nbsp;&nbsp;
            🧅 পেঁয়াজ ৯০ টাকা/kg ▼ ১.৮% &nbsp;&nbsp; • &nbsp;&nbsp;
            🍚 চাল ৭৫ টাকা/kg ▲ ১.২% &nbsp;&nbsp; • &nbsp;&nbsp;
            🐟 ইলিশ ১৮৫০ টাকা/kg ▼ ২.৯%
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2">

        <div>
          <p className="mb-3 font-semibold text-green-600">
            📊 আজকের বাজারের আপডেট
          </p>

          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            বাজারের দাম
            <span className="block text-green-600">
              এক নজরে জানুন
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-gray-600">
            চাল, ডাল, সবজি, মাছ ও নিত্যপ্রয়োজনীয় পণ্যের
            আজকের বাজারদর সহজেই দেখুন।
          </p>

          <a
            href="#সব-পণ্য"
            className="mt-7 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            সব পণ্য দেখুন →
          </a>
        </div>

        <div className="flex min-h-64 items-center justify-center rounded-3xl bg-green-100 text-8xl">
          🛒🥬🥔
        </div>

      </section>

      {/* Products */}
      <section id="সব-পণ্য" className="mx-auto max-w-6xl px-4 py-12">

        <div className="mb-8">
          <p className="font-semibold text-green-600">
            বাজারের তালিকা
          </p>

          <h2 className="mt-1 text-3xl font-bold">
            সব পণ্য
          </h2>

          <p className="mt-2 text-gray-500">
            আজকের সকল পণ্যের বর্তমান দাম দেখুন
          </p>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="text-5xl">
                    {product.emoji || "🛒"}
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                    বাজারদর
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  {product.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  প্রতি {product.unit || "কেজি"}
                </p>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-gray-500">
                      আজকের দাম
                    </p>

                    <p className="text-xl font-bold text-green-700">
                      {product.price || "—"} টাকা
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                    — ০.০%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </section>

      {/* Footer */}
      <footer className="mt-12 border-t bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>
            বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>

          <p>
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </p>
        </div>
      </footer>

    </main>
  );
}