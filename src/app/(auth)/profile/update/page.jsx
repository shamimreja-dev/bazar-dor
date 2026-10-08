"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function UpdateProfilePage() {
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const [name, setName] = useState(
    session?.user?.name || ""
  );

  const [loading, setLoading] = useState(false);

  async function handleUpdate(e) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("নাম লিখুন।");
      return;
    }

    try {
      setLoading(true);

      const { error } =
        await authClient.updateUser({
          name: name.trim(),
        });

      if (error) {
        toast.error(
          error.message ||
            "তথ্য আপডেট করা যায়নি।"
        );
        return;
      }

      toast.success(
        "তথ্য সফলভাবে আপডেট হয়েছে!"
      );

      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        "তথ্য আপডেট করার সময় সমস্যা হয়েছে।"
      );
    } finally {
      setLoading(false);
    }
  }

  if (isPending) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />

          <p className="mt-4 text-gray-500">
            Loading...
          </p>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">

          <div className="text-5xl">
            🔐
          </div>

          <h1 className="mt-4 text-xl font-bold">
            লগইন প্রয়োজন
          </h1>

          <p className="mt-2 text-gray-500">
            Profile update করতে আগে সাইন ইন করুন।
          </p>

          <Link
            href="/signin"
            className="mt-6 inline-block rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            সাইন ইন
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-gray-50 px-4 py-12">

      <div className="mx-auto max-w-xl">

        {/* Back */}
        <Link
          href="/profile"
          className="text-sm font-medium text-green-600 hover:underline"
        >
          ← Profile এ ফিরে যান
        </Link>

        {/* Form Card */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm md:p-8">

          <h1 className="text-2xl font-bold text-gray-900">
            Update Information
          </h1>

          <p className="mt-2 text-gray-500">
            আপনার profile information আপডেট করুন।
          </p>

          <form
            onSubmit={handleUpdate}
            className="mt-8 space-y-5"
          >

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="আপনার নাম"
                className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Email */}
            <div>
              <label
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email
              </label>

              <input
                type="email"
                value={session.user.email || ""}
                disabled
                className="w-full cursor-not-allowed rounded-xl border bg-gray-100 px-4 py-3 text-gray-500"
              />

              <p className="mt-2 text-xs text-gray-400">
                Email পরিবর্তন করা যাবে না।
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Updating..."
                  : "Update Information"}
              </button>

              <Link
                href="/profile"
                className="flex-1 rounded-xl border px-5 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>

            </div>

          </form>

        </div>

      </div>

    </main>
  );
}