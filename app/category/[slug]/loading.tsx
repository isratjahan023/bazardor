export default function Loading() {
  return (
    <main
      role="status"
      className="mx-auto max-w-6xl space-y-6 px-4 py-6"
    >
      <span className="sr-only">পণ্যের বিস্তারিত লোড হচ্ছে</span>
      <div className="h-36 animate-pulse rounded-2xl bg-[#e3ebe5]" />
      <div className="h-80 animate-pulse rounded-2xl bg-[#e3ebe5]" />
    </main>
  );
}