import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Recycle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/GradientButton";

export function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState("");

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Marketplace", path: "/marketplace" },
        { name: "Scrap", path: "/scrap" },
        { name: "Recycling", path: "/recycling" },
    ];

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Check authentication and token expiration
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const isExpired = decodedToken.exp * 1000 < Date.now();

            if (isExpired) {
                handleLogout();
            } else {
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
        }
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        navigate("/auth/login");
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-lg",
                scrolled ? "bg-white/70 shadow-sm py-3" : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-gradient-to-r from-eco-500 to-tech-500 p-2 rounded-lg">
                            <Recycle className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">ReTronics</span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                    location.pathname === item.path
                                        ? "text-eco-700 bg-eco-50"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {isAuthenticated ? (
                            <>
                                {userType === "seller" ? (
                                    <Link to="/dashboard/seller">
                                        <Button variant="ghost" className="w-full justify-start">
                                            Dashboard
                                        </Button>
                                    </Link>
                                ) : userType === "buyer" ? (
                                    <Link to="/dashboard/buyer">
                                        <Button variant="ghost" className="w-full justify-start">
                                            Dashboard
                                        </Button>
                                    </Link>
                                ) : null}
                                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                                    Log out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/auth/login">
                                    <Button variant="ghost" className="w-full justify-start">
                                        Log in
                                    </Button>
                                </Link>
                                <Link to="/auth/register">
                                    <GradientButton className="w-full justify-center">
                                        Sign up
                                    </GradientButton>
                                </Link>
                            </>
                        )}
                    </nav>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden flex flex-col space-y-1.5"
                        aria-label="Toggle menu"
                    >
                        <span
                            className={cn(
                                "block w-6 h-0.5 bg-gray-800 transition-transform duration-300",
                                mobileMenuOpen && "translate-y-2 rotate-45"
                            )}
                        />
                        <span
                            className={cn(
                                "block w-6 h-0.5 bg-gray-800 transition-opacity duration-300",
                                mobileMenuOpen && "opacity-0"
                            )}
                        />
                        <span
                            className={cn(
                                "block w-6 h-0.5 bg-gray-800 transition-transform duration-300",
                                mobileMenuOpen && "-translate-y-2 -rotate-45"
                            )}
                        />
                    </button>
                </div>

                <div
                    className={cn(
                        "md:hidden transition-all duration-300 overflow-hidden",
                        mobileMenuOpen ? "max-h-96 pt-5" : "max-h-0"
                    )}
                >
                    <nav className="flex flex-col space-y-2 pb-5">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                    location.pathname === item.path
                                        ? "text-eco-700 bg-eco-50"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {isAuthenticated ? (
                            <>
                                {userType === "seller" ? (
                                    <Link to="/dashboard/seller">
                                        <Button variant="ghost" className="w-full justify-start">
                                            Dashboard
                                        </Button>
                                    </Link>
                                ) : userType === "buyer" ? (
                                    <Link to="/dashboard/buyer">
                                        <Button variant="ghost" className="w-full justify-start">
                                            Dashboard
                                        </Button>
                                    </Link>
                                ) : null}
                                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                                    Log out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/auth/login">
                                    <Button variant="ghost" className="w-full justify-start">
                                        Log in
                                    </Button>
                                </Link>
                                <Link to="/auth/register">
                                    <GradientButton className="w-full justify-center">
                                        Sign up
                                    </GradientButton>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}