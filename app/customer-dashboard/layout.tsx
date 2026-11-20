
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import Unauthorised from "@/lib/core/unauthorise";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const role = (
    session?.user as { role?: string } | undefined
  )?.role;

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <main
        className="min-h-screen px-4 py-10 sm:px-6"
        style={{ backgroundColor: "#FFF9F0" }}
      >
        <div className="mx-auto max-w-7xl space-y-6">
          <div
            className="h-9 w-56 animate-pulse rounded-lg"
            style={{ backgroundColor: "#EEE5DC" }}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-2xl border"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#F0E3D8",
                }}
              />
            ))}
          </div>

          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-2xl border"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#F0E3D8",
                }}
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  if (role !== "customer") {
    return <Unauthorised />;
  }

  return <>{children}</>;
}
