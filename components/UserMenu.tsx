"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { authClient } from "../lib/auth-client";

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending, error, refetch } =
    authClient.useSession();

  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে।");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoggingOut(false);
    }
  }

  if (isPending) {
    return (
      <div role="status">
        <span className="sr-only">প্রোফাইল লোড হচ্ছে</span>
        <div className="h-9 w-24 animate-pulse rounded-lg bg-[#e3ebe5]" />
      </div>
    );
  }

  if (error) {
    return (
      <button
        type="button"
        onClick={() => refetch()}
        className="text-xs text-[#008c3e] underline"
      >
        প্রোফাইল আবার লোড করুন
      </button>
    );
  }

  if (!session) {
    return (
      <div className="flex shrink-0 items-center gap-2 text-xs sm:gap-4 sm:text-sm">
        <Link
          href="/signin"
          className="rounded-lg px-2 py-2 hover:bg-green-50"
        >
          সাইন ইন
        </Link>

        <Link
          href="/signup"
          className="rounded-lg bg-[#008c3e] px-3 py-2 text-white shadow-sm hover:bg-[#007533] sm:px-4"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  const user = session.user;

  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-1 text-sm hover:bg-[#e8f3eb]">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e1f2e6] font-bold text-[#008c3e]"
        >
          {user.name.trim().charAt(0).toUpperCase() || "👤"}
        </span>

        <span className="max-w-24 truncate sm:max-w-40">
          {user.name}
        </span>

        <span aria-hidden="true" className="text-xs text-[#667269]">
          ▾
        </span>
      </summary>

      <div className="absolute right-0 top-full z-50 mt-2 w-60 max-w-[85vw] rounded-2xl border border-[#e3ebe5] bg-[#fafcfb] p-4 shadow-lg">
        <p className="break-words font-semibold">{user.name}</p>
        <p className="mt-1 break-all text-xs text-[#667269]">
          {user.email}
        </p>

        <div className="mt-4 space-y-1">
          <Link
            href="/profile"
            onClick={(event) => {
              event.currentTarget.closest("details")?.removeAttribute("open");
            }}
            className="block rounded-lg px-2 py-2 text-sm hover:bg-[#e8f3eb]"
          >
            আমার প্রোফাইল
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full rounded-lg px-2 py-2 text-left text-sm text-red-500 hover:bg-red-50 disabled:opacity-60"
          >
            {loggingOut ? "সাইন আউট হচ্ছে…" : "সাইন আউট"}
          </button>
        </div>
      </div>
    </details>
  );
}
