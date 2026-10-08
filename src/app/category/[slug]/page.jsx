"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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

function getPrice(product) {
  return Number(product.today ?? 0);
}

function getChange(product) {
  return Number(product.change?.pct ?? 0);
}

function ProductCard({ product }) {
  const price = getPrice(product);
  const change = getChange(product);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-green-50 text-4xl">
          {product.image || "🛒"}
        </div>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          {product.categoryNameBn || "বাজারদর"}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-bold text-gray-900 group-hover:text-green-600">
        {product.nameBn || "পণ্য"}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        প্রতি {product.unit || "kg"}
      </p>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">
            আজকের দাম
          </p>

          <p className="mt-1 text-xl font-bold text-green-700">
            {banglaNumber(price)} টাকা
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            change > 0
              ? "bg-red-100 text-red-600"
              : change < 0
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {change > 0
            ? `▲ ${banglaNumber(Math.abs(change))}%`
            : change < 0
            ? `▼ ${banglaNumber(Math.abs(change))}%`
            : "— ০.০%"}
        </span>
      </div>
    </Link>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug;

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
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
          throw new Error("Failed to fetch category");
        }

        const data = await response.json();

        console.log("Category data:", data);

        const productList = Array.isArray(data)
          ? data
          : data.products ||
            data.data ||
            data.results ||
            [];

        if (productList.length === 0) {
          setProducts([]);
          setCategory(null);
          setError("এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।");
          return;
        }

        setProducts(productList);

        setCategory({
          name:
            productList[0].categoryNameBn ||
            "পণ্য",
          icon:
            productList[0].categoryIcon ||
            "🛒",
        });
      } catch (error) {
        console.error("Category Error:", error);

        setError(
          "ক্যাটাগরির পণ্য লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchCategoryProducts();
    }
  }, [slug]);

  const sortedProducts = useMemo(() => {
    const list = [...products];

    if (sort === "low") {
      return list.sort(
        (a, b) => getPrice(a) - getPrice(b)
      );
    }

    if (sort === "high") {
      return list.sort(
        (a, b) => getPrice(b) - getPrice(a)
      );
    }

    return list;
  }, [products, sort]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8faf7]">
        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200" />

          <div className="mt-4 h-5 w-80 animate-pulse rounded bg-gray-200" />

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-2xl border bg-white p-5"
                >
                  <div className="h-16 w-16 rounded-xl bg-gray-200" />

                  <div className="mt-5 h-6 w-32 rounded bg-gray-200" />

                  <div className="mt-3 h-4 w-20 rounded bg-gray-200" />

                  <div className="mt-6 h-8 w-full rounded bg-gray-200" />
                </div>
              )
            )}
          </div>
        </section>
      </main>
    );
  }

  if (error || !category) {
    return (
      <main className="min-h-screen bg-[#f8faf7]">
        <section className="mx-auto max-w-4xl px-4 py-20">
          <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
            <div className="text-7xl">😕</div>

            <h1 className="mt-6 text-3xl font-bold">
              ক্যাটাগরি পাওয়া যায়নি
            </h1>

            <p className="mt-3 text-gray-500">
              এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
            </p>

            <Link
              href="/"
              className="mt-7 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              ← সব পণ্যে ফিরে যান
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8faf7]">
      <section className="mx-auto max-w-7xl px-4 py-10">
        {/* Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-5xl">
                {category.icon}
              </span>

              <div>
                <p className="text-sm font-semibold text-green-600">
                  বাজার দর
                </p>

                <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  {category.name}
                </h1>
              </div>
            </div>

            <p className="mt-3 text-gray-500">
              এই ক্যাটাগরির আজকের বাজারদর দেখুন।
            </p>
          </div>

          {/* Sort */}
          <div className="w-full md:w-56">
            <label
              htmlFor="sort"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              দাম অনুযায়ী সাজান
            </label>

            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
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
        </div>

        {/* Product Count */}
        <div className="mt-8">
          <p className="text-sm text-gray-500">
            মোট{" "}
            <span className="font-semibold text-gray-900">
              {banglaNumber(sortedProducts.length)}
            </span>{" "}
            টি পণ্য
          </p>
        </div>

        {/* Products */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section>
    </main>
  );
}