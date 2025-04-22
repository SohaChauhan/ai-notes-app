import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="flex justify-center items-center h-screen">
      <AuthForm type="login" />
    </main>
  );
}
