
"use client"
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFFDF9] px-4 py-12">
      <div className="w-full max-w-lg text-center">

        {/* Pizza Illustration */}
        <div className="mb-6 text-8xl">
          🍕
        </div>

        {/* 404 */}
        <h1 className="text-8xl font-extrabold tracking-tight text-orange-500 sm:text-9xl">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
          Oops! Page Not Found
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500 sm:text-base">
          Looks like this page is not on our menu.
          The page you are looking for might have been removed
          or the URL may be incorrect.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        <p className="mt-10 text-sm font-semibold text-orange-500">
          🍕 PizzaHub — Freshness Delivered!
        </p>
      </div>
    </main>
  );
}
