
"use client"

import Link from "next/link"
import { ShieldAlert, ArrowLeft, Home } from "lucide-react"

export default function Unauthorised() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#FFF9F0] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <ShieldAlert className="h-10 w-10 text-[#C93627]" />
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-2xl font-bold text-[#35100A]">
          Access Denied!
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm leading-6 text-gray-500">
          Sorry, you do not have permission to access this page.
          This dashboard is available to registered customers only.
        </p>

        {/* Actions */}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-[#C93627] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#a92b20]"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <Link
            href="/menu"
            className="inline-flex h-10 items-center justify-center rounded-md border border-[#C93627] px-4 py-2 text-sm font-medium text-[#C93627] transition-colors hover:bg-orange-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Browse Menu
          </Link>
        </div>
      </div>
    </main>
  )
}
