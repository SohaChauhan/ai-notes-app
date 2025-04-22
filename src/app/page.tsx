"use client";

import { useUser } from "@/hooks/useUser";
import Notes from "@/components/Notes";
import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (user === null) return <p className="p-6">Redirecting to login...</p>;
  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
        <LogoutButton />
      </div>

      <Notes />
    </main>
  );
}
