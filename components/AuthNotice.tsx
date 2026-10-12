"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthNotice() {
  const searchParams = useSearchParams();
  const shown = useRef(false);
  const reason = searchParams.get("reason");

  useEffect(() => {
    if (reason === "protected" && !shown.current) {
      toast.error("পণ্যের বিস্তারিত দেখতে আগে সাইন ইন করুন।", {
        id: "protected-route",
      });
      shown.current = true;
    }
  }, [reason]);

  return null;
}