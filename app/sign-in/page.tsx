"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { ArrowRight, Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import toast from "react-hot-toast"

type UserRole = "customer" | "vendor" | "admin"

const dashboardRoutes: Record<UserRole, string> = {
  customer: "/customer-dashboard",
  vendor: "/vendor-dashboard",
  admin: "/admin-dashboard",
}

export default function SignInPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")

  // Redirect user based on their actual authenticated role
  const redirectUser = async () => {
    const { data: session, error: sessionError } = await authClient.getSession()

    if (sessionError || !session) {
      router.replace("/")
      return
    }

    const user = session.user as typeof session.user & {
      role?: string
    }

    const role = user.role as UserRole | undefined

    if (!role || !Object.hasOwn(dashboardRoutes, role)) {
      router.replace("/")
      return
    }

    const params = new URLSearchParams(window.location.search)
    const callbackURL = params.get("callbackURL")

    const isValidCallback =
      callbackURL?.startsWith("/") && !callbackURL.startsWith("//")

    router.replace(
      isValidCallback && callbackURL ? callbackURL : dashboardRoutes[role]
    )
    router.refresh()
  }

  // Email and password login
  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { error: signInError } = await authClient.signIn.email({
        email: email.trim(),
        password,
      })

      if (signInError) {
        setError(signInError.message || "Invalid email or password.")
        return
      }

      toast.success("Login successful!")

      await redirectUser()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Google login
  const handleGoogleSignIn = async () => {
    setError("")
    setGoogleLoading(true)

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth-redirect",
      })
    } catch {
      setError("Google login failed. Please try again.")
      setGoogleLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#FFF9F0] px-4 py-12 sm:px-6">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-80 w-80 rounded-full bg-red-200/40 blur-3xl" />

      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-2xl shadow-orange-950/10 lg:grid-cols-2">
        {/* Left Side */}
        <div className="relative hidden min-h-155 flex-col justify-between overflow-hidden bg-[#35100A] p-10 lg:flex">
          <Image
            src="/Banner.png"
            alt="Fresh Pizza"
            fill
            sizes="50vw"
            className="object-cover opacity-40"
          />

          <div className="absolute inset-0 bg-linear-to-t from-[#210500] via-[#35100A]/50 to-[#35100A]/30" />

          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/pizzahub-log.png"
                alt="PizzaHub"
                width={48}
                height={48}
                className="rounded-xl"
              />
              <span className="text-2xl font-black text-white">
                PizzaHub<span className="text-orange-400">.</span>
              </span>
            </Link>
          </div>

          <div className="relative z-10 max-w-md">
            <span className="mb-5 inline-block rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-xs font-bold tracking-widest text-orange-300 uppercase">
              Welcome Back
            </span>

            <h2 className="text-4xl leading-tight font-black text-white xl:text-5xl">
              Your Pizza
              <br />
              Journey
              <br />
              <span className="text-orange-400">Continues Here.</span>
            </h2>

            <p className="mt-6 text-sm leading-7 text-white/70">
              Sign in to discover delicious pizzas, manage your orders, and
              enjoy everything PizzaHub has to offer.
            </p>
          </div>

          <p className="relative z-10 text-xs text-white/50">
            Fresh · Hot · Delicious — PizzaHub
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          {/* Mobile Logo */}
          <Link href="/" className="mb-8 flex items-center gap-3 lg:hidden">
            <Image
              src="/pizzahub-log.png"
              alt="PizzaHub"
              width={42}
              height={42}
              className="rounded-xl"
            />
            <span className="text-2xl font-black text-[#C93627]">
              PizzaHub<span className="text-orange-400">.</span>
            </span>
          </Link>

          <div className="mb-8">
            <p className="text-sm font-bold tracking-widest text-[#D36A32] uppercase">
              Welcome Back
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#351A13] sm:text-4xl">
              Sign In
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#8A766B]">
              Enter your details to access your PizzaHub account.
            </p>
          </div>

          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full border-gray-300 bg-white text-black hover:bg-gray-100 hover:text-red-900"
          >
            {googleLoading ? (
              <Loader2 className="mr-2 animate-spin" size={18} />
            ) : (
              <FcGoogle />
            )}
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-orange-100" />
            <span className="text-xs font-medium text-[#A8988C]">
              OR CONTINUE WITH EMAIL
            </span>
            <div className="h-px flex-1 bg-orange-100" />
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#49372C]">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-[#AD988A]"
                />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border border-orange-100 bg-[#FFFCF8] pr-4 pl-11 text-sm text-[#49372C] transition outline-none focus:border-[#D93627] focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#49372C]">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-[#AD988A]"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-12 w-full rounded-xl border border-orange-100 bg-[#FFFCF8] pr-12 pl-11 text-sm text-[#49372C] transition outline-none focus:border-[#D93627] focus:ring-2 focus:ring-red-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-[#AD988A] hover:text-[#C93627]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || googleLoading || !email || !password}
              className="h-13 w-full rounded-xl bg-[#C93627] text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-[#A92D21] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={18} />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In to PizzaHub
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-[#8A766B]">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-bold text-[#C93627] transition hover:text-[#A92D21]"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
