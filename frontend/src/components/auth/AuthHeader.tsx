import { Link } from "react-router-dom";
import { ArrowLeft, Recycle } from "lucide-react";
import { fadeUp } from "@/utils/animations";

interface AuthHeaderProps {
  mode: "login" | "register";
}

export function AuthHeader({ mode }: AuthHeaderProps) {
  return (
    <>
      <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link>
      
      <div className={fadeUp()}>
        <div className="flex items-center space-x-2 mb-2">
          <div className="bg-gradient-to-r from-eco-500 to-tech-500 p-2 rounded-lg">
            <Recycle className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">ReTronics</span>
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-gray-600 mb-6">
          {mode === "login" 
            ? "Enter your credentials to access your account" 
            : "Join our community to buy and sell electronic waste"
          }
        </p>
      </div>
    </>
  );
}