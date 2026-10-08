"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: session, isPending } = useSession();

  async function handleLogout() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        {/* Top Navbar */}
        <div className="flex min-h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <div className="text-xl font-bold text-green-700">
              🛒 বাজার দর
            </div>

            <div className="text-xs text-gray-500">
              আজকের বাজারের সর্বশেষ দাম
            </div>
          </Link>

          {/* Desktop Auth */}
          <div className="hidden items-center gap-2 md:flex">
            {isPending ? (
              <span className="text-sm text-gray-500">
                Loading...
              </span>
            ) : session?.user ? (
              <>
                <span className="text-sm text-gray-700">
                  স্বাগতম,{" "}
                  <b>{session.user.name}</b>
                </span>

                <Link
                  href="/profile"
                  className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  প্রোফাইল
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                >
                  সাইন আউট
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/signup"
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border px-3 py-2 md:hidden"
          >
            ☰
          </button>
        </div>

        {/* Category Navigation */}
        <nav className="hidden gap-6 overflow-x-auto border-t py-3 md:flex">
          <Link
            href="/"
            className="whitespace-nowrap font-medium text-green-600"
          >
            সব পণ্য
          </Link>

          <Link
            href="/category/chal"
            className="whitespace-nowrap text-gray-600 hover:text-green-600"
          >
            চাল
          </Link>

          <Link
            href="/category/dal"
            className="whitespace-nowrap text-gray-600 hover:text-green-600"
          >
            ডাল
          </Link>

          <Link
            href="/category/tel"
            className="whitespace-nowrap text-gray-600 hover:text-green-600"
          >
            তেল
          </Link>

          <Link
            href="/category/shobji"
            className="whitespace-nowrap text-gray-600 hover:text-green-600"
          >
            সবজি
          </Link>

          <Link
            href="/category/moshla"
            className="whitespace-nowrap text-gray-600 hover:text-green-600"
          >
            মসলা
          </Link>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-gray-100"
              >
                🏠 সব পণ্য
              </Link>

              <Link
                href="/category/chal"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-gray-100"
              >
                🍚 চাল
              </Link>

              <Link
                href="/category/dal"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-gray-100"
              >
                🫘 ডাল
              </Link>

              <Link
                href="/category/tel"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-gray-100"
              >
                🫗 তেল
              </Link>

              <div className="border-t pt-3">
                {session?.user ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-lg bg-gray-100 px-4 py-2 text-center"
                    >
                      প্রোফাইল
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="rounded-lg bg-red-500 px-4 py-2 text-white"
                    >
                      সাইন আউট
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/signin"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-lg border px-4 py-2 text-center"
                    >
                      সাইন ইন
                    </Link>

                    <Link
                      href="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-lg bg-green-600 px-4 py-2 text-center text-white"
                    >
                      সাইন আপ
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}