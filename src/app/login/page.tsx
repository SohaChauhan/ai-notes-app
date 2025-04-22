import AuthForm from "@/components/AuthForm";
import ThemeSwitch from "@/components/ThemeSwitch";
export default function LoginPage() {
  return (
    <main className="flex justify-center items-center h-screen">
      <div className="fixed top-4 right-4">
        <ThemeSwitch />
      </div>
      <AuthForm type="login" />
    </main>
  );
}
