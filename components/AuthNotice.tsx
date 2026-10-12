"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthNotice() {
  const searchParams = useSearchParams();
  const shown = useRef(false);
  const reason = searchParams.get("reason");

  useEffect(() => {
    if (shown.current) return;

    if (reason === "protected") {
      toast.error("পণ্যের বিস্তারিত দেখতে আগে সাইন ইন করুন।", {
        id: "protected-route",
      });
      shown.current = true;
    } else if (reason === "oauth-error") {
      toast.error("Social login সম্পন্ন হয়নি। আবার চেষ্টা করুন।", {
        id: "oauth-error",
      });
      shown.current = true;
    }
  }, [reason]);

  return null;
}