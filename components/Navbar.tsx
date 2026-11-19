"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  UserRound,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"

import { Button } from "@/components/ui/button"

function ProfileAvatar({
  image,
  name,
  size = 36,
}: {
  image?: string | null
  name?: string | null
  size?: number
}) {
  const [imageError, setImageError] = useState(false)

  if (!image || imageError) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex shrink-0 items-center justify-center rounded-full bg-[#C93627] text-sm font-bold text-white"
      >
        {name?.charAt(0).toUpperCase() || "U"}
      </div>
    )
  }

  return (
    <Image
      src={image}
      alt={name || "User"}
      width={size}
      height={size}
      unoptimized
      onError={() => setImageError(true)}
      className="shrink-0 rounded-full object-cover"
    />
  )
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  // Get current authentication session
  const { data: session, isPending } = authClient.useSession()

  const user = session?.user

  console.log("Session:", session);
console.log("User image:", user?.image);
  // Get user role
  const role = (user as (typeof user & { role?: string }) | undefined)?.role

  // Role-based dashboard URL
  const dashboardLinks: Record<string, string> = {
    customer: "/customer-dashboard",
    vendor: "/vendor-dashboard",
    admin: "/admin-dashboard",
  }

  const dashboardLink = role ? dashboardLinks[role] : undefined

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Menu", href: "/menu" },
  ]

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setMobileMenuOpen(false)
          router.push("/")
          router.refresh()
        },
      },
    })
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-100 bg-[#FFFDF9]/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">

          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-[#C93627]">
              PizzaHub<span className="text-[#F2A43A]">.</span>
            </span>

            <span className="-mt-1 text-[9px] font-bold tracking-[2px] text-[#9A8270]">
              FRESH · HOT · DELICIOUS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive(link.href)
                  ? "bg-orange-100 text-[#C93627]"
                  : "text-[#5F5148] hover:bg-orange-50 hover:text-[#C93627]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-orange-100" />
          ) : user ? (
            <>
              {dashboardLink && (
                <Link
                  href={dashboardLink}
                  className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-[#5F5148] transition hover:bg-orange-50 hover:text-[#C93627]"
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>
              )}

              <div className="group relative">
                <button className="flex items-center gap-2 rounded-full border border-orange-100 bg-white py-1.5 pr-3 pl-1.5 transition hover:border-orange-300">
                  <ProfileAvatar
  image={user.image}
  name={user.name}
  size={36}
/>

                  <span className="max-w-24 truncate text-sm font-semibold text-[#49372C]">
                    {user.name}
                  </span>

                  <ChevronDown size={15} className="text-gray-500" />
                </button>

                {/* Profile Dropdown */}
                <div className="invisible absolute top-full right-0 z-50 mt-2 w-52 translate-y-2 rounded-2xl border border-orange-100 bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50"
                  >
                    <UserRound size={17} />
                    Profile Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-full px-5 py-2.5 text-sm font-bold text-[#49372C] transition hover:bg-orange-50"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-full bg-[#C93627] px-6 py-3 text-sm font-bold text-white shadow-md shadow-red-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#A92D21] hover:shadow-lg"
              >
                Get Started <span className="ml-1">↗</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#C93627] transition hover:bg-orange-100 md:hidden"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-orange-100 bg-[#FFFDF9] px-5 py-5 shadow-lg md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                  isActive(link.href)
                    ? "bg-orange-100 text-[#C93627]"
                    : "text-[#5F5148] hover:bg-orange-50"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="my-2 border-t border-orange-100" />

            {isPending ? (
              <div className="h-10 animate-pulse rounded-xl bg-orange-100" />
            ) : user ? (
              <>
                <div className="flex items-center gap-3 rounded-xl bg-orange-50 p-3">
                  <ProfileAvatar
  image={user.image}
  name={user.name}
  size={40}
/>

                  <div>
                    <p className="text-sm font-bold text-[#49372C]">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{role || "User"}</p>
                  </div>
                </div>

                {dashboardLink && (
                  <Link
                    href={dashboardLink}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#5F5148] hover:bg-orange-50"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                )}

                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#5F5148] hover:bg-orange-50"
                >
                  <UserRound size={18} />
                  Profile Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-orange-200"
                  >
                    Sign In
                  </Button>
                </Link>

                <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-full bg-[#C93627] text-white hover:bg-[#A92D21]">
                    Get Started ↗
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
