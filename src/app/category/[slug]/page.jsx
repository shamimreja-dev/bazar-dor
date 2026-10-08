"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const BASE_URL = "https://api.abcz.workers.dev/api/bazardor";

export default function CategoryPage({ params }) {
  const { slug } = params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(
          `${BASE_URL}/products?category=${slug}`
        );

        const data = await res.json();

        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [slug]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        <Link
          href="/"
          className="mb-6 inline-block text-green-600"
        >
          ← হোমে ফিরে যান
        </Link>

        <h1 className="mb-2 text-3xl font-bold">
          {slug} বাজার
        </h1>

        <p className="mb-8 text-gray-500">
          এই ক্যাটাগরির সকল পণ্যের আজকের দাম
        </p>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-52 animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow">
            <p className="text-xl font-semibold">
              😕 কোনো পণ্য পাওয়া যায়নি
            </p>

            <Link
              href="/"
              className="mt-5 inline-block rounded-lg bg-green-600 px-5 py-3 text-white"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="rounded-2xl bg-white p-5 shadow transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="text-5xl">
                  {product.emoji || "🛒"}
                </div>

                <h2 className="mt-4 text-lg font-bold">
                  {product.name}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  প্রতি {product.unit || "কেজি"}
                </p>

                <p className="mt-4 text-xl font-bold text-green-700">
                  {product.price || "—"} টাকা
                </p>
              </Link>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}