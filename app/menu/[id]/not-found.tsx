"use client"
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl">🍕</div>

      <h1 className="mt-5 text-4xl font-bold text-orange-500">
        404
      </h1>

      <h2 className="mt-3 text-2xl font-bold">
        Menu Item Not Found!
      </h2>

      <p className="mt-2 text-gray-500">
        Sorry, we couldnt find the menu item you are looking for.
      </p>

      <Link
        href="/menu"
        className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
      >
        Back to Menu
      </Link>
    </main>
  );
}