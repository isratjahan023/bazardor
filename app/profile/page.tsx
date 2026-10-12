"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { authClient } from "../../lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, error, refetch } =
    authClient.useSession();

  const notified = useRef(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!isPending && !error && !session) {
      if (!notified.current) {
        toast.error("প্রোফাইল দেখতে আগে সাইন ইন করুন।");
        notified.current = true;
      }

      router.replace("/signin");
    }
  }, [session, isPending, error, router]);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error("সাইন আউট করা যায়নি।");
        return;
      }

      notified.current = true;
      toast.success("সফলভাবে সাইন আউট হয়েছে।");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoggingOut(false);
    }
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p role="alert" className="text-red-600">
          প্রোফাইল লোড করা যায়নি।
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-[#008c3e] px-4 py-2 text-white"
        >
          আবার চেষ্টা করুন
        </button>
      </main>
    );
  }

  if (isPending || !session) {
    return (
      <main
        role="status"
        className="mx-auto max-w-3xl space-y-5 px-4 py-12"
      >
        <span className="sr-only">প্রোফাইল লোড হচ্ছে</span>
        <div className="h-8 w-40 animate-pulse rounded bg-[#e3ebe5]" />
        <div className="h-32 animate-pulse rounded-2xl bg-[#e3ebe5]" />
      </main>
    );
  }

  const user = session.user;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>
      <p className="mt-2 text-sm text-[#667269]">
        আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
      </p>

      <section className="mt-6 flex flex-col gap-5 rounded-2xl border border-[#e3ebe5] bg-[#fafcfb] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#e1f2e6] text-2xl font-bold text-[#008c3e]"
          >
            {user.name.trim().charAt(0).toUpperCase() || "👤"}
          </span>

          <div className="min-w-0">
            <h2 className="break-words text-lg font-semibold">
              {user.name}
            </h2>
            <p className="mt-1 break-all text-sm text-[#667269]">
              {user.email}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="shrink-0 rounded-lg border border-red-400 px-4 py-2 text-sm text-red-500 hover:bg-red-50 disabled:opacity-60"
        >
          {loggingOut ? "সাইন আউট হচ্ছে…" : "সাইন আউট"}
        </button>
      </section>

      <section className="mt-6 rounded-2xl border border-[#e3ebe5] bg-[#fafcfb] p-6">
        <h2 className="font-semibold">তথ্য</h2>

        <dl className="mt-5 space-y-4 text-sm">
          <div>
            <dt className="text-[#667269]">নাম</dt>
            <dd className="mt-1 break-words">{user.name}</dd>
          </div>

          <div>
            <dt className="text-[#667269]">ইমেইল</dt>
            <dd className="mt-1 break-all">{user.email}</dd>
          </div>
        </dl>

        <Link
          href="/profile/update"
          className="mt-6 block rounded-lg bg-[#008c3e] px-4 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#007533]"
        >
          তথ্য আপডেট করুন
        </Link>
      </section>
    </main>
  );
}