import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "../../../lib/auth";
import {
  banglaNumber,
  type Product,
} from "../../../components/ProductCard";

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type ProductDetails = Product & {
  category: string;
  categoryNameBn: string;
  yesterday: number;
  markets: Market[];
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

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // API-এর numeric ID খুঁজতে slug দিয়ে product মিলিয়ে নিচ্ছি।
  const listResponse = await fetch(`${API_URL}/products`, {
    cache: "no-store",
  });

  if (!listResponse.ok) {
    throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
  }

  const products: Product[] = await listResponse.json();

  if (!Array.isArray(products)) {
    throw new Error("API থেকে সঠিক তথ্য পাওয়া যায়নি।");
  }

  const selectedProduct = products.find(
    (product) => product.slug === slug
  );

  if (!selectedProduct) {
    notFound();
  }

  // Server-এ login session যাচাই করছি।
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin?reason=protected");
  }

  const response = await fetch(
    `${API_URL}/products/${selectedProduct.id}`,
    { cache: "no-store" }
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("পণ্যের বিস্তারিত লোড করা যায়নি।");
  }

  const product: ProductDetails = await response.json();

  const markets = product.markets ?? [];
  const unit = units[product.unit] ?? product.unit;

  const minimum =
    markets.length > 0
      ? Math.min(...markets.map((market) => market.min))
      : null;

  const maximum =
    markets.length > 0
      ? Math.max(...markets.map((market) => market.max))
      : null;

  const difference = product.today - product.yesterday;
  const direction = product.change.dir;

  const changeColor =
    direction === "up"
      ? "text-red-500"
      : direction === "down"
        ? "text-green-600"
        : "text-gray-500";

  const arrow =
    direction === "up" ? "▲" : direction === "down" ? "▼" : "—";

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <nav
        aria-label="পেজের অবস্থান"
        className="mb-6 flex flex-wrap gap-2 text-sm text-[#667269]"
      >
        <Link href="/" className="hover:text-[#008c3e]">
          হোম
        </Link>
        <span aria-hidden="true">›</span>
        <Link
          href={`/category/${product.category}`}
          className="hover:text-[#008c3e]"
        >
          {product.categoryNameBn}
        </Link>
        <span aria-hidden="true">›</span>
        <span>{product.nameBn}</span>
      </nav>

      <section className="flex flex-col gap-6 rounded-2xl border border-[#e3ebe5] bg-[#fafcfb] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#f0f6f1] text-4xl"
          >
            {product.image}
          </span>

          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              {product.nameBn}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-[#667269]">প্রতি {unit}</span>
              <Link
                href={`/category/${product.category}`}
                className="rounded-full bg-[#e1f2e6] px-3 py-1 text-xs text-[#008c3e]"
              >
                {product.categoryNameBn}
              </Link>
            </div>

            <p className="mt-3 text-sm">
              {difference > 0
                ? `গতকালের তুলনায় আজ দাম বেড়েছে ${banglaNumber(difference)} টাকা।`
                : difference < 0
                  ? `গতকালের তুলনায় আজ দাম কমেছে ${banglaNumber(Math.abs(difference))} টাকা।`
                  : "গতকালের তুলনায় আজ দাম অপরিবর্তিত।"}
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-2xl bg-[#f0f6f1] p-4 text-center">
          <p className="text-xs text-[#667269]">আজকের দাম</p>
          <p className="mt-2 text-3xl font-bold">
            {banglaNumber(product.today)}
          </p>
          <p className="mt-1 text-sm text-[#667269]">
            টাকা / {unit}
          </p>
          <p className={`mt-2 text-sm font-semibold ${changeColor}`}>
            {arrow} {banglaNumber(Math.abs(product.change.pct))}%
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[#e3ebe5] bg-[#fafcfb] p-4 sm:p-6">
        <h2 className="text-lg font-bold">দামের সারসংক্ষেপ</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e3ebe5] p-4">
            <p className="text-xs text-[#667269]">সর্বনিম্ন দাম</p>
            <p className="mt-2 text-xl font-bold text-green-600">
              {minimum === null ? "—" : banglaNumber(minimum)}{" "}
              <span className="text-sm font-normal">টাকা</span>
            </p>
            <p className="mt-2 text-xs text-[#667269]">
              বাজারগুলোর মধ্যে সর্বনিম্ন
            </p>
          </div>

          <div className="rounded-2xl border border-[#e3ebe5] p-4">
            <p className="text-xs text-[#667269]">সর্বাধিক দাম</p>
            <p className="mt-2 text-xl font-bold text-red-500">
              {maximum === null ? "—" : banglaNumber(maximum)}{" "}
              <span className="text-sm font-normal">টাকা</span>
            </p>
            <p className="mt-2 text-xs text-[#667269]">
              বাজারগুলোর মধ্যে সর্বাধিক
            </p>
          </div>

          <div className="rounded-2xl border border-[#e3ebe5] p-4">
            <p className="text-xs text-[#667269]">গড় দাম</p>
            <p className="mt-2 text-xl font-bold text-green-600">
              {banglaNumber(product.today)}{" "}
              <span className="text-sm font-normal">টাকা</span>
            </p>
            <p className="mt-2 text-xs text-[#667269]">
              API-তে দেওয়া আজকের দাম
            </p>
          </div>
        </div>

        <h2 className="mt-6 text-lg font-bold">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {markets.length === 0 ? (
          <p className="mt-4 text-sm text-[#667269]">
            বাজারভিত্তিক তথ্য পাওয়া যায়নি।
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-[#e3ebe5]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-[#f0f6f1] text-[#667269]">
                <tr>
                  <th scope="col" className="px-4 py-3">বাজার</th>
                  <th scope="col" className="px-4 py-3">বিভাগ</th>
                  <th scope="col" className="px-4 py-3">সর্বনিম্ন</th>
                  <th scope="col" className="px-4 py-3">সর্বাধিক</th>
                  <th scope="col" className="px-4 py-3">গড়</th>
                </tr>
              </thead>

              <tbody>
                {[...markets]
                  .sort((a, b) => a.min - b.min)
                  .map((market, index) => (
                    <tr
                      key={`${market.market}-${index}`}
                      className="border-t border-[#e3ebe5] even:bg-[#f0f6f1]"
                    >
                      <th scope="row" className="px-4 py-3 font-normal">
                        {market.market}
                      </th>
                      <td className="px-4 py-3">{market.division}</td>
                      <td className="px-4 py-3">
                        {banglaNumber(market.min)} টাকা
                      </td>
                      <td className="px-4 py-3">
                        {banglaNumber(market.max)} টাকা
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {banglaNumber((market.min + market.max) / 2)} টাকা
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}