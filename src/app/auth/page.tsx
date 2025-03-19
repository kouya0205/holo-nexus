import { AuthForm } from "./authpage";

export default function AuthPage() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between bg-slate-100 pt-10">
        <AuthForm />
      </div>
    </>
  );
}
