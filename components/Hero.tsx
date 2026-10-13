"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(
      new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date())
    );
  }, []);

  return (
    <section className="flex flex-col gap-8 rounded-2xl border border-[#e3ebe5] bg-[#fafcfb] p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
      <div className="max-w-2xl">
        <p className="inline-block min-h-6 rounded-full bg-[#e1f2e6] px-3 py-1 text-xs font-medium text-[#008c3e]">
          {date || "আজকের বাজার দর"}
        </p>

        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          আজকের বাজারের দাম এক নজরে
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-[#667269] sm:text-base">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
          বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
          দামের পরিবর্তন এক জায়গায়।
        </p>

        <a
          href="#সব-পণ্য"
          className="btn btn-sm mt-6 rounded-lg border-0 bg-[#008c3e] px-5 font-semibold text-white shadow-sm transition-colors hover:bg-[#007533] sm:btn-md"
        >
          সব পণ্য দেখুন
        </a>
      </div>

      <div className="flex shrink-0 justify-center">
        <Image
          src="/hero-basket.png"
          alt="ফলভর্তি ঝুড়ি"
          width={315}
          height={263}
          priority
          className="h-auto w-48 sm:w-60 md:w-64"
        />
      </div>
    </section>
  );
}