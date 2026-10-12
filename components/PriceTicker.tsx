"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  nameBn: string;
  image: string;
  unit: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

const units: Record<string, string> = {
  kg: "কেজি",
  liter: "লিটার",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pcs: "পিস",
};

function banglaNumber(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(value);
}

export default function PriceTicker() {
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
          throw new Error("পণ্যের দাম লোড করা যায়নি।");
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

  if (loading) {
    return (
      <div
        role="status"
        className="border-b border-[#e3ebe5] bg-[#fafcfb] px-4 py-3"
      >
        <span className="sr-only">পণ্যের দাম লোড হচ্ছে</span>
        <div className="h-4 animate-pulse rounded bg-[#e3ebe5]" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-wrap justify-center gap-3 border-b border-[#e3ebe5] bg-[#fafcfb] px-4 py-2 text-sm"
      >
        <p className="text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => setRetry((value) => value + 1)}
          className="text-[#008c3e] underline"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="border-b border-[#e3ebe5] bg-[#fafcfb] px-4 py-2 text-center text-sm">
        পণ্যের দাম পাওয়া যায়নি।
      </p>
    );
  }

  return (
    <section
      aria-label="আজকের পণ্যের দাম"
      tabIndex={0}
      className="price-ticker overflow-hidden border-b border-[#e3ebe5] bg-[#fafcfb]"
    >
      <div className="ticker-track flex w-max">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className="flex shrink-0"
          >
            {products.map((product) => {
              const direction = product.change.dir;

              const color =
                direction === "up"
                  ? "text-red-500"
                  : direction === "down"
                    ? "text-green-600"
                    : "text-gray-500";

              const arrow =
                direction === "up"
                  ? "▲"
                  : direction === "down"
                    ? "▼"
                    : "—";

              return (
                <div
                  key={product.id}
                  className="flex items-center gap-2 whitespace-nowrap border-r border-[#e3ebe5] px-5 py-2 text-sm"
                >
                  <span aria-hidden="true">{product.image}</span>

                  <span>
                    {product.nameBn} {banglaNumber(product.today)} টাকা/
                    {units[product.unit] ?? product.unit}
                  </span>

                  <span className={`font-semibold ${color}`}>
                    {arrow}{" "}
                    {banglaNumber(Math.abs(product.change.pct))}%
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}