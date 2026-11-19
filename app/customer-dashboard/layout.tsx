
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { authClient } from "@/lib/auth-client"
import Unauthorised from "@/lib/core/unauthorise"

import { Skeleton } from "@/components/ui/skeleton"

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const { data: session, isPending } = authClient.useSession()

  // Get the logged-in user's role
  const role = (
    session?.user as { role?: string } | undefined
  )?.role

  // Redirect users who are not logged in
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in")
    }
  }, [isPending, session, router])

  // Show loading while checking authentication
  if (isPending) {
    return (
      <main className="min-h-screen bg-[#FFF9F0] px-4 py-10">
        <div className="mx-auto max-w-7xl space-y-5">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </main>
    )
  }

  // Don't render dashboard while redirecting
  if (!session) {
    return null
  }

  // Only customers can access this dashboard
  if (role !== "customer") {
    return <Unauthorised />
  }

  // Allow customer access
  return <>{children}</>
}
