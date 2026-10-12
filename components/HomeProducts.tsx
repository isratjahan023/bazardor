"use client";

import { useEffect, useState } from "react";
import ProductCard, {
  banglaNumber,
  type Product,
} from "./ProductCard";

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function HomeProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/products`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
        }

        const data: Product[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("API থেকে সঠিক তথ্য পাওয়া যায়নি।");
        }

        if (!controller.signal.aborted) {
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

    loadProducts();

    return () => controller.abort();
  }, [retry]);

  const risers = products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
    .slice(0, 6);

  const fallers = products
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
    .slice(0, 6);

  if (loading) {
    return (
      <section
        id="সব-পণ্য"
        role="status"
        className="scroll-mt-6 py-8"
      >
        <span className="sr-only">পণ্যের তথ্য লোড হচ্ছে</span>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-[#e3ebe5] bg-[#fafcfb] p-4"
            >
              <div className="h-12 w-12 rounded-xl bg-[#e3ebe5]" />
              <div className="mt-4 h-3 w-2/3 rounded bg-[#e3ebe5]" />
              <div className="mt-3 h-5 w-1/3 rounded bg-[#e3ebe5]" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="সব-পণ্য"
        role="alert"
        className="scroll-mt-6 py-10 text-center"
      >
        <p className="text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => setRetry((value) => value + 1)}
          className="mt-4 rounded-lg bg-[#008c3e] px-4 py-2 text-white"
        >
          আবার চেষ্টা করুন
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-10 py-8">
      <section>
        <h2 className="text-xl font-bold">
          <span className="text-red-500">▲</span> আজ দাম বেড়েছে
        </h2>

        {risers.length > 0 ? (
          <ProductGrid products={risers} />
        ) : (
          <p className="mt-4 text-[#667269]">
            দাম বেড়েছে এমন পণ্য নেই।
          </p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold">
          <span className="text-green-600">▼</span> আজ দাম কমেছে
        </h2>

        {fallers.length > 0 ? (
          <ProductGrid products={fallers} />
        ) : (
          <p className="mt-4 text-[#667269]">
            দাম কমেছে এমন পণ্য নেই।
          </p>
        )}
      </section>

      <section id="সব-পণ্য" className="scroll-mt-6">
        <h2 className="text-xl font-bold">সব পণ্য</h2>
        <p className="mt-2 text-sm text-[#667269]">
          মোট {banglaNumber(products.length)}টি পণ্য দেখানো হচ্ছে
        </p>

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="mt-4 text-[#667269]">
            কোনো পণ্য পাওয়া যায়নি।
          </p>
        )}
      </section>
    </div>
  );
}