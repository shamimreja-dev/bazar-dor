"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_URL =
  "https://api.abcz.workers.dev/api/bazardor/products";

const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

function banglaNumber(value) {
  if (value === null || value === undefined) {
    return "০";
  }

  return String(value).replace(
    /\d/g,
    (digit) => banglaDigits[digit]
  );
}

function ProductCard({ product }) {
  const price = Number(product?.today ?? 0);
  const change = Number(product?.change?.pct ?? 0);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-32 items-center justify-center rounded-xl bg-green-50">
        <span className="text-7xl transition group-hover:scale-110">
          {product.image || "🛒"}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-bold text-gray-900">
            {product.nameBn}
          </h2>

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

export default function CategoryPage() {
  const params = useParams();

  const slug = params.slug;

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("🛒");

  const [sort, setSort] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategoryProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}?category=${slug}`
        );

        if (!response.ok) {
          throw new Error("Category fetch failed");
        }

        const data = await response.json();

        console.log("Category products:", data);

        if (!Array.isArray(data) || data.length === 0) {
          setProducts([]);
          setError("এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।");
          return;
        }

        setProducts(data);

        setCategoryName(
          data[0]?.categoryNameBn || "পণ্য"
        );

        setCategoryIcon(
          data[0]?.categoryIcon || "🛒"
        );
      } catch (err) {
        console.error(err);

        setProducts([]);
        setError(
          "ক্যাটাগরির তথ্য লোড করতে সমস্যা হয়েছে।"
        );
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchCategoryProducts();
    }
  }, [slug]);

  const sortedProducts = [...products];

  if (sort === "low") {
    sortedProducts.sort(
      (a, b) =>
        Number(a.today ?? 0) -
        Number(b.today ?? 0)
    );
  }

  if (sort === "high") {
    sortedProducts.sort(
      (a, b) =>
        Number(b.today ?? 0) -
        Number(a.today ?? 0)
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10">

          <Link
            href="/"
            className="text-sm font-medium text-green-600 hover:underline"
          >
            ← সব পণ্যে ফিরে যান
          </Link>

          <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">
                  {categoryIcon}
                </span>

                <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
                  {categoryName || "ক্যাটাগরি"}
                </h1>
              </div>

              <p className="mt-2 text-gray-500">
                এই ক্যাটাগরির আজকের বাজারদর
              </p>
            </div>

            {/* Sort */}
            {!loading && products.length > 0 && (
              <div>
                <label
                  htmlFor="sort"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  দাম অনুযায়ী সাজান
                </label>

                <select
                  id="sort"
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value)
                  }
                  className="rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  <option value="default">
                    ডিফল্ট
                  </option>

                  <option value="low">
                    কম দাম → বেশি দাম
                  </option>

                  <option value="high">
                    বেশি দাম → কম দাম
                  </option>
                </select>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-4 py-10">

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(
              (item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  <div className="h-32 animate-pulse bg-gray-200" />

                  <div className="space-y-3 p-4">
                    <div className="h-5 animate-pulse rounded bg-gray-200" />

                    <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />

                    <div className="h-8 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Error / Invalid */}
        {!loading && error && (
          <div className="flex min-h-[40vh] items-center justify-center">

            <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

              <div className="text-6xl">
                😕
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                ক্যাটাগরি পাওয়া যায়নি
              </h2>

              <p className="mt-2 text-gray-500">
                {error}
              </p>

              <Link
                href="/"
                className="mt-6 inline-block rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
              >
                হোমে ফিরে যান
              </Link>

            </div>

          </div>
        )}

        {/* Product Grid */}
        {!loading &&
          !error &&
          sortedProducts.length > 0 && (
            <>
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  মোট{" "}
                  <span className="font-semibold text-gray-900">
                    {banglaNumber(sortedProducts.length)}
                  </span>{" "}
                  টি পণ্য
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </>
          )}

      </section>

    </main>
  );
}