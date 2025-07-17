import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeatureCard } from "@/components/FeatureCard";
import { ListingCard } from "@/components/ListingCard";
import { GradientButton } from "@/components/GradientButton";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, BadgeDollarSign, BarChart2, Clock, CreditCard, Laptop, Lock, MessageSquare, Monitor, Phone, Recycle, RefreshCw, Shield, ShieldCheck, Smartphone, ThumbsUp, Upload } from "lucide-react";
import { fadeIn, fadeUp, slideInRight } from "@/utils/animations";
import { Link, useNavigate } from "react-router-dom";
import { getAllListings } from "@/services/listingService";

export default function Index() {
  const [featuredListings, setFeaturedListings] = useState([]);

  // NEW: State to track login status and hook for navigation
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // NEW: Effect to check for login token when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // !! converts the token string (or null) to a boolean
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await getAllListings(); // Fetch all listings
        const listings = response?.data || []; // Ensure data is correctly structured

        // Shuffle the listings and select 4 random ones
        const shuffledListings = [...listings].sort(() => 0.5 - Math.random());
        const selectedListings = shuffledListings.slice(0, 4);

        setFeaturedListings(selectedListings);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      }
    };

    fetchListings();
  }, []);
  

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${fadeUp()}`}>How It Works</h2>
            <p className={`text-xl text-gray-600 ${fadeUp(100)}`}>
              Join our sustainable e-waste ecosystem in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className={`relative ${fadeUp(200)}`}>
              <div className="bg-gradient-to-br from-eco-500 to-eco-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-6">1</div>
              <div className="absolute top-6 left-12 hidden md:block w-full h-0.5 bg-gradient-to-r from-eco-500 to-transparent"></div>
              <h3 className="text-xl font-semibold mb-3">List Your E-Waste</h3>
              <p className="text-gray-600">
                Upload images of your unused electronics and answer a few questions about their condition. Our system will automatically grade and price your items.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className={`relative ${fadeUp(300)}`}>
              <div className="bg-gradient-to-br from-tech-500 to-tech-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-6">2</div>
              <div className="absolute top-6 left-12 hidden md:block w-full h-0.5 bg-gradient-to-r from-tech-500 to-transparent"></div>
              <h3 className="text-xl font-semibold mb-3">Receive Requests</h3>
              <p className="text-gray-600">
                Interested buyers will submit purchase requests for your listings. Review and approve requests from verified buyers on our platform.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className={fadeUp(400)}>
              <div className="bg-gradient-to-br from-eco-500 to-tech-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-6">3</div>
              <h3 className="text-xl font-semibold mb-3">Complete Transaction</h3>
              <p className="text-gray-600">
                Connect with approved buyers to arrange pickup or delivery. Our platform tracks successful transactions to build your eco-friendly reputation.
              </p>
            </div>
          </div>
          
          {/* <div className={`mt-16 text-center ${fadeUp(500)}`}>
            <Link to="/auth/register">
              <GradientButton className="mx-auto">
                 <ArrowRight className="ml-2 h-4 w-4" />
              </GradientButton>
            </Link>
          </div> */}
        </div>
      </section>
      
      {/* Featured Listings Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${fadeUp()}`}>Featured Listings</h2>
              <p className={`text-xl text-gray-600 ${fadeUp(100)}`}>
                Discover quality-graded electronics ready for a second life
              </p>
            </div>
            <Link to="/marketplace" className={`mt-4 md:mt-0 ${fadeUp(200)}`}>
              <Button variant="ghost" className="group">
                View all listings 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map((listing, index) => (
              <ListingCard 
                key={listing.id} 
                {...listing} 
                delay={(index + 1) * 100} 
              />
            ))}
          </div>
          
          <div className={`mt-12 text-center ${fadeUp(600)}`}>
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-lg font-medium mb-4">
                Looking for a specific item? Browse our marketplace.
              </p>
              <Link to="/marketplace">
                <GradientButton className="mx-auto">
                  Explore Marketplace <ArrowRight className="ml-2 h-4 w-4" />
                </GradientButton>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-1/3 right-0 translate-x-1/2 w-[30%] h-[30%] rounded-full bg-eco-50 opacity-60 blur-3xl" />
        <div className="absolute bottom-1/4 left-0 -translate-x-1/2 w-[30%] h-[30%] rounded-full bg-tech-50 opacity-60 blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${fadeUp()}`}>
              Packed With Features
            </h2>
            <p className={`text-xl text-gray-600 ${fadeUp(100)}`}>
              Everything you need to buy and sell e-waste responsibly
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={ShieldCheck} 
              title="Quality Grading" 
              description="Our AI-powered system assesses and grades items based on condition, age, and functionality."
              delay={100}
            />
            <FeatureCard 
              icon={CreditCard} 
              title="Secure Transactions" 
              description="Safe payment processing and verified user profiles for peace of mind."
              delay={200}
            />
            <FeatureCard 
              icon={BarChart2} 
              title="Market Analytics" 
              description="View regional e-waste trends and get price recommendations based on real market data."
              delay={300}
            />
            <FeatureCard 
              icon={Upload} 
              title="Easy Listing Process" 
              description="Simple uploading tools with image recognition to identify your electronics automatically."
              delay={400}
            />
            <FeatureCard 
              icon={Award} 
              title="Eco Rewards" 
              description="Earn points for successful transactions that can be redeemed for exclusive perks."
              delay={500}
            />
            <FeatureCard 
              icon={BadgeDollarSign} 
              title="Special Incentives" 
              description="Sellers receive benefits for high-quality listings, while buyers get discounts on new purchases."
              delay={600}
            />
          </div>
        </div>
      </section>
      
      {/* Product Categories Section */}
      <section className="py-20 bg-gradient-to-br from-eco-50 to-tech-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${fadeUp()}`}>
              Browse by Category
            </h2>
            <p className={`text-xl text-gray-600 ${fadeUp(100)}`}>
              Find the perfect device for your needs or list your unwanted tech
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Link to="/marketplace?category=laptops" className={`group ${fadeUp(200)}`}>
              <div className="bg-white rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg border border-gray-100 hover:border-eco-200">
                <div className="w-16 h-16 bg-eco-100 text-eco-600 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors group-hover:bg-eco-600 group-hover:text-white">
                  <Laptop className="h-8 w-8" />
                </div>
                <h3 className="font-medium">Laptops & Computers</h3>
              </div>
            </Link>
            
            <Link to="/marketplace?category=smartphones" className={`group ${fadeUp(300)}`}>
              <div className="bg-white rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg border border-gray-100 hover:border-eco-200">
                <div className="w-16 h-16 bg-tech-100 text-tech-600 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors group-hover:bg-tech-600 group-hover:text-white">
                  <Smartphone className="h-8 w-8" />
                </div>
                <h3 className="font-medium">Smartphones & Tablets</h3>
              </div>
            </Link>
            
            <Link to="/marketplace?category=monitors" className={`group ${fadeUp(400)}`}>
              <div className="bg-white rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg border border-gray-100 hover:border-eco-200">
                <div className="w-16 h-16 bg-eco-100 text-eco-600 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors group-hover:bg-eco-600 group-hover:text-white">
                  <Monitor className="h-8 w-8" />
                </div>
                <h3 className="font-medium">Monitors & Displays</h3>
              </div>
            </Link>
            
            <Link to="/marketplace?category=parts" className={`group ${fadeUp(500)}`}>
              <div className="bg-white rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg border border-gray-100 hover:border-eco-200">
                <div className="w-16 h-16 bg-tech-100 text-tech-600 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors group-hover:bg-tech-600 group-hover:text-white">
                  <RefreshCw className="h-8 w-8" />
                </div>
                <h3 className="font-medium">Components & Parts</h3>
              </div>
            </Link>
          </div>
          
          <div className={`mt-12 text-center ${fadeUp(600)}`}>
            <Link to="/marketplace">
              <Button variant="outline" className="mx-auto">
                View All Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Impact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className={`mb-4 ${fadeUp()}`}>
                <span className="inline-block px-3 py-1 text-xs font-medium text-eco-800 bg-eco-100 rounded-full">
                  Environmental Impact
                </span>
              </div>
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${fadeUp(100)}`}>
                Make a Difference With Every Transaction
              </h2>
              <p className={`text-lg text-gray-600 mb-8 ${fadeUp(200)}`}>
                When you buy or sell through ReTronics, you're contributing to a reduction in electronic waste 
                and the conservation of precious materials. Our impact tracker shows you exactly how your 
                actions are helping the planet.
              </p>
              
              <div className={`space-y-4 mb-8 ${fadeUp(300)}`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-eco-100 text-eco-600 flex items-center justify-center mr-3 mt-0.5">
                    <ThumbsUp className="h-3 w-3" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Reduced Resource Extraction</h3>
                    <p className="text-gray-600 text-sm">
                      Each reused device means fewer raw materials need to be mined and processed.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-eco-100 text-eco-600 flex items-center justify-center mr-3 mt-0.5">
                    <ThumbsUp className="h-3 w-3" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Energy Conservation</h3>
                    <p className="text-gray-600 text-sm">
                      Extending the life of electronics saves the significant energy required to produce new devices.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-eco-100 text-eco-600 flex items-center justify-center mr-3 mt-0.5">
                    <ThumbsUp className="h-3 w-3" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Landfill Reduction</h3>
                    <p className="text-gray-600 text-sm">
                      Keeping electronics in circulation prevents them from ending up in landfills where they can leak harmful substances.
                    </p>
                  </div>
                </div>
              </div>
              
              <Link to="/impact" className={fadeUp(400)}>
                <GradientButton>
                  View Our Impact Report
                </GradientButton>
              </Link>
            </div>
            
            <div className={`relative ${slideInRight()}`}>
              <div className="relative z-10 bg-white rounded-xl shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop" 
                  alt="Environmental impact" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Our Community Impact</h3>
                  <p className="mb-4">Together we've saved:</p>
                  <div className="flex justify-between text-center">
                    <div>
                      <p className="text-2xl font-bold">15,230</p>
                      <p className="text-sm text-gray-300">Devices Reused</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">1,250</p>
                      <p className="text-sm text-gray-300">Tons of CO₂</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">$4.2M</p>
                      <p className="text-sm text-gray-300">User Savings</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 bottom-0 right-0 translate-x-8 translate-y-8 w-full h-full bg-eco-100 rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-eco-500 to-tech-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${fadeUp()}`}>
            Ready to Join Our Movement?
          </h2>
          <p className={`text-xl md:text-2xl mb-10 max-w-2xl mx-auto ${fadeUp(100)}`}>
            Start buying or selling e-waste today and become part of the solution.
          </p>
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${fadeUp(200)}`}>
            <Link to="/auth/register">
              
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline" className="min-w-[180px] text-black border-white hover:bg-white/10">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-eco-500 to-tech-500 p-2 rounded-lg mr-2">
                  <Recycle className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white tracking-tight">ReTronics</span>
              </div>
              <p className="text-sm mb-4">
                A sustainable e-waste management platform connecting sellers and buyers.
              </p>
              <div className="flex space-x-4">
              <a
  href="https://github.com/pratham8530/GDG-Main-Project"
  className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white hover:bg-gray-800 transition"
  target="_blank"
  rel="noopener noreferrer"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 
         11.385.6.111.793-.261.793-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.386-1.333-1.755-1.333-1.755-1.088-.744.083-.729.083-.729 
         1.205.085 1.838 1.238 1.838 1.238 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.303-5.466-1.332-5.466-5.931 
         0-1.31.469-2.381 1.235-3.221-.124-.303-.535-1.523.117-3.176 
         0 0 1.008-.322 3.3 1.23a11.49 11.49 0 0 1 3.003-.404c1.02.005 
         2.045.138 3.003.404 2.291-1.552 3.297-1.23 
         3.297-1.23.653 1.653.242 2.873.118 
         3.176.77.84 1.233 1.911 1.233 
         3.221 0 4.61-2.803 5.625-5.475 
         5.921.43.371.823 1.102.823 
         2.222 0 1.606-.014 2.898-.014 
         3.293 0 .319.192.694.801.576C20.565 
         21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"
      clipRule="evenodd"
    />
  </svg>
</a>

             
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">For Sellers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Buyers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Marketplace</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Scrap Items</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Recycling Facilities</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4"></h3>
              <ul className="space-y-2 text-sm">
               
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4"></h3>
              <ul className="space-y-2 text-sm">
               
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2023 ReTronics. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <a href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</a>
              <span className="mx-3">|</span>
              <a href="#" className="text-sm hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
      {/* NEW: Floating Action Button for Chat */}
      {isLoggedIn && (
        <button
          onClick={() => navigate('/messages')}
          className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-br from-eco-500 to-tech-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eco-500"
          title="Open Messages"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}