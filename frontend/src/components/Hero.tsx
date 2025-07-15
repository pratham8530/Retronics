import { useEffect, useState } from "react";
import { GradientButton } from "@/components/GradientButton";
import { fadeUp } from "@/utils/animations";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      const user = localStorage.getItem("user");
      if (user && user !== "undefined") {
        try {
          const parsedUser = JSON.parse(user);
          setUserType(parsedUser.userType);
        } catch (error) {
          console.error("Failed to parse user JSON:", error);
        }
      }
    }
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[40%] h-[40%] rounded-full bg-eco-100 opacity-20 blur-3xl" />
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[40%] h-[40%] rounded-full bg-tech-100 opacity-20 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className={`inline-block px-4 py-1.5 mb-6 text-sm font-medium text-eco-800 bg-eco-100 rounded-full ${fadeUp()}`}>
            Sustainable e-waste management
          </span>
          
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 ${fadeUp(100)}`}>
            <span className="block">Give Electronics a</span>
            <span className="bg-gradient-to-r from-eco-600 to-tech-600 bg-clip-text text-transparent">
              Second Life
            </span>
          </h1>
          
          <p className={`text-lg md:text-xl text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto ${fadeUp(200)}`}>
            Connect with buyers and sellers to responsibly trade e-waste,
            reduce electronic pollution, and contribute to a circular economy.
          </p>
          
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${fadeUp(300)}`}>
            <Link to="/marketplace">
              <GradientButton 
                variant="outline" 
                size="lg" 
                className="min-w-[180px] border-gray-300 bg-white text-white hover:bg-gray-50"
              >
                Browse Marketplace
              </GradientButton>
            </Link>

            {!isAuthenticated && (
              <Link to="/auth/register">
                <GradientButton size="lg" className="min-w-[180px]">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </GradientButton>
              </Link>
            )}
          </div>
          
          <div className={`mt-16 flex flex-col md:flex-row items-center justify-center gap-8 ${fadeUp(400)}`}>
            <div className="flex flex-col items-center">
              <p className="text-3xl md:text-4xl font-bold text-gray-900">10K+</p>
              <p className="text-gray-600">Items Listed</p>
            </div>
            <div className="h-12 w-px bg-gray-200 hidden md:block"></div>
            <div className="flex flex-col items-center">
              <p className="text-3xl md:text-4xl font-bold text-gray-900">5K+</p>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="h-12 w-px bg-gray-200 hidden md:block"></div>
            <div className="flex flex-col items-center">
              <p className="text-3xl md:text-4xl font-bold text-gray-900">95%</p>
              <p className="text-gray-600">Recycling Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
