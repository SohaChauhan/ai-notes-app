"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function AuthForm({ type }: { type: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    setLoading(true);
    if (type === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert(error.message);
      else router.push("/dashboard");
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else router.push("/login");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) alert(error.message);
  };

  return (
    <div className="max-w-md w-full p-4 border rounded-xl shadow-xl space-y-4 text-center">
      <h2 className="text-xl font-bold">
        {type === "login" ? "Log In" : "Sign Up"}
      </h2>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleAuth} disabled={loading}>
        {loading ? "Loading..." : type === "login" ? "Login" : "Sign Up"}
      </Button>
      <p className="space-x-1">
        {type === "login" ? (
          <>
            <span className="">Don't have an account?</span>
            <Link href="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <span className="">Already have an account?</span>
            <Link href="/login" className="text-blue-500">
              Log In
            </Link>
          </>
        )}
      </p>
      <div className="text-center text-sm">or</div>
      <Button variant="outline" onClick={handleGoogleLogin}>
        Continue with Google
      </Button>
    </div>
  );
}
