"use client";

import { useUser } from "@/hooks/useUser";
import Notes from "@/components/Notes";
import LogoutButton from "@/components/LogoutButton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ThemeSwitch from "../../components/ThemeSwitch";

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

  if (user === null) {
    return;
  } else {
    return (
      <main className="p-6 space-y-6 bg-accent">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Notes</h2>
          <div className="flex space-x-5 items-center">
            <LogoutButton />
            <ThemeSwitch />
          </div>
        </div>

        <Notes />
      </main>
    );
  }
}
