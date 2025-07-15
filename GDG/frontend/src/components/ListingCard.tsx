import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fadeUp } from "@/utils/animations";
import { cn } from "@/lib/utils";
import { Clock, MapPin, ShoppingBag, Eye } from "lucide-react";

// Added createdAt in the props (as ISO string) so we can compute the remaining time.
interface ListingCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  grade: string;
  location: string;
  category: string;
  isScrapItem: boolean;
  seller?: {
    firstName: string;
    lastName: string;
    email?: string;
  };
  // Remove the static timeLeft prop; it will now be computed from createdAt.
  createdAt: string;
  delay: number;
  className?: string;
  onRequest: () => void;
  onViewDetails: () => void;
}

// Helper function to compute days left from createdAt date.
const computeDaysLeft = (createdAt: string): number => {
  const creationDate = new Date(createdAt);
  const expirationDate = new Date(creationDate);
  expirationDate.setDate(expirationDate.getDate() + 30); // Add 30 days
  const now = new Date();
  // Calculate difference in milliseconds and convert to days
  const diffTime = expirationDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export function ListingCard({
  id,
  title,
  description,
  image,
  price,
  grade,
  location,
  category,
  seller,
  createdAt,
  isScrapItem,
  delay,
  className,
  onRequest,
  onViewDetails,
}: ListingCardProps) {
  const daysLeft = computeDaysLeft(createdAt);

  return (
    <Card className={cn("shadow-md", className, fadeUp(delay))}>
      <CardHeader className="p-0">
        <img src={image} alt={title} className="w-full h-48 object-cover rounded-t-md" />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm text-gray-600 mb-2">{description}</CardDescription>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-xs">{grade}</Badge>
          <span className="text-lg font-bold">₹{price}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-1" />
          {location}
        </div>
        {/* Countdown logic: Display the number of days left */}
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <Clock className="w-4 h-4 mr-1" />
          {daysLeft} {daysLeft === 1 ? "day" : "days"} left
        </div>
        {seller && (
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <span>Seller: {seller.firstName} {seller.lastName}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Button variant="outline" className="w-full" onClick={onViewDetails}>
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
        <Button className="w-full" onClick={onRequest}>
          <ShoppingBag className="w-4 h-4 mr-2" />
          Request Purchase
        </Button>
      </CardFooter>
    </Card>
  );
}
