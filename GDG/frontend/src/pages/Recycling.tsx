import React, { useEffect, useState } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FeatureCard } from "@/components/FeatureCard";
import { fadeUp } from "@/utils/animations";
import { Recycle, MapPin, Factory, Award, Leaf, BarChart3 } from "lucide-react";
import { getAllRecyclingCenters } from '@/services/recyclingService';
import { Navbar } from "@/components/Navbar"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Recycling() {
  const [recyclingCenters, setRecyclingCenters] = useState([]);
  const [filteredCenters, setFilteredCenters] = useState([]);
  const [city, setCity] = useState('All');

  useEffect(() => {
    const fetchRecyclingCenters = async () => {
      const data = await getAllRecyclingCenters();
      setRecyclingCenters(data.data.recyclingCenters);
      setFilteredCenters(data.data.recyclingCenters);
    };
    fetchRecyclingCenters();
  }, []);

  useEffect(() => {
    if (city === 'All') {
      setFilteredCenters(recyclingCenters);
    } else {
      setFilteredCenters(recyclingCenters.filter(center => center.address.toLowerCase().includes(city.toLowerCase())));
    }
  }, [city, recyclingCenters]);

  const handleGetDirections = (center) => {
    const query = `${center.name}, ${center.address}`;
    const encodedQuery = encodeURIComponent(query);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Container className="py-12">
          <div className="flex flex-col items-center justify-center mb-12">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <Recycle className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Recycling Facilities</h1>
            <p className="text-gray-600 text-center max-w-xl">
              Find certified e-waste recycling centers near you that safely process electronic components
              and ensure proper disposal of hazardous materials.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="centers" className="mb-12">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="centers">Recycling Centers</TabsTrigger>
                <TabsTrigger value="process">Recycling Process</TabsTrigger>
              </TabsList>
              
              <TabsContent value="centers" className={fadeUp()}>
                <div className="mb-4">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Select City
                  </label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent className="w-full"> 
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Pune">Pune</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Nagpur">Nagpur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCenters.map((center) => (
                    <Card key={center._id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="bg-green-50 pb-4">
                        <CardTitle className="flex items-start justify-between">
                          <span>{center.name}</span>
                          <Badge variant="outline" className="bg-white flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {center.distance}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                          {center.address}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="mb-4">
                          <p className="text-sm font-medium">Hours:</p>
                          <p className="text-sm text-gray-500">{center.hours}</p>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm font-medium">Contact:</p>
                          <p className="text-sm text-gray-500">{center.phone}</p>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm font-medium">Accepted Items:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {center.acceptedItems.map((item) => (
                              <Badge key={item} variant="secondary" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleGetDirections(center)}
                          className="w-full mt-2 bg-green-600 hover:bg-green-700"
                          aria-label={`Get directions to ${center.name}`}
                        >
                          Get Directions
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="process" className={fadeUp()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FeatureCard
                    icon={Factory}
                    title="Collection & Sorting"
                    description="E-waste is collected and sorted based on type, condition, and material composition."
                    delay={0}
                  />
                  <FeatureCard
                    icon={Recycle}
                    title="Disassembly & Separation"
                    description="Devices are manually or mechanically disassembled to separate components."
                    delay={100}
                  />
                  <FeatureCard
                    icon={BarChart3}
                    title="Material Recovery"
                    description="Precious metals like gold, silver, and copper are extracted using specialized processes."
                    delay={200}
                  />
                  <FeatureCard
                    icon={Leaf}
                    title="Environmental Protection"
                    description="Hazardous substances are properly handled to prevent environmental contamination."
                    delay={300}
                  />
                </div>
                
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold">Certification & Compliance</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    All listed recycling facilities follow strict environmental standards and are certified by recognized authorities.
                    They comply with local and federal regulations for handling electronic waste.
                  </p>
                  <Button variant="outline" className="gap-2">
                    <Leaf className="h-4 w-4" />
                    Learn About Our Environmental Impact
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Container>
      </div>
    </div>
  );
}