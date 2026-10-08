"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const API_URL =
  "https://api.abcz.workers.dev/api/bazardor/products";

function banglaNumber(value) {
  if (value === undefined || value === null || value === "") {
    return "০";
  }

  const digits = "০১২৩৪৫৬৭৮৯";

  return String(value).replace(
    /\d/g,
    (digit) => digits[digit]
  );
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const slug = params.id;

  const { data: session, isPending: sessionLoading } =
    useSession();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Login protection
  useEffect(() => {
    if (sessionLoading) return;

    if (!session) {
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
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        const products = Array.isArray(data)
          ? data
          : data.products ||
            data.data ||
            data.results ||
            [];

        const foundProduct = products.find(
          (item) => item.slug === slug
        );

        if (!foundProduct) {
          setProduct(null);
          setError("এই পণ্যটি পাওয়া যায়নি।");
          return;
        }

        setProduct(foundProduct);
      } catch (error) {
        console.error(
          "Product Details Error:",
          error
        );

        setError(
          "পণ্যের তথ্য লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    if (slug && session) {
      fetchProduct();
    }
  }, [slug, session]);

  // Checking session
  if (sessionLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8faf7]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />

          <p className="mt-4 text-gray-500">
            লগইন তথ্য যাচাই করা হচ্ছে...
          </p>
        </div>
      </main>
    );
  }

  // Not logged in
  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8faf7] px-4">
        <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
          <div className="text-6xl">🔐</div>

          <h1 className="mt-5 text-2xl font-bold">
            লগইন প্রয়োজন
          </h1>

          <p className="mt-2 text-gray-500">
            পণ্যের বিস্তারিত দেখতে আগে লগইন করুন।
          </p>
        </div>
      </main>
    );
  }

  // Product loading
  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8faf7]">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="mb-6 h-5 w-40 animate-pulse rounded bg-gray-200" />

          <div className="grid gap-8 rounded-3xl border bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
            <div className="flex min-h-80 animate-pulse items-center justify-center rounded-3xl bg-gray-200" />

            <div className="animate-pulse">
              <div className="h-8 w-32 rounded bg-gray-200" />
              <div className="mt-5 h-10 w-3/4 rounded bg-gray-200" />
              <div className="mt-4 h-5 w-24 rounded bg-gray-200" />
              <div className="mt-8 h-32 rounded-2xl bg-gray-200" />

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="h-20 rounded-xl bg-gray-200" />
                <div className="h-20 rounded-xl bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error
  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#f8faf7]">
        <div className="mx-auto max-w-4xl px-4 py-20">
          <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
            <div className="text-7xl">😕</div>

            <h1 className="mt-6 text-3xl font-bold">
              কোনো পণ্য পাওয়া যায়নি
            </h1>

            <p className="mt-3 text-gray-500">
              আপনি যে পণ্যটি খুঁজছেন সেটি পাওয়া যায়নি।
            </p>

            <Link
              href="/"
              className="mt-7 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              ← সব পণ্যে ফিরে যান
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const change = Number(
    product.change?.pct ?? 0
  );

  return (
    <main className="min-h-screen bg-[#f8faf7]">
      <section className="mx-auto max-w-5xl px-4 py-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:underline"
        >
          ← সব পণ্যে ফিরে যান
        </Link>

        <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
          {/* Main Information */}
          <div className="grid gap-8 p-6 md:grid-cols-2 md:p-10">
            <div className="flex min-h-80 items-center justify-center rounded-3xl bg-green-50">
              <span className="text-[120px]">
                {product.image || "🛒"}
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                <span>
                  {product.categoryIcon || "🛒"}
                </span>

                <span>
                  {product.categoryNameBn || "পণ্য"}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-bold text-gray-900 md:text-4xl">
                {product.nameBn}
              </h1>

              <p className="mt-3 text-gray-500">
                প্রতি {product.unit || "kg"}
              </p>

              {/* Today Price */}
              <div className="mt-8 rounded-2xl bg-green-50 p-6">
                <p className="text-sm text-gray-500">
                  আজকের দাম
                </p>

                <div className="mt-2 flex items-end gap-3">
                  <span className="text-4xl font-bold text-green-700">
                    {banglaNumber(product.today)}
                  </span>

                  <span className="pb-1 text-gray-600">
                    টাকা/{product.unit || "kg"}
                  </span>
                </div>

                <div className="mt-4">
                  {change > 0 && (
                    <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
                      ▲{" "}
                      {banglaNumber(
                        Math.abs(change)
                      )}
                      % বেড়েছে
                    </span>
                  )}

                  {change < 0 && (
                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      ▼{" "}
                      {banglaNumber(
                        Math.abs(change)
                      )}
                      % কমেছে
                    </span>
                  )}

                  {change === 0 && (
                    <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
                      — কোনো পরিবর্তন নেই
                    </span>
                  )}
                </div>
              </div>

              {/* Previous Prices */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-gray-500">
                    গতকালের দাম
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {banglaNumber(
                      product.yesterday
                    )}{" "}
                    টাকা
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-xs text-gray-500">
                    গত সপ্তাহের দাম
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {banglaNumber(
                      product.lastWeek
                    )}{" "}
                    টাকা
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-xs text-gray-500">
                    গত মাসের দাম
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {banglaNumber(
                      product.lastMonth
                    )}{" "}
                    টাকা
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-t p-6 md:p-10">
              <h2 className="text-2xl font-bold">
                পণ্যের বিবরণ
              </h2>

              <p className="mt-4 leading-8 text-gray-600">
                {product.description}
              </p>
            </div>
          )}

          {/* Markets */}
          {Array.isArray(product.markets) &&
            product.markets.length > 0 && (
              <div className="border-t p-6 md:p-10">
                <h2 className="text-2xl font-bold">
                  বাজারভেদে দাম
                </h2>

                <p className="mt-2 text-gray-500">
                  বিভিন্ন বাজারে আজকের সম্ভাব্য দাম
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {product.markets.map(
                    (market, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border bg-gray-50 p-5"
                      >
                        <h3 className="font-bold text-gray-900">
                          {market.market ||
                            market.name ||
                            "বাজার"}
                        </h3>

                        {market.division && (
                          <p className="mt-1 text-sm text-gray-500">
                            {market.division}
                          </p>
                        )}

                        <div className="mt-5 flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            সর্বনিম্ন
                          </span>

                          <span className="font-semibold text-green-700">
                            {banglaNumber(
                              market.min
                            )}{" "}
                            টাকা
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            সর্বোচ্চ
                          </span>

                          <span className="font-semibold text-red-600">
                            {banglaNumber(
                              market.max
                            )}{" "}
                            টাকা
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      </section>
    </main>
  );
}