"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import ProductCard, {
  banglaNumber,
  type Product,
} from "../../../components/ProductCard";

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

type SortOrder = "default" | "ascending" | "descending";

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState<SortOrder>("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategory() {
      setLoading(true);
      setError("");
      setCategory(null);
      setProducts([]);
      setSort("default");

      try {
        const categoryResponse = await fetch(`${API_URL}/categories`, {
          signal: controller.signal,
        });

        if (!categoryResponse.ok) {
          throw new Error("বিভাগের তথ্য লোড করা যায়নি।");
        }

        const categories: Category[] = await categoryResponse.json();

        if (!Array.isArray(categories)) {
          throw new Error("API থেকে সঠিক তথ্য পাওয়া যায়নি।");
        }

        const selectedCategory = categories.find(
          (item) => item.slug === slug
        );

        if (!selectedCategory) {
          return;
        }

        const productResponse = await fetch(
          `${API_URL}/products?category=${encodeURIComponent(slug)}`,
          { signal: controller.signal }
        );

        if (!productResponse.ok) {
          throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
        }

        const data: Product[] = await productResponse.json();

        if (!Array.isArray(data)) {
          throw new Error("API থেকে সঠিক তথ্য পাওয়া যায়নি।");
        }

        if (!controller.signal.aborted) {
          setCategory(selectedCategory);
          setProducts(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error ? err.message : "আবার চেষ্টা করুন।"
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCategory();

    return () => controller.abort();
  }, [slug, retry]);

  const sortedProducts = [...products];

  if (sort === "ascending") {
    sortedProducts.sort((a, b) => a.today - b.today);
  } else if (sort === "descending") {
    sortedProducts.sort((a, b) => b.today - a.today);
  }

  if (loading) {
    return (
      <main
        role="status"
        className="mx-auto max-w-6xl px-4 py-6"
      >
        <span className="sr-only">পণ্য লোড হচ্ছে</span>

        <div className="h-24 animate-pulse rounded-2xl bg-[#e3ebe5]" />

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl bg-[#e3ebe5]"
            />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main
        role="alert"
        className="mx-auto max-w-6xl px-4 py-16 text-center"
      >
        <p className="text-red-600">{error}</p>

        <button
          type="button"
          onClick={() => setRetry((value) => value + 1)}
          className="mt-4 rounded-lg bg-[#008c3e] px-5 py-3 text-white"
        >
          আবার চেষ্টা করুন
        </button>
      </main>
    );
  }

  if (!category || products.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-5xl font-bold text-[#008c3e]">৪০৪</p>

        <h1 className="mt-4 text-2xl font-bold">
          {!category
            ? "বিভাগটি পাওয়া যায়নি"
            : "এই বিভাগে কোনো পণ্য নেই"}
        </h1>

        <p className="mt-3 text-[#667269]">
          অন্য বিভাগ দেখুন অথবা হোম পেজে ফিরে যান।
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-[#008c3e] px-5 py-3 text-white"
        >
          হোম পেজে ফিরে যান
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <section className="flex items-center gap-4 rounded-2xl border border-[#e3ebe5] bg-[#fafcfb] p-6">
        <span aria-hidden="true" className="text-4xl">
          {category.icon}
        </span>

        <div>
          <h1 className="text-2xl font-bold">{category.nameBn}</h1>

          <p className="mt-1 text-sm text-[#667269]">
            {banglaNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </section>

      <div className="mt-6 flex items-center justify-end gap-3 rounded-2xl border border-[#e3ebe5] bg-[#fafcfb] p-4">
        <label
          htmlFor="price-sort"
          className="shrink-0 text-sm text-[#667269]"
        >
          সাজান:
        </label>

        <select
          id="price-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value as SortOrder)}
          className="min-w-0 rounded-lg border border-[#d6e0d8] bg-[#fafcfb] px-3 py-2 text-sm"
        >
          <option value="default">ডিফল্ট</option>
          <option value="ascending">দাম: কম থেকে বেশি</option>
          <option value="descending">দাম: বেশি থেকে কম</option>
        </select>
      </div>

      <p className="mt-4 text-sm text-[#667269]">
        মোট {banglaNumber(products.length)}টি পণ্য দেখানো হচ্ছে
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}