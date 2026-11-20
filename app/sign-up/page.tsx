"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Store,
  UserRound,
  ImagePlus,
  Loader2,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import toast from "react-hot-toast";

type AccountRole = "customer" | "vendor"

export default function SignUpPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [image, setImage] = useState("")
  const [role, setRole] = useState<AccountRole>("customer")

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")

  // Password validation
  const hasMinLength = password.length >= 6
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)

  const passwordValid = hasMinLength && hasUppercase && hasLowercase

  // Email validation
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Please enter your full name.")
      return
    }

    if (!emailValid) {
      setError("Please enter a valid email address.")
      return
    }

    if (!passwordValid) {
      setError("Please meet all password requirements.")
      return
    }

    setLoading(true)

    try {
      const { error: signUpError } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: image.trim() || undefined,
        role,
        callbackURL: "/",
      })

      if (signUpError) {
        setError(signUpError.message || "Unable to create your account.")
        return
      }

      toast.success("Signup successful!");

      // Redirect according to the selected account role
      const dashboardRoutes: Record<AccountRole, string> = {
        customer: "/customer-dashboard",
        vendor: "/vendor-dashboard",
      }

      router.push(dashboardRoutes[role])
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setError("")
    setGoogleLoading(true)

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      })
    } catch {
      setError("Google sign up failed. Please try again.")
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
        <div className="relative hidden min-h-175 flex-col justify-between overflow-hidden bg-[#35100A] p-10 lg:flex">

          <div className="absolute inset-0 bg-linear-to-t from-[#210500] via-[#35100A]/50 to-[#35100A]/30" />

          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-2xl font-black text-[#C93627]">
                PizzaHub<span className="text-orange-400">.</span>
              </span>
            </Link>
          </div>

          <div className="relative z-10 max-w-md">
            <span className="mb-5 inline-block rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-xs font-bold tracking-widest text-orange-300 uppercase">
              Join the Pizza Lovers
            </span>

            <h2 className="text-4xl leading-tight font-black text-white xl:text-5xl">
              Good Pizza.
              <br />
              Great Moments.
              <br />
              <span className="text-orange-400">Your Place.</span>
            </h2>

            <p className="mt-6 text-sm leading-7 text-white/70">
              Discover your favorite local pizza shops, enjoy mouthwatering
              flavors, or grow your restaurant business with PizzaHub.
            </p>
          </div>

          <p className="relative z-10 text-xs text-white/50">
            Fresh · Hot · Delicious — PizzaHub
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="p-6 sm:p-10 lg:p-12">
          {/* Mobile Logo */}
          <Link href="/" className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="text-2xl font-black text-[#C93627]">
              PizzaHub<span className="text-orange-400">.</span>
            </span>
          </Link>

          <div className="mb-8">
            <p className="text-sm font-bold tracking-widest text-[#D36A32] uppercase">
              Get Started
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#351A13] sm:text-4xl">
              Create Account
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#8A766B]">
              Join PizzaHub and discover something delicious today.
            </p>
          </div>

          {/* Google Signup */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignUp}
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

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-orange-100" />
            <span className="text-xs font-medium text-[#A8988C]">
              OR REGISTER WITH EMAIL
            </span>
            <div className="h-px flex-1 bg-orange-100" />
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#49372C]">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-[#AD988A]"
                />

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="h-12 w-full rounded-xl border border-orange-100 bg-[#FFFCF8] pr-4 pl-11 text-sm text-[#49372C] transition outline-none focus:border-[#D93627] focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

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
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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

              {/* Password Requirements */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <p
                  className={hasMinLength ? "text-green-600" : "text-[#A8988C]"}
                >
                  {hasMinLength ? "✓" : "○"} At least 6 characters
                </p>

                <p
                  className={hasUppercase ? "text-green-600" : "text-[#A8988C]"}
                >
                  {hasUppercase ? "✓" : "○"} One uppercase letter
                </p>

                <p
                  className={hasLowercase ? "text-green-600" : "text-[#A8988C]"}
                >
                  {hasLowercase ? "✓" : "○"} One lowercase letter
                </p>
              </div>
            </div>

            {/* Optional Profile Image URL */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#49372C]">
                Profile Image{" "}
                <span className="font-normal text-[#A8988C]">(Optional)</span>
              </label>

              <div className="relative">
                <ImagePlus
                  size={18}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-[#AD988A]"
                />

                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="h-12 w-full rounded-xl border border-orange-100 bg-[#FFFCF8] pr-4 pl-11 text-sm text-[#49372C] transition outline-none focus:border-[#D93627] focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            {/* Account Role */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#49372C]">
                Choose Account Type
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                    role === "customer"
                      ? "border-[#C93627] bg-red-50 ring-1 ring-[#C93627]"
                      : "border-orange-100 bg-[#FFFCF8] hover:border-orange-300"
                  }`}
                >
                  <UserRound
                    size={21}
                    className={
                      role === "customer" ? "text-[#C93627]" : "text-[#A8988C]"
                    }
                  />

                  <span>
                    <span className="block text-sm font-bold text-[#49372C]">
                      Customer
                    </span>
                    <span className="block text-[10px] text-[#A8988C]">
                      Order delicious pizza
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("vendor")}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                    role === "vendor"
                      ? "border-[#C93627] bg-red-50 ring-1 ring-[#C93627]"
                      : "border-orange-100 bg-[#FFFCF8] hover:border-orange-300"
                  }`}
                >
                  <Store
                    size={21}
                    className={
                      role === "vendor" ? "text-[#C93627]" : "text-[#A8988C]"
                    }
                  />

                  <span>
                    <span className="block text-sm font-bold text-[#49372C]">
                      Vendor
                    </span>
                    <span className="block text-[10px] text-[#A8988C]">
                      Manage your restaurant
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* Error Message */}
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
              disabled={
                loading || googleLoading || !passwordValid || !emailValid
              }
              className="h-13 w-full rounded-xl bg-[#C93627] text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-[#A92D21] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={18} />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-[#8A766B]">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-bold text-[#C93627] transition hover:text-[#A92D21]"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
