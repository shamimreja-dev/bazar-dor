"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      toast.error("ইমেইল এবং পাসওয়ার্ড দিন।");
      return;
    }

    try {
      setLoading(true);

      const { error } = await signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(
          error.message || "লগইন করা যায়নি।"
        );
        return;
      }

      toast.success("সফলভাবে লগইন হয়েছে!");

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 800);
    } catch (error) {
      console.error(error);

      toast.error(
        "লগইন করার সময় সমস্যা হয়েছে।"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignIn(provider) {
    try {
      setSocialLoading(provider);

      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (error) {
      console.error(error);

      if (provider === "google") {
        toast.error(
          "Google দিয়ে সাইন ইন করা যায়নি।"
        );
      } else {
        toast.error(
          "GitHub দিয়ে সাইন ইন করা যায়নি।"
        );
      }

      setSocialLoading("");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8faf7] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border bg-white p-6 shadow-sm md:p-8">

        {/* Header */}
        <div className="text-center">
          <div className="text-5xl">
            🛒
          </div>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            সাইন ইন
          </h1>

          <p className="mt-2 text-gray-500">
            আপনার বাজার দর অ্যাকাউন্টে প্রবেশ করুন।
          </p>
        </div>

        {/* Email & Password Login */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              ইমেইল
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="আপনার ইমেইল"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              পাসওয়ার্ড
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="আপনার পাসওয়ার্ড"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              required
            />
          </div>

          {/* Email Login Button */}
          <button
            type="submit"
            disabled={
              loading || !!socialLoading
            }
            className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "লগইন হচ্ছে..."
              : "সাইন ইন"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />

          <span className="text-sm text-gray-400">
            অথবা
          </span>

          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">

          {/* Google */}
          <button
            type="button"
            onClick={() =>
              handleSocialSignIn("google")
            }
            disabled={
              loading || !!socialLoading
            }
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="text-lg font-bold">
              G
            </span>

            {socialLoading === "google"
              ? "Google দিয়ে লগইন হচ্ছে..."
              : "Continue with Google"}
          </button>

          {/* GitHub */}
          <button
            type="button"
            onClick={() =>
              handleSocialSignIn("github")
            }
            disabled={
              loading || !!socialLoading
            }
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="text-lg">
              ●
            </span>

            {socialLoading === "github"
              ? "GitHub দিয়ে লগইন হচ্ছে..."
              : "Continue with GitHub"}
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          অ্যাকাউন্ট নেই?{" "}

          <Link
            href="/signup"
            className="font-semibold text-green-600 hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </div>
    </main>
  );
}