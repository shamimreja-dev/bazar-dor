
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL =
  "https://api.abcz.workers.dev/api/bazardor/products";

const banglaDigits = [
  "০", "১", "২", "৩", "৪",
  "৫", "৬", "৭", "৮", "৯",
];

function banglaNumber(value) {
  if (value === null || value === undefined) {
    return "০";
  }

  return String(value).replace(
    /\d/g,
    (digit) => banglaDigits[Number(digit)]
  );
}

function getPrice(product) {
  return Number(product?.today ?? 0);
}

function getChange(product) {
  return Number(product?.change?.pct ?? 0);
}

function getProductHref(product) {
  const identifier = product?.slug ?? product?.id;

  if (
    identifier === null ||
    identifier === undefined ||
    identifier === ""
  ) {
    return "/product/not-found";
  }

  return `/product/${encodeURIComponent(String(identifier))}`;
}

function ChangeBadge({ change }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
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
  );
}

function ProductCard({ product }) {
  const change = getChange(product);

  return (
    <Link
      href={getProductHref(product)}
      className="group block rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-green-50 text-5xl">
          {product.image || "🛒"}
        </div>

        <ChangeBadge change={change} />
      </div>

      <p className="mt-5 text-sm text-gray-500">
        {product.categoryIcon || "🛒"}{" "}
        {product.categoryNameBn || "পণ্য"}
      </p>

      <h3 className="mt-1 text-lg font-bold text-gray-900 group-hover:text-green-600">
        {product.nameBn || "নাম পাওয়া যায়নি"}
      </h3>

      <div className="mt-4 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-gray-400">
            আজকের দাম
          </p>

          <p className="mt-1 text-2xl font-extrabold text-green-700">
            {banglaNumber(getPrice(product))}
            <span className="ml-1 text-sm font-medium text-gray-500">
              টাকা/{product.unit || "kg"}
            </span>
          </p>
        </div>

        <span className="text-sm font-medium text-green-600">
          বিস্তারিত →
        </span>
      </div>
    </Link>
  );
}

function ProductSkeleton() {
  return (
    <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
  );
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Products fetch failed");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid API response");
        }

        setProducts(data);
      } catch (err) {
        console.error("Products API error:", err);
        setError("পণ্যের তথ্য লোড করতে সমস্যা হয়েছে।");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const risers = [...products]
    .filter((product) => getChange(product) > 0)
    .sort((a, b) => getChange(b) - getChange(a))
    .slice(0, 6);

  const fallers = [...products]
    .filter((product) => getChange(product) < 0)
    .sort((a, b) => getChange(a) - getChange(b))
    .slice(0, 6);

  const tickerProducts =
    products.length > 0
      ? [...products, ...products]
      : [];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* PRICE TICKER */}
      <section className="overflow-hidden border-y border-green-100 bg-green-50">
        <div className="flex h-12 items-center overflow-hidden">
          {loading ? (
            <p className="px-4 text-sm text-gray-500">
              বাজারের দাম লোড হচ্ছে...
            </p>
          ) : error ? (
            <p className="px-4 text-sm text-red-500">
              বাজারের দাম লোড করা যায়নি।
            </p>
          ) : products.length === 0 ? (
            <p className="px-4 text-sm text-gray-500">
              কোনো পণ্য পাওয়া যায়নি।
            </p>
          ) : (
            <div className="ticker-track flex min-w-max items-center">
              {tickerProducts.map((product, index) => {
                const change = getChange(product);

                return (
                  <Link
                    key={`${product.id ?? product.slug ?? product.nameBn}-${index}`}
                    href={getProductHref(product)}
                    aria-label={`${product.nameBn || "পণ্য"}-এর বিস্তারিত দেখুন`}
                    className="flex shrink-0 items-center gap-2 px-6 text-sm transition hover:bg-green-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600"
                  >
                    <span>{product.image || "🛒"}</span>

                    <span className="font-semibold text-gray-800 hover:text-green-700">
                      {product.nameBn || "পণ্য"}
                    </span>

                    <span className="font-bold text-green-700">
                      {banglaNumber(getPrice(product))}{" "}
                      টাকা/{product.unit || "kg"}
                    </span>

                    <span
                      className={
                        change > 0
                          ? "font-bold text-red-500"
                          : change < 0
                          ? "font-bold text-green-600"
                          : "font-bold text-gray-500"
                      }
                    >
                      {change > 0
                        ? `▲ ${banglaNumber(Math.abs(change))}%`
                        : change < 0
                        ? `▼ ${banglaNumber(Math.abs(change))}%`
                        : "— ০%"}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* HERO */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2">
          <div>
            <span className="mb-4 inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              🛒 প্রতিদিনের বাজারের দাম
            </span>

            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
              আজকের বাজারদর{" "}
              <span className="text-green-600">
                এক নজরে জানুন
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 md:text-lg">
              চাল, ডাল, তেল, সবজি, মসলা সহ
              প্রয়োজনীয় পণ্যের আজকের বাজারদর
              সহজেই দেখুন।
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
                className="rounded-xl border border-green-200 bg-green-50 px-6 py-3 font-semibold text-green-700 transition hover:bg-green-100"
              >
                🍚 চালের দাম
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-green-50 p-3">
              <img
                src="/bazar-hero.png"
                alt="বাজার দর"
                className="h-72 w-full rounded-2xl object-contain md:h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* RISERS */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            আজ দাম <span className="text-red-500">বেড়েছে ▲</span>
          </h2>
          <p className="mt-2 text-gray-500">
            যেসব পণ্যের দাম আজ বেড়েছে
          </p>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <p className="rounded-2xl bg-white p-8 text-center text-red-500">
            {error}
          </p>
        ) : risers.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {risers.map((product, index) => (
              <ProductCard
                key={product.id ?? product.slug ?? index}
                product={product}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-white p-8 text-center text-gray-500">
            আজ দাম বাড়া কোনো পণ্য পাওয়া যায়নি।
          </p>
        )}
      </section>

      {/* FALLERS */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              আজ দাম <span className="text-green-500">কমেছে ▼</span>
            </h2>
            <p className="mt-2 text-gray-500">
              যেসব পণ্যের দাম আজ কমেছে
            </p>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <p className="rounded-2xl bg-gray-50 p-8 text-center text-red-500">
              {error}
            </p>
          ) : fallers.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {fallers.map((product, index) => (
                <ProductCard
                  key={product.id ?? product.slug ?? index}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border bg-gray-50 p-8 text-center text-gray-500">
              আজ দাম কমা কোনো পণ্য পাওয়া যায়নি।
            </p>
          )}
        </div>
      </section>

      {/* ALL PRODUCTS */}
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
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            <div className="text-5xl">😕</div>
            <p className="mt-4 font-semibold text-red-500">
              {error}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : products.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard
                key={product.id ?? product.slug ?? index}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
            কোনো পণ্য পাওয়া যায়নি।
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center">
          <p className="font-semibold">
            বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>
          <p className="mt-3 text-sm text-gray-400">
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </p>
          <p className="mt-5 text-sm text-gray-500">
            © 2026 Bazar Dor. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}