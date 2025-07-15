import { Laptop, ShoppingBag } from "lucide-react";
import { fadeUp } from "@/utils/animations";

export function AuthSidebar() {
  return (
    <div className="hidden md:flex flex-1 bg-gradient-to-br from-eco-100 to-tech-100 relative">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
      
      <div className="relative z-10 flex flex-col justify-center items-center p-10 h-full w-full">
        <div className={`max-w-md text-center ${fadeUp()}`}>
          <h2 className="text-2xl font-bold mb-4">Join the Circular Economy</h2>
          <p className="text-gray-700 mb-8">
            Our platform connects sellers with unwanted electronics to buyers who can give them new life, 
            reducing e-waste and promoting sustainable technology consumption.
          </p>
          
          <div className="grid grid-cols-2 gap-6 text-left">
            <div className="bg-white/80 p-5 rounded-xl shadow-sm">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-eco-100 rounded-full mr-2">
                  <Laptop className="h-4 w-4 text-eco-700" />
                </div>
                <h3 className="font-medium">For Sellers</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-eco-500 rounded-full mr-2"></span>
                  Clear out unused tech
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-eco-500 rounded-full mr-2"></span>
                  Get fair market value
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-eco-500 rounded-full mr-2"></span>
                  Reduce environmental impact
                </li>
              </ul>
            </div>
            
            <div className="bg-white/80 p-5 rounded-xl shadow-sm">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-tech-100 rounded-full mr-2">
                  <ShoppingBag className="h-4 w-4 text-tech-700" />
                </div>
                <h3 className="font-medium">For Buyers</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-tech-500 rounded-full mr-2"></span>
                  Find affordable electronics
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-tech-500 rounded-full mr-2"></span>
                  Verified quality grading
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-tech-500 rounded-full mr-2"></span>
                  Support sustainable practices
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}