"use client";

import { useUser } from "@/hooks/useUser";
import Notes from "@/components/Notes";
import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ThemeSwitch from "@/components/ThemeSwitch";

export default function HomePage() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user != null) {
      router.push("/dashboard");
    }
  }, [user]);

  // if (user === null) return <p className="p-6">Redirecting to login...</p>;
  // if (!user) return <p className="p-6">Loading...</p>;

  return (
    <>
      <div className="fixed top-4 right-4">
        <ThemeSwitch />
      </div>
      <div className="container flex flex-col items-center justify-center min-h-screen gap-5">
        <h1 className="text-5xl">Welcome to Notes App</h1>

        <Link href="/signup" className={buttonVariants({ variant: "default" })}>
          Get Started
        </Link>
      </div>
    </>
  );
}
