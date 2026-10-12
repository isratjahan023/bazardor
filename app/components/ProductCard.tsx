import Link from "next/link";

export type Product = {
  id: number;
  slug: string;
  nameBn: string;
  image: string;
  unit: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

const units: Record<string, string> = {
  kg: "কেজি",
  liter: "লিটার",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pcs: "পিস",
};

export function banglaNumber(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(value);
}

export default function ProductCard({ product }: { product: Product }) {
  const direction = product.change.dir;

  const badgeColor =
    direction === "up"
      ? "text-red-500"
      : direction === "down"
        ? "text-green-600"
        : "text-gray-500";

  const arrow =
    direction === "up" ? "▲" : direction === "down" ? "▼" : "—";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block rounded-2xl border border-[#e3ebe5] bg-[#fafcfb] p-4 transition-colors hover:border-[#008c3e] focus-visible:outline-2 focus-visible:outline-[#008c3e]"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f6f1] text-2xl"
        >
          {product.image}
        </span>

        <div>
          <h3 className="font-semibold">{product.nameBn}</h3>
          <p className="mt-1 text-xs text-[#667269]">
            প্রতি {units[product.unit] ?? product.unit}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-[#667269]">আজকের দাম</p>
          <p className="mt-1 text-xl font-bold">
            {banglaNumber(product.today)}{" "}
            <span className="text-sm font-normal">টাকা</span>
          </p>
        </div>

        <span
          className={`rounded-full bg-[#f0f6f1] px-2 py-1 text-xs font-semibold ${badgeColor}`}
        >
          {arrow} {banglaNumber(Math.abs(product.change.pct))}%
        </span>
      </div>
    </Link>
  );
}