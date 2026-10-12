"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "../lib/auth-client";

export default function SocialLoginNotice() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();
  const shown = useRef(false);

  const status = searchParams.get("auth");

  useEffect(() => {
    if (
      status === "success" &&
      !isPending &&
      session &&
      !shown.current
    ) {
      shown.current = true;
      toast.success("সফলভাবে সাইন ইন হয়েছে!", {
        id: "social-login-success",
      });
      router.replace("/", { scroll: false });
    }
  }, [status, isPending, session, router]);

  return null;
}