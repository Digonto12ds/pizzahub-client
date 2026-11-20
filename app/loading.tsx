
import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FFFDF9] px-4">
      {/* Animated Logo */}
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-3xl shadow-lg shadow-orange-200">
          🍕
        </div>
      </div>

      {/* Loading Text */}
      <h2 className="text-2xl font-bold text-gray-900">
        Preparing Your Pizza!
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Please wait while we get things ready...
      </p>

      {/* Loading Indicator */}
      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-orange-600">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        Loading...
      </div>
    </main>
  );
}
