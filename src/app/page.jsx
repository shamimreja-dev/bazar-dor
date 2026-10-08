"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL =
  "https://api.abcz.workers.dev/api/bazardor/products";

const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

function banglaNumber(value) {
  if (value === null || value === undefined) {
    return "০";
  }

  return String(value).replace(/\d/g, (digit) => banglaDigits[digit]);
}

function getPrice(product) {
  return Number(product?.today ?? 0);
}

function getChange(product) {
  return Number(product?.change?.pct ?? 0);
}

function ProductCard({ product }) {
  const price = getPrice(product);
  const change = getChange(product);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Product Image */}
      <div className="flex h-32 items-center justify-center rounded-xl bg-green-50">
        <span className="text-7xl transition group-hover:scale-110">
          {product.image || "🛒"}
        </span>
      </div>

      {/* Product Information */}
      <div className="mt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900">
            {product.nameBn}
          </h3>

          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
            {product.categoryNameBn}
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-xs text-gray-500">
              আজকের দাম
            </p>

            <p className="text-xl font-bold text-green-700">
              {banglaNumber(price)} টাকা
              <span className="ml-1 text-sm font-normal text-gray-500">
                /{product.unit || "kg"}
              </span>
            </p>
          </div>

          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              change > 0
                ? "bg-red-100 text-red-600"
                : change < 0
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {change > 0
              ? `▲ ${banglaNumber(Math.abs(change))}%`
              : change < 0
              ? `▼ ${banglaNumber(Math.abs(change))}%`
              : "— ০%"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Products fetch failed");
        }

        const data = await response.json();

        console.log("Bazar Dor products:", data);

        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Product fetch error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  /* দাম বেড়েছে */
  const risers = [...products]
    .sort((a, b) => getChange(b) - getChange(a))
    .filter((product) => getChange(product) > 0)
    .slice(0, 6);

  /* দাম কমেছে */
  const fallers = [...products]
    .sort((a, b) => getChange(a) - getChange(b))
    .filter((product) => getChange(product) < 0)
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ================================================= */}
      {/* PRICE TICKER */}
      {/* ================================================= */}

      <section className="overflow-hidden border-y border-green-100 bg-green-50">
        <div className="flex h-12 items-center overflow-hidden">

          {loading ? (
            <div className="px-4 text-sm text-gray-500">
              বাজারের দাম লোড হচ্ছে...
            </div>
          ) : products.length === 0 ? (
            <div className="px-4 text-sm text-gray-500">
              কোনো পণ্যের তথ্য পাওয়া যায়নি।
            </div>
          ) : (
            <div className="ticker-track flex min-w-max items-center">

              {[...products, ...products].map(
                (product, index) => {
                  const price = getPrice(product);
                  const change = getChange(product);

                  return (
                    <div
                      key={`${product.id}-${index}`}
                      className="mx-4 flex shrink-0 items-center gap-2 whitespace-nowrap text-sm"
                    >
                      {/* Emoji */}
                      <span className="text-lg">
                        {product.image || "🛒"}
                      </span>

                      {/* Name */}
                      <span className="font-semibold text-gray-800">
                        {product.nameBn}
                      </span>

                      {/* Price */}
                      <span className="font-bold text-green-700">
                        {banglaNumber(price)} টাকা/
                        {product.unit || "kg"}
                      </span>

                      {/* Change */}
                      <span
                        className={`font-semibold ${
                          change > 0
                            ? "text-red-600"
                            : change < 0
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {change > 0
                          ? `▲ ${banglaNumber(
                              Math.abs(change)
                            )}%`
                          : change < 0
                          ? `▼ ${banglaNumber(
                              Math.abs(change)
                            )}%`
                          : "— ০%"}
                      </span>

                      <span className="ml-2 text-gray-300">
                        •
                      </span>
                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>
      </section>

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">

          {/* Hero Left */}
          <div>
            <p className="mb-4 inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              🛒 প্রতিদিনের বাজারের দাম
            </p>

            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 md:text-6xl">
              আজকের বাজার দর
              <br />

              <span className="text-green-600">
                এক নজরে জানুন
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 md:text-lg">
              চাল, ডাল, তেল, সবজি, মসলা সহ প্রয়োজনীয়
              পণ্যের আজকের বাজারদর সহজেই দেখুন।
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#সব-পণ্য"
                className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                সব পণ্য দেখুন
              </a>

              <Link
                href="/category/chal"
                className="rounded-xl border border-green-600 px-6 py-3 font-semibold text-green-700 transition hover:bg-green-50"
              >
                চালের দাম
              </Link>
            </div>
          </div>

          {/* Hero Right */}
          <div className="flex justify-center">
            <div className="flex h-72 w-full max-w-lg items-center justify-center rounded-3xl bg-green-50 shadow-inner md:h-96">
              <span className="text-[150px] md:text-[200px]">
                🛒
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================= */}
      {/* PRICE INCREASE */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-12">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            আজ দাম বেড়েছে{" "}
            <span className="text-red-500">▲</span>
          </h2>

          <p className="mt-2 text-gray-500">
            যেসব পণ্যের দাম আজ বেড়েছে
          </p>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        ) : risers.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-gray-500">
            আজ কোনো পণ্যের দাম বাড়েনি।
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {risers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

      </section>

      {/* ================================================= */}
      {/* PRICE DECREASE */}
      {/* ================================================= */}

      <section className="bg-white py-12">

        <div className="mx-auto max-w-7xl px-4">

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              আজ দাম কমেছে{" "}
              <span className="text-green-500">▼</span>
            </h2>

            <p className="mt-2 text-gray-500">
              যেসব পণ্যের দাম আজ কমেছে
            </p>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-2xl bg-gray-200"
                />
              ))}
            </div>
          ) : fallers.length === 0 ? (
            <div className="rounded-2xl bg-gray-50 p-8 text-center text-gray-500">
              আজ কোনো পণ্যের দাম কমেনি।
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {fallers.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}

        </div>

      </section>

      {/* ================================================= */}
      {/* ALL PRODUCTS */}
      {/* ================================================= */}

      <section
        id="সব-পণ্য"
        className="mx-auto max-w-7xl px-4 py-12"
      >

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            সব পণ্য
          </h2>

          <p className="mt-2 text-gray-500">
            প্রয়োজনীয় সব পণ্যের আজকের বাজারদর
          </p>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            <p className="text-gray-500">
              কোনো পণ্যের তথ্য পাওয়া যায়নি।
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

      </section>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <footer className="border-t bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center">

          <p className="font-semibold">
            বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>

          <p className="mt-3 text-sm text-gray-400">
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে
            পরিবর্তিত হয়।
          </p>

          <p className="mt-5 text-sm text-gray-500">
            © 2026 Bazar Dor. All rights reserved.
          </p>

        </div>
      </footer>

      {/* ================================================= */}
      {/* TICKER ANIMATION */}
      {/* ================================================= */}

      <style jsx>{`
        .ticker-track {
          animation: ticker 60s linear infinite;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }

        @keyframes ticker {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>

    </main>
  );
}