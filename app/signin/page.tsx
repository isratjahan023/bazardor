"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import toast from "react-hot-toast";

import { authClient } from "../../lib/auth-client";
import AuthNotice from "../../components/AuthNotice";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  function showError(message: string) {
    setError(message);
    toast.error(message);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) return;

    setError("");

    const cleanEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      showError("সঠিক ইমেইল ঠিকানা লিখুন।");
      return;
    }

    if (!password) {
      showError("পাসওয়ার্ড লিখুন।");
      return;
    }

    setPending(true);

    try {
      const result = await authClient.signIn.email({
        email: cleanEmail,
        password,
      });

      if (result.error) {
        showError(
          result.error.status === 401
            ? "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।"
            : result.error.message || "সাইন ইন করা যায়নি।"
        );
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে!");
      router.push("/");
      router.refresh();
    } catch {
      showError("সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setPending(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-[#d6e0d8] bg-[#fafcfb] px-3 py-3 text-sm outline-none focus:border-[#008c3e] focus:ring-2 focus:ring-[#e1f2e6]";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
      <Suspense fallback={null}>
        <AuthNotice />
      </Suspense>

      <div className="text-center">
        <h1 className="text-2xl font-bold">সাইন ইন</h1>

        <p className="mt-2 text-sm text-[#667269]">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={pending}
        className="mx-auto mt-7 max-w-sm rounded-2xl border border-[#e3ebe5] bg-[#fafcfb] p-6"
      >
        <fieldset disabled={pending} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm">
              ইমেইল
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm">
              পাসওয়ার্ড
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="আপনার পাসওয়ার্ড"
              required
              className={inputClass}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-[#008c3e] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#007533] disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? "সাইন ইন হচ্ছে…" : "সাইন ইন"}
          </button>
        </fieldset>

        <p className="mt-5 text-center text-sm">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="text-[#008c3e] hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm text-[#667269] hover:underline"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}