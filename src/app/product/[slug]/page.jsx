"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const API_URL =
  "https://api.abcz.workers.dev/api/bazardor/products";

const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

function banglaNumber(value) {
  if (value === null || value === undefined) {
    return "০";
  }

  return String(value).replace(/\d/g, (digit) => banglaDigits[digit]);
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const slug = params.slug;

  const { data: session, isPending: sessionLoading } =
    useSession();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Login protection
  useEffect(() => {
    if (sessionLoading) return;

    if (!session?.user) {
      router.replace(
        `/signin?callbackUrl=/product/${slug}`
      );
    }
  }, [session, sessionLoading, router, slug]);

  // Fetch product
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Product fetch failed");
        }

        const data = await response.json();

        const foundProduct = Array.isArray(data)
          ? data.find((item) => item.slug === slug)
          : null;

        if (!foundProduct) {
          setError("এই পণ্যটি পাওয়া যায়নি।");
          return;
        }

        setProduct(foundProduct);
      } catch (err) {
        console.error(err);
        setError(
          "পণ্যের তথ্য লোড করতে সমস্যা হয়েছে।"
        );
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Loading session
  if (sessionLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />

          <p className="mt-4 text-gray-600">
            যাচাই করা হচ্ছে...
          </p>
        </div>
      </main>
    );
  }

  // Not logged in
  if (!session?.user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="text-5xl">🔐</div>

          <h1 className="mt-4 text-xl font-bold text-gray-900">
            লগইন প্রয়োজন
          </h1>

          <p className="mt-2 text-gray-500">
            পণ্যের বিস্তারিত দেখতে আগে সাইন ইন করুন।
          </p>

          <Link
            href={`/signin?callbackUrl=/product/${slug}`}
            className="mt-6 inline-block rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            সাইন ইন করুন
          </Link>
        </div>
      </main>
    );
  }

  // Product loading
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-6xl animate-pulse">

          <div className="h-8 w-48 rounded bg-gray-200" />

          <div className="mt-8 grid gap-8 md:grid-cols-2">

            <div className="h-96 rounded-3xl bg-gray-200" />

            <div>
              <div className="h-10 w-72 rounded bg-gray-200" />

              <div className="mt-5 h-5 w-full rounded bg-gray-200" />

              <div className="mt-3 h-5 w-4/5 rounded bg-gray-200" />

              <div className="mt-8 h-32 rounded-2xl bg-gray-200" />
            </div>

          </div>
        </div>
      </main>
    );
  }

  // Error
  if (error || !product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">

          <div className="text-6xl">😕</div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            {error || "পণ্য পাওয়া যায়নি"}
          </h1>

          <p className="mt-2 text-gray-500">
            অন্য কোনো পণ্য দেখুন।
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            সব পণ্যে ফিরে যান
          </Link>

        </div>
      </main>
    );
  }

  const change = Number(
    product.change?.pct ?? 0
  );

  const markets = Array.isArray(product.markets)
    ? product.markets
    : [];

  const prices = markets.flatMap((market) => [
    Number(market.min ?? 0),
    Number(market.max ?? 0),
  ]);

  const validPrices = prices.filter(
    (price) => price > 0
  );

  const minPrice =
    validPrices.length > 0
      ? Math.min(...validPrices)
      : product.today;

  const maxPrice =
    validPrices.length > 0
      ? Math.max(...validPrices)
      : product.today;

  const averagePrice =
    markets.length > 0
      ? markets.reduce(
          (sum, market) =>
            sum +
            (Number(market.min ?? 0) +
              Number(market.max ?? 0)) /
              2,
          0
        ) / markets.length
      : product.today;

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-4 pt-8">
        <Link
          href="/"
          className="text-sm font-medium text-green-600 hover:underline"
        >
          ← সব পণ্যে ফিরে যান
        </Link>
      </div>

      {/* Product Main */}
      <section className="mx-auto max-w-6xl px-4 py-8">

        <div className="grid gap-8 md:grid-cols-2">

          {/* Left - Product Image */}
          <div className="flex min-h-[350px] items-center justify-center rounded-3xl bg-white shadow-sm">

            <span className="text-[150px] md:text-[190px]">
              {product.image || "🛒"}
            </span>

          </div>

          {/* Right - Product Info */}
          <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            {/* Category */}
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                {product.categoryIcon || "🛒"}{" "}
                {product.categoryNameBn}
              </span>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                প্রতি {product.unit || "kg"}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-5 text-3xl font-extrabold text-gray-900 md:text-4xl">
              {product.nameBn}
            </h1>

            {/* Description */}
            <p className="mt-4 leading-7 text-gray-600">
              {product.description ||
                `${product.nameBn} এর আজকের বাজারদর এবং বিভিন্ন বাজারের মূল্য এখানে দেখুন।`}
            </p>

            {/* Today's Price */}
            <div className="mt-7 rounded-2xl bg-green-50 p-5">

              <p className="text-sm text-gray-500">
                আজকের দাম
              </p>

              <div className="mt-2 flex items-end gap-3">

                <p className="text-4xl font-extrabold text-green-700">
                  {banglaNumber(product.today)}
                  <span className="ml-2 text-lg font-medium">
                    টাকা/{product.unit || "kg"}
                  </span>
                </p>

                <span
                  className={`mb-1 rounded-full px-3 py-1 text-sm font-bold ${
                    change > 0
                      ? "bg-red-100 text-red-600"
                      : change < 0
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-600"
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

              </div>
            </div>

            {/* Price Summary */}
            <div className="mt-6 grid grid-cols-3 gap-3">

              <div className="rounded-xl border p-4 text-center">
                <p className="text-xs text-gray-500">
                  সর্বনিম্ন
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {banglaNumber(minPrice)} টাকা
                </p>
              </div>

              <div className="rounded-xl border p-4 text-center">
                <p className="text-xs text-gray-500">
                  গড়
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {banglaNumber(
                    Math.round(averagePrice)
                  )} টাকা
                </p>
              </div>

              <div className="rounded-xl border p-4 text-center">
                <p className="text-xs text-gray-500">
                  সর্বোচ্চ
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {banglaNumber(maxPrice)} টাকা
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Market Prices */}
      <section className="mx-auto max-w-6xl px-4 pb-16">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            বাজারভিত্তিক দাম
          </h2>

          <p className="mt-1 text-gray-500">
            বিভিন্ন বাজারে {product.nameBn} এর দাম
          </p>
        </div>

        {markets.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-gray-500">
            বাজারভিত্তিক তথ্য পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">

            {markets.map((market, index) => (
              <div
                key={`${market.market}-${index}`}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >

                <div className="flex items-start justify-between gap-3">

                  <div>
                    <h3 className="font-bold text-gray-900">
                      🏪 {market.market}
                    </h3>

                    {market.division && (
                      <p className="mt-1 text-sm text-gray-500">
                        {market.division}
                      </p>
                    )}
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    প্রতি {product.unit || "kg"}
                  </span>

                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">
                      সর্বনিম্ন
                    </p>

                    <p className="mt-1 text-lg font-bold text-green-700">
                      {banglaNumber(market.min)} টাকা
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">
                      সর্বোচ্চ
                    </p>

                    <p className="mt-1 text-lg font-bold text-green-700">
                      {banglaNumber(market.max)} টাকা
                    </p>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>

    </main>
  );
}