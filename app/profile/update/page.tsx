"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import toast from "react-hot-toast";

import { authClient } from "../../../lib/auth-client";


export default function UpdateProfilePage() {
  const router = useRouter();

  const { data: session, isPending, error, refetch } =
    authClient.useSession();

  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState("");

  const initialized = useRef(false);
  const notified = useRef(false);

  useEffect(() => {
    if (session && !initialized.current) {
      setName(session.user.name);
      initialized.current = true;
    }

    if (!isPending && !error && !session) {
      if (!notified.current) {
        toast.error("তথ্য আপডেট করতে আগে সাইন ইন করুন।");
        notified.current = true;
      }

      router.replace("/signin");
    }
  }, [session, isPending, error, router]);

  function showError(message: string) {
    setFormError(message);
    toast.error(message);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending || !session) return;

    setFormError("");

    const cleanName = name.trim();

    if (!cleanName) {
      showError("আপনার নাম লিখুন।");
      return;
    }

    if (cleanName === session.user.name) {
      toast("নাম পরিবর্তন করে তারপর আপডেট করুন।");
      return;
    }

    setPending(true);

    try {
      const result = await authClient.updateUser({
        name: cleanName,
      });

      if (result.error) {
        showError(
          result.error.message || "তথ্য আপডেট করা যায়নি।"
        );
        return;
      }

      toast.success("আপনার নাম আপডেট হয়েছে!");
      await refetch();

      router.push("/profile");
      router.refresh();
    } catch {
      showError("সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setPending(false);
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
        <div className="h-8 w-48 animate-pulse rounded bg-[#e3ebe5]" />
        <div className="h-48 animate-pulse rounded-2xl bg-[#e3ebe5]" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <h1 className="text-2xl font-bold">তথ্য আপডেট করুন</h1>

      <p className="mt-2 text-sm text-[#667269]">
        আপনার প্রোফাইলের নাম পরিবর্তন করুন।
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={pending}
        className="mt-6 rounded-2xl border border-[#e3ebe5] bg-[#fafcfb] p-6"
      >
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
          disabled={pending}
          required
          className="mt-2 w-full rounded-lg border border-[#d6e0d8] bg-[#fafcfb] px-3 py-3 text-sm outline-none focus:border-[#008c3e] focus:ring-2 focus:ring-[#e1f2e6]"
        />

        {formError && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-5 w-full rounded-lg bg-[#008c3e] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#007533] disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "আপডেট হচ্ছে…" : "তথ্য আপডেট করুন"}
        </button>
      </form>

      <Link
        href="/profile"
        className="mt-6 inline-block text-sm text-[#667269] hover:underline"
      >
        ← প্রোফাইলে ফিরে যান
      </Link>
    </main>
  );
}
