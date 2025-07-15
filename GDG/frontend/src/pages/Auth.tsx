import { useParams } from "react-router-dom";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthSidebar } from "@/components/auth/AuthSidebar";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function Auth() {
  const { mode } = useParams<{ mode: "login" | "register" }>();

  return (
    <div className="min-h-screen flex">
      <AuthSidebar />
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <AuthHeader mode={mode!} />
        {mode === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}