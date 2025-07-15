import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GradientButton } from "@/components/GradientButton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { fadeUp } from "@/utils/animations";
import { login } from "@/services/authService";

export function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(formData);
      localStorage.setItem('token', data.token);
      navigate('/marketplace');
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Card className={`border-gray-200 shadow-sm ${fadeUp(100)}`}>
      <CardContent className="pt-6">
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="john.doe@example.com" value={formData.email} onChange={handleChange} />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/auth/forgot-password" className="text-xs text-eco-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
            </div>
            
            {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
            
            <GradientButton type="submit" className="w-full mt-6">
              Log in
            </GradientButton>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center p-6 border-t bg-gray-50 text-sm">
        <p>
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-eco-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}