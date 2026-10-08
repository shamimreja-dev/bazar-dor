"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session, isPending } = useSession();

  async function handleLogout() {
    try {
      setLoggingOut(true);

      const { error } = await signOut();

      if (error) {
        toast.error(
          error.message || "সাইন আউট করা যায়নি।"
        );
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে!");

      setMenuOpen(false);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        "সাইন আউট করার সময় সমস্যা হয়েছে।"
      );
    } finally {
      setLoggingOut(false);
    }
  }

  function isActive(path) {
    return pathname === path;
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4">

        {/* ================= TOP NAVBAR ================= */}

        <div className="flex min-h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="shrink-0"
            onClick={() => setMenuOpen(false)}
          >
            <div className="text-xl font-bold text-green-700">
              🛒 বাজার দর
            </div>

            <div className="text-xs text-gray-500">
              আজকের বাজারের সর্বশেষ দাম
            </div>
          </Link>

          {/* ================= DESKTOP AUTH ================= */}

          <div className="hidden items-center gap-2 md:flex">

            {isPending ? (
              <span className="text-sm text-gray-500">
                Loading...
              </span>
            ) : session?.user ? (
              <>
                <span className="text-sm text-gray-700">
                  স্বাগতম,{" "}
                  <b>
                    {session.user.name || "User"}
                  </b>
                </span>

                {/* Profile */}
                <Link
                  href="/profile"
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    isActive("/profile")
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  প্রোফাইল
                </Link>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loggingOut
                    ? "সাইন আউট..."
                    : "সাইন আউট"}
                </button>
              </>
            ) : (
              <>
                {/* Sign In */}
                <Link
                  href="/signin"
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    isActive("/signin")
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  সাইন ইন
                </Link>

                {/* Sign Up */}
                <Link
                  href="/signup"
                  className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition ${
                    isActive("/signup")
                      ? "bg-green-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>

          {/* ================= MOBILE BUTTON ================= */}

          <button
            type="button"
            onClick={() =>
              setMenuOpen((previous) => !previous)
            }
            className="rounded-lg border px-3 py-2 md:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* ================= CATEGORY NAVIGATION ================= */}

        <nav className="hidden gap-6 overflow-x-auto border-t py-3 md:flex">

          {/* All Products */}
          <Link
            href="/"
            className={`whitespace-nowrap font-medium ${
              isActive("/")
                ? "text-green-600"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            সব পণ্য
          </Link>

          {/* Chal */}
          <Link
            href="/category/chal"
            className={`whitespace-nowrap font-medium ${
              isActive("/category/chal")
                ? "text-green-600"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            চাল
          </Link>

          {/* Dal */}
          <Link
            href="/category/dal"
            className={`whitespace-nowrap font-medium ${
              isActive("/category/dal")
                ? "text-green-600"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            ডাল
          </Link>

          {/* Tel */}
          <Link
            href="/category/tel"
            className={`whitespace-nowrap font-medium ${
              isActive("/category/tel")
                ? "text-green-600"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            তেল
          </Link>

          {/* Shobji */}
          <Link
            href="/category/shobji"
            className={`whitespace-nowrap font-medium ${
              isActive("/category/shobji")
                ? "text-green-600"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            সবজি
          </Link>

          {/* Moshla */}
          <Link
            href="/category/moshla"
            className={`whitespace-nowrap font-medium ${
              isActive("/category/moshla")
                ? "text-green-600"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            মসলা
          </Link>
        </nav>

        {/* ================= MOBILE MENU ================= */}

        {menuOpen && (
          <div className="border-t py-4 md:hidden">

            <div className="flex flex-col gap-3">

              {/* Home */}
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2 ${
                  isActive("/")
                    ? "bg-green-100 font-semibold text-green-700"
                    : "hover:bg-gray-100"
                }`}
              >
                🏠 সব পণ্য
              </Link>

              {/* Chal */}
              <Link
                href="/category/chal"
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2 ${
                  isActive("/category/chal")
                    ? "bg-green-100 font-semibold text-green-700"
                    : "hover:bg-gray-100"
                }`}
              >
                🍚 চাল
              </Link>

              {/* Dal */}
              <Link
                href="/category/dal"
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2 ${
                  isActive("/category/dal")
                    ? "bg-green-100 font-semibold text-green-700"
                    : "hover:bg-gray-100"
                }`}
              >
                🫘 ডাল
              </Link>

              {/* Tel */}
              <Link
                href="/category/tel"
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2 ${
                  isActive("/category/tel")
                    ? "bg-green-100 font-semibold text-green-700"
                    : "hover:bg-gray-100"
                }`}
              >
                🫗 তেল
              </Link>

              {/* Shobji */}
              <Link
                href="/category/shobji"
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2 ${
                  isActive("/category/shobji")
                    ? "bg-green-100 font-semibold text-green-700"
                    : "hover:bg-gray-100"
                }`}
              >
                🥬 সবজি
              </Link>

              {/* Moshla */}
              <Link
                href="/category/moshla"
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2 ${
                  isActive("/category/moshla")
                    ? "bg-green-100 font-semibold text-green-700"
                    : "hover:bg-gray-100"
                }`}
              >
                🌶️ মসলা
              </Link>

              {/* ================= MOBILE AUTH ================= */}

              <div className="border-t pt-3">

                {isPending ? (
                  <div className="rounded-lg bg-gray-100 px-4 py-3 text-center text-sm text-gray-500">
                    Loading...
                  </div>
                ) : session?.user ? (
                  <div className="flex flex-col gap-2">

                    {/* Mobile Profile */}
                    <Link
                      href="/profile"
                      onClick={() =>
                        setMenuOpen(false)
                      }
                      className={`rounded-lg px-4 py-2 text-center ${
                        isActive("/profile")
                          ? "bg-green-100 font-semibold text-green-700"
                          : "bg-gray-100"
                      }`}
                    >
                      👤 প্রোফাইল
                    </Link>

                    {/* Mobile Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="rounded-lg bg-red-500 px-4 py-2 text-white disabled:opacity-60"
                    >
                      {loggingOut
                        ? "সাইন আউট..."
                        : "সাইন আউট"}
                    </button>

                  </div>
                ) : (
                  <div className="flex flex-col gap-2">

                    {/* Mobile Sign In */}
                    <Link
                      href="/signin"
                      onClick={() =>
                        setMenuOpen(false)
                      }
                      className={`rounded-lg border px-4 py-2 text-center ${
                        isActive("/signin")
                          ? "border-green-600 bg-green-50 text-green-700"
                          : ""
                      }`}
                    >
                      সাইন ইন
                    </Link>

                    {/* Mobile Sign Up */}
                    <Link
                      href="/signup"
                      onClick={() =>
                        setMenuOpen(false)
                      }
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