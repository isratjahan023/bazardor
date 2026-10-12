import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-6xl font-bold text-[#008c3e]">
        ৪০৪
      </p>

      <h1 className="mt-5 text-2xl font-bold">
        পেজটি পাওয়া যায়নি
      </h1>

      <p className="mt-3 text-sm leading-7 text-[#667269]">
        লিংকটি সঠিক নয় অথবা পেজটি এখানে নেই।
        <br />
        হোম পেজে ফিরে প্রয়োজনীয় পণ্যের দাম দেখুন।
      </p>

      <Link
        href="/"
        className="mt-6 rounded-lg bg-[#008c3e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#007533]"
      >
        হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}