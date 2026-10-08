"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } =
    useSession();

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

          <h1 className="mt-4 text-xl font-bold text-gray-900">
            লগইন প্রয়োজন
          </h1>

          <p className="mt-2 text-gray-500">
            Profile দেখতে আগে সাইন ইন করুন।
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

      <div className="mx-auto max-w-3xl">

        {/* Heading */}
        <div>
          <p className="text-sm font-semibold text-green-600">
            My Profile
          </p>

          <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
            Profile Settings
          </h1>

          <p className="mt-2 text-gray-500">
            আপনার account information দেখুন এবং
            আপডেট করুন।
          </p>
        </div>

        {/* Profile Card */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm md:p-8">

          {/* Avatar */}
          <div className="flex flex-col items-center gap-4 border-b pb-6 sm:flex-row">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-700">
              {session.user.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {session.user.name || "User"}
              </h2>

              <p className="text-gray-500">
                {session.user.email}
              </p>
            </div>

          </div>

          {/* Information */}
          <div className="mt-6 space-y-5">

            <div>
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {session.user.name || "Not set"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {session.user.email}
              </p>
            </div>

          </div>

          {/* Update Button */}
          <div className="mt-8 border-t pt-6">

            <Link
              href="/profile/update"
              className="inline-flex rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Update Information
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}