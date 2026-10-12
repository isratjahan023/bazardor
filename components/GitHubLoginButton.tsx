"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { authClient } from "../lib/auth-client";

export default function GitHubLoginButton() {
  const [pending, setPending] = useState(false);

  async function handleLogin() {
    if (pending) return;

    setPending(true);

    try {
      const result = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/?auth=success",
        errorCallbackURL: "/signin?reason=oauth-error",
      });

      if (result.error) {
        toast.error(
          result.error.message || "GitHub login শুরু করা যায়নি।"
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
      onClick={handleLogin}
      disabled={pending}
      className="w-full rounded-lg border border-[#d6e0d8] bg-[#fafcfb] px-4 py-3 text-sm font-semibold hover:bg-[#e8f3eb] disabled:opacity-60"
    >
      {pending ? "GitHub-এ যাচ্ছে…" : "GitHub দিয়ে চালিয়ে যান"}
    </button>
  );
}