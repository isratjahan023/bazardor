"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";

import { authClient } from "../../lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      showError("আপনার নাম লিখুন।");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      showError("সঠিক ইমেইল ঠিকানা লিখুন।");
      return;
    }

    if (password.length < 8) {
      showError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      showError("দুটি পাসওয়ার্ড মিলছে না।");
      return;
    }

    setPending(true);

    try {
      const result = await authClient.signUp.email({
        name: cleanName,
        email: cleanEmail,
        password,
      });

      if (result.error) {
        showError(
          result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।"
        );
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এবার সাইন ইন করুন।");
      router.push("/signin");
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
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          অ্যাকাউন্ট তৈরি করুন
        </h1>

        <p className="mt-2 text-sm text-[#667269]">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
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
            <label htmlFor="name" className="text-sm">
              নাম
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="আপনার নাম"
              required
              className={inputClass}
            />
          </div>

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
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              minLength={8}
              maxLength={128}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="text-sm">
              পাসওয়ার্ড নিশ্চিত করুন
            </label>

            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="আবার লিখুন"
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
            {pending ? "তৈরি হচ্ছে…" : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </fieldset>

        <p className="mt-5 text-center text-sm">
          অ্যাকাউন্ট আছে?{" "}
          <Link href="/signin" className="text-[#008c3e] hover:underline">
            সাইন ইন করুন
          </Link>
        </p>
      </form>

      <div className="mt-6 text-center">
        <Link href="/" className="text-sm text-[#667269] hover:underline">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}