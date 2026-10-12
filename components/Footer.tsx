export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#e3ebe5] bg-[#fafcfb]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs leading-6 sm:flex-row sm:items-center sm:justify-between">
        <p>
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        <p className="text-[#667269] sm:text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}