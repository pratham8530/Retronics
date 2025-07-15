import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GradientButton } from "@/components/GradientButton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { register } from "@/services/authService"; // Import the register function

export function RegisterForm() {
  const [userType, setUserType] = useState<"seller" | "buyer">("seller");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: {
      city: "",
      area: "",
      colony: "",
      coordinates: {
        lat: null as number | null,
        lng: null as number | null,
      },
    },
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const [_, key] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGetCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              coordinates: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            },
          }));
        },
        (error) => {
          console.error("Error getting coordinates:", error);
          setErrorMessage("Failed to get coordinates. Please try again.");
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error messages

    try {
      // Call the register API
      const response = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        userType,
        address: formData.address,
      });

      // Navigate to the marketplace after successful registration
      navigate("/marketplace");
    } catch (error: any) {
      console.error("Registration failed:", error);
      setErrorMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleRegister}>
          <div className="mb-6">
            <Label className="mb-2 block">I want to:</Label>
            <RadioGroup
              value={userType}
              onValueChange={(v) => setUserType(v as "seller" | "buyer")}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="seller" id="seller" />
                <Label htmlFor="seller" className="flex items-center cursor-pointer">
                  Seller
                </Label>
              </div>
              <div className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="buyer" id="buyer" />
                <Label htmlFor="buyer" className="flex items-center cursor-pointer">
                  Buyer
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="john.doe@example.com" value={formData.email} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
          </div>

          {/* Address Fields */}
          <div className="space-y-2">
            <Label htmlFor="address.city">City</Label>
            <Input
              id="address.city"
              name="address.city"
              placeholder="Pune"
              value={formData.address.city}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address.area">Area</Label>
            <Input
              id="address.area"
              name="address.area"
              placeholder="Bibwewadi"
              value={formData.address.area}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address.colony">Colony</Label>
            <Input
              id="address.colony"
              name="address.colony"
              placeholder="Mansi Apartment"
              value={formData.address.colony}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Coordinates</Label>
            <div className="flex items-center space-x-2">
              <Button type="button" onClick={handleGetCoordinates} className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Get Coordinates</span>
              </Button>
              <div className="text-sm text-gray-600">
                <p>Latitude: {formData.address.coordinates.lat}</p>
                <p>Longitude: {formData.address.coordinates.lng}</p>
              </div>
            </div>
          </div>

          {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}

          <GradientButton type="submit" className="w-full mt-6">
            Create Account
          </GradientButton>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center p-6 border-t bg-gray-50 text-sm">
        <p>
          Already have an account?{" "}
          <Link to="/auth/login" className="text-eco-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}