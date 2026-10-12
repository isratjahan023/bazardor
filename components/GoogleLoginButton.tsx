"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "../lib/auth-client";



export default function GoogleLoginButton() {
  const [pending, setPending] = useState(false);

  async function handleGoogleLogin() {
    if (pending) return;

    setPending(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/?auth=success",
        errorCallbackURL: "/signin?reason=oauth-error",
      });

      if (result.error) {
        toast.error(
          result.error.message || "Google দিয়ে সাইন ইন করা যায়নি।"
        );
        setPending(false);
      }
    } catch {
      toast.error("সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#d6e0d8] bg-white px-4 py-3 text-sm font-semibold hover:bg-[#f0f6f1] disabled:cursor-wait disabled:opacity-60"
    >
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 48 48"
      >
        <path
          fill="#FFC107"
          d="M43.6 20.5H42V20H24v8h11.3A12 12 0 1 1 32 14.6l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5Z"
        />
        <path
          fill="#FF3D00"
          d="m6.3 14.7 6.6 4.8A12 12 0 0 1 32 14.6l5.7-5.7A20 20 0 0 0 6.3 14.7Z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.2 0 10-2 13.6-5.3l-6.2-5.2A12 12 0 0 1 12.7 28l-6.6 5.1A20 20 0 0 0 24 44Z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-3.9 5.5l6.2 5.2A19.9 19.9 0 0 0 44 24c0-1.2-.1-2.4-.4-3.5Z"
        />
      </svg>

      {pending ? "Google-এ নিয়ে যাচ্ছে…" : "Google দিয়ে চালিয়ে যান"}
    </button>
  );
}