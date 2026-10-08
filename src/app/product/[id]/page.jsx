"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const BASE_URL = "https://api.abcz.workers.dev/api/bazardor";

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${BASE_URL}/products/${id}`);

        if (!res.ok) {
          throw new Error("Product not found");
        }

        const data = await res.json();

        console.log("Product details:", data);

        setProduct(data.product || data);
      } catch (error) {
        console.error(error);
        setError("পণ্যের তথ্য লোড করা যায়নি");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />

          <div className="mt-6 h-96 animate-pulse rounded-3xl bg-gray-200" />
        </div>
      </main>
    );
  }

  // Error
  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="text-6xl">😕</div>

          <h1 className="mt-4 text-2xl font-bold">
            {error || "পণ্য পাওয়া যায়নি"}
          </h1>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
          >
            হোমে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const markets = Array.isArray(product.markets)
    ? product.markets
    : [];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Back Button */}
        <Link
          href="/"
          className="mb-6 inline-block text-green-600 hover:underline"
        >
          ← হোমে ফিরে যান
        </Link>

        {/* Main Card */}
        <div className="rounded-3xl bg-white p-6 shadow-lg md:p-10">

          {/* Product Header */}
          <div className="flex flex-col gap-8 md:flex-row md:items-center">

            {/* Product Image */}
            <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-3xl bg-green-50 p-4">

              {product.image ? (
                <img
                  src={product.image}
                  alt={
                    product.nameBn ||
                    product.name ||
                    "Product"
                  }
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-7xl">
                  {product.categoryIcon || "🛒"}
                </span>
              )}

            </div>

            {/* Product Info */}
            <div className="min-w-0">

              <p className="text-sm font-medium text-gray-500">
                আজকের বাজার দর
              </p>

              <h1 className="mt-2 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
                {product.nameBn ||
                  product.name ||
                  "Unknown Product"}
              </h1>

              <p className="mt-2 text-gray-500">
                প্রতি {product.unit || "কেজি"}
              </p>

              {/* Today's Price */}
              <p className="mt-4 text-3xl font-bold text-green-700">
                {product.today ?? "—"} টাকা
              </p>

              {/* Price Change */}
              {product.change && (
                <span
                  className={`mt-3 inline-block rounded-full px-4 py-2 text-sm font-semibold ${
                    product.change.dir === "up"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {product.change.dir === "up"
                    ? "▲"
                    : "▼"}{" "}
                  {product.change.pct ?? 0}%
                </span>
              )}

            </div>
          </div>

          {/* Price Summary */}
          <section className="mt-10">

            <h2 className="text-xl font-bold text-gray-900">
              দামের সংক্ষিপ্ত তথ্য
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">

              {/* Today */}
              <div className="rounded-2xl bg-green-50 p-5">
                <p className="text-sm text-gray-500">
                  আজকের দাম
                </p>

                <p className="mt-2 text-xl font-bold text-green-700">
                  {product.today ?? "—"} টাকা
                </p>
              </div>

              {/* Yesterday */}
              <div className="rounded-2xl bg-blue-50 p-5">
                <p className="text-sm text-gray-500">
                  গতকালের দাম
                </p>

                <p className="mt-2 text-xl font-bold text-blue-700">
                  {product.yesterday ?? "—"} টাকা
                </p>
              </div>

              {/* Last Week */}
              <div className="rounded-2xl bg-purple-50 p-5">
                <p className="text-sm text-gray-500">
                  গত সপ্তাহের দাম
                </p>

                <p className="mt-2 text-xl font-bold text-purple-700">
                  {product.lastWeek ?? "—"} টাকা
                </p>
              </div>

            </div>
          </section>

          {/* Product Information */}
          <section className="mt-10">

            <h2 className="text-xl font-bold text-gray-900">
              পণ্যের তথ্য
            </h2>

            <div className="mt-4 flex flex-wrap gap-3">

              {product.categoryNameBn && (
                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                  ক্যাটাগরি: {product.categoryNameBn}
                </span>
              )}

              {product.category && (
                <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700">
                  {product.category}
                </span>
              )}

              {product.unit && (
                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                  ইউনিট: {product.unit}
                </span>
              )}

              {product.id && (
                <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                  ID: {product.id}
                </span>
              )}

            </div>
          </section>

          {/* Market Prices */}
          <section className="mt-10">

            <h2 className="text-xl font-bold text-gray-900">
              বাজারভিত্তিক দাম
            </h2>

            {markets.length === 0 ? (
              <div className="mt-4 rounded-2xl bg-gray-50 p-6 text-center text-gray-500">
                বাজারভিত্তিক দাম পাওয়া যায়নি।
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto rounded-2xl border">

                <table className="w-full min-w-[700px] text-left">

                  <thead className="bg-gray-50">
                    <tr>

                      <th className="px-5 py-4 text-sm font-semibold">
                        বাজার
                      </th>

                      <th className="px-5 py-4 text-sm font-semibold">
                        বিভাগ
                      </th>

                      <th className="px-5 py-4 text-sm font-semibold">
                        সর্বনিম্ন
                      </th>

                      <th className="px-5 py-4 text-sm font-semibold">
                        সর্বোচ্চ
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {markets.map((market, index) => (
                      <tr
                        key={`${market.market || "market"}-${index}`}
                        className="border-t"
                      >

                        <td className="px-5 py-4 font-medium text-gray-900">
                          {market.market || "—"}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {market.division || "—"}
                        </td>

                        <td className="px-5 py-4 font-bold text-green-600">
                          {market.min ?? "—"} টাকা
                        </td>

                        <td className="px-5 py-4 font-bold text-red-600">
                          {market.max ?? "—"} টাকা
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </section>

        </div>
      </div>
    </main>
  );
}