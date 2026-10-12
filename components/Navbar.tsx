"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

export default function Navbar() {
  const pathname = usePathname();

  const [categories, setCategories] = useState<Category[]>([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setDate(
      new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date())
    );

    async function loadCategories() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/categories`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("বিভাগগুলো লোড করা যায়নি।");
        }

        const data: Category[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("API থেকে সঠিক তথ্য পাওয়া যায়নি।");
        }

        if (!controller.signal.aborted) {
          setCategories(data);
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

    loadCategories();

    return () => controller.abort();
  }, [retry]);

  return (
    <header className="border-b border-[#e3ebe5] bg-[#fafcfb]">
      {/* Logo, date and authentication links */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#008c3e] text-xl"
          >
            🛒
          </span>

          <div>
            <p className="text-xl font-bold leading-tight">
              বাজার দর
            </p>
            <p className="mt-1 min-h-4 text-[10px] text-[#667269] sm:text-xs">
              {date}
            </p>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-2 text-xs sm:gap-4 sm:text-sm">
          <Link
            href="/signin"
            className="rounded-lg px-2 py-2 hover:bg-green-50"
          >
            সাইন ইন
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-[#008c3e] px-3 py-2 text-white shadow-sm hover:bg-[#007533] sm:px-4"
          >
            সাইন আপ
          </Link>
        </div>
      </div>

      {/* Categories fetched from the API */}
      <div className="border-t border-[#e3ebe5]">
        <nav
          aria-label="পণ্যের বিভাগ"
          aria-busy={loading}
          className="mx-auto flex min-h-12 max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2"
        >
          {loading ? (
            <div
              role="status"
              className="flex animate-pulse gap-3"
            >
              <span className="sr-only">বিভাগ লোড হচ্ছে</span>
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={index}
                  className="h-8 w-16 shrink-0 rounded-lg bg-[#e3ebe5]"
                />
              ))}
            </div>
          ) : error ? (
            <div role="alert" className="flex items-center gap-3 text-sm">
              <p className="text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => setRetry((value) => value + 1)}
                className="shrink-0 text-[#008c3e] underline"
              >
                আবার চেষ্টা করুন
              </button>
            </div>
          ) : (
            categories.map((category) => {
              const href = `/category/${category.slug}`;
              const isActive = pathname === href;

              return (
                <Link
                  key={category.id}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-[#008c3e] text-white"
                      : "hover:bg-[#e8f3eb]"
                  }`}
                >
                  <span aria-hidden="true">{category.icon}</span>
                  {category.nameBn}
                </Link>
              );
            })
          )}
        </nav>
      </div>
    </header>
  );
}