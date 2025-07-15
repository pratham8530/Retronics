import React, { useState, useEffect } from "react";
import Heatmap from "@/components/Heatmap";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Scrap() {
  const [users, setUsers] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 18.5204, lng: 73.8567 }); // Default center (Pune)
  const [mapZoom, setMapZoom] = useState(10); // Default zoom for 'city' level
  const [selectedLevel, setSelectedLevel] = useState("city"); // city, area, colony, or user
  const [selectedRegion, setSelectedRegion] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedColony, setSelectedColony] = useState("");
  const [facilityName, setFacilityName] = useState("Green Recycling Facility");
  const [facilityAddress, setFacilityAddress] = useState("123 Green Street, City");

  useEffect(() => {
    const fetchSellersWithListings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/listings/scrap`);
        setUsers(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch sellers with listings:", error);
      }
    };
    fetchSellersWithListings();
  }, []);

  useEffect(() => {
    if (selectedLevel === "city") {
      const cityHeatmap = users.reduce<Record<string, {
        latSum: number;
        lngSum: number;
        count: number;
        name: string;
        totalRequests: number;
        estimatedWeightSum: number;
        hasScheduledPickup: boolean;
        type: string;
      }>>((acc, user) => {
        const city = user.address.city.toLowerCase();
        if (!acc[city]) {
          acc[city] = {
            latSum: user.address.coordinates.lat,
            lngSum: user.address.coordinates.lng,
            count: 1,
            name: city.charAt(0).toUpperCase() + city.slice(1),
            totalRequests: 0,
            estimatedWeightSum: 0,
            hasScheduledPickup: false,
            type: "city", // Added type field
          };
        } else {
          acc[city].latSum += user.address.coordinates.lat;
          acc[city].lngSum += user.address.coordinates.lng;
          acc[city].count += 1;
        }
        if (user.listings?.length > 0) {
          acc[city].totalRequests += 1; // Add this line to increment totalRequests
          acc[city].estimatedWeightSum += parseFloat(user.estimatedWeight || 0);
          if (user.listings.some((l) => l.pickupDetails)) {
            acc[city].hasScheduledPickup = true;
          }
        }
        return acc;
      }, {});

      const finalCityHeatmap = Object.values(cityHeatmap).map((city) => ({
        lat: city.latSum / city.count,
        lng: city.lngSum / city.count,
        weight: city.count,
        name: city.name,
        totalRequests: city.totalRequests,
        estimatedWeight: `${city.estimatedWeightSum} kg`,
        hasScheduledPickup: city.hasScheduledPickup,
        type: city.type,
      }));
      setHeatmapData(finalCityHeatmap);
    } else if (selectedLevel === "area") {
      const areaHeatmap = users
        .filter((user) => user.address.city.toLowerCase() === selectedRegion?.name.toLowerCase())
        .reduce<Record<string, {
          latSum: number;
          lngSum: number;
          count: number;
          name: string;
          totalRequests: number;
          estimatedWeightSum: number;
          hasScheduledPickup: boolean;
          type: string;
        }>>((acc, user) => {
          const area = user.address.area.toLowerCase();
          if (!acc[area]) {
            acc[area] = {
              latSum: user.address.coordinates.lat,
              lngSum: user.address.coordinates.lng,
              count: 1,
              name: area.charAt(0).toUpperCase() + area.slice(1),
              totalRequests: 0,
              estimatedWeightSum: 0,
              hasScheduledPickup: false,
              type: "area", // Added type field
            };
          } else {
            acc[area].latSum += user.address.coordinates.lat;
            acc[area].lngSum += user.address.coordinates.lng;
            acc[area].count += 1;
          }
          if (user.listings?.length > 0) {
            acc[area].totalRequests += 1;
            acc[area].estimatedWeightSum += parseFloat(user.estimatedWeight || 0);
            if (user.listings.some((l) => l.pickupDetails)) {
              acc[area].hasScheduledPickup = true;
            }
          }
          return acc;
        }, {});

      const finalAreaHeatmap = Object.values(areaHeatmap).map((area) => ({
        lat: area.latSum / area.count,
        lng: area.lngSum / area.count,
        weight: area.count,
        name: area.name,
        totalRequests: area.totalRequests,
        estimatedWeight: `${area.estimatedWeightSum} kg`,
        hasScheduledPickup: area.hasScheduledPickup,
        type: area.type,
      }));
      setHeatmapData(finalAreaHeatmap);
    } else if (selectedLevel === "colony") {
      const colonyHeatmap = users
        .filter((user) => user.address.area.toLowerCase() === selectedRegion?.name.toLowerCase())
        .reduce<Record<string, {
          latSum: number;
          lngSum: number;
          count: number;
          name: string;
          totalRequests: number;
          estimatedWeightSum: number;
          hasScheduledPickup: boolean;
          type: string;
        }>>((acc, user) => {
          const colony = user.address.colony.toLowerCase();
          if (!acc[colony]) {
            acc[colony] = {
              latSum: user.address.coordinates.lat,
              lngSum: user.address.coordinates.lng,
              count: 1,
              name: colony.charAt(0).toUpperCase() + colony.slice(1),
              totalRequests: 0,
              estimatedWeightSum: 0,
              hasScheduledPickup: false,
              type: "colony", // Added type field
            };
          } else {
            acc[colony].latSum += user.address.coordinates.lat;
            acc[colony].lngSum += user.address.coordinates.lng;
            acc[colony].count += 1;
          }
          if (user.listings?.length > 0) {
            acc[colony].totalRequests += 1;
            acc[colony].estimatedWeightSum += parseFloat(user.estimatedWeight || 0);
            if (user.listings.some((l) => l.pickupDetails)) {
              acc[colony].hasScheduledPickup = true;
            }
          }
          return acc;
        }, {});

      const finalColonyHeatmap = Object.values(colonyHeatmap).map((colony) => ({
        lat: colony.latSum / colony.count,
        lng: colony.lngSum / colony.count,
        weight: colony.count,
        name: colony.name,
        totalRequests: colony.totalRequests,
        estimatedWeight: `${colony.estimatedWeightSum} kg`,
        hasScheduledPickup: colony.hasScheduledPickup,
        type: colony.type,
      }));
      setHeatmapData(finalColonyHeatmap);
    } else if (selectedLevel === "user") {
      setHeatmapData(
        users
          .filter(
            (user) =>
              user.address.colony.toLowerCase() === selectedRegion?.name.toLowerCase() &&
              user.listings?.length > 0
          )
          .map((user) => ({
            ...user.address.coordinates,
            type: "user", // Already present, kept for consistency
            name: user.name,
          }))
      );
    }
  }, [selectedLevel, selectedRegion, users]);

  const handleRegionClick = (region) => {
    if (selectedLevel === "city") {
      setSelectedLevel("area");
      setMapCenter({ lat: region.lat, lng: region.lng });
      setMapZoom(12);
      setSelectedRegion(region);
      setSelectedArea(region.name);
      setSelectedColony("");
    } else if (selectedLevel === "area") {
      setSelectedLevel("colony");
      setMapCenter({ lat: region.lat, lng: region.lng });
      setMapZoom(14);
      setSelectedRegion(region);
      setSelectedColony(region.name);
      setSelectedArea(selectedRegion.name);
    } else if (selectedLevel === "colony") {
      setSelectedLevel("user");
      setMapCenter({ lat: region.lat, lng: region.lng });
      setMapZoom(16);
      setSelectedRegion(region);
    }
  };

  const goBack = () => {
    if (selectedLevel === "user") {
      setSelectedLevel("colony");
      setMapZoom(14);
      const parentArea = users.find(
        (user) => user.address.colony.toLowerCase() === selectedRegion?.name.toLowerCase()
      )?.address.area.toLowerCase();
      const areaRegion = {
        name: parentArea.charAt(0).toUpperCase() + parentArea.slice(1),
        lat: users.find((user) => user.address.area.toLowerCase() === parentArea)?.address.coordinates.lat,
        lng: users.find((user) => user.address.area.toLowerCase() === parentArea)?.address.coordinates.lng,
      };
      setSelectedRegion(areaRegion);
      setSelectedColony(selectedRegion.name);
      setSelectedArea(parentArea.charAt(0).toUpperCase() + parentArea.slice(1));
      setMapCenter({ lat: areaRegion.lat, lng: areaRegion.lng });
    } else if (selectedLevel === "colony") {
      setSelectedLevel("area");
      setMapZoom(12);
      const parentCity = users.find(
        (user) => user.address.area.toLowerCase() === selectedRegion?.name.toLowerCase()
      )?.address.city.toLowerCase();
      const cityRegion = {
        name: parentCity.charAt(0).toUpperCase() + parentCity.slice(1),
        lat: users.find((user) => user.address.city.toLowerCase() === parentCity)?.address.coordinates.lat,
        lng: users.find((user) => user.address.city.toLowerCase() === parentCity)?.address.coordinates.lng,
      };
      setSelectedRegion(cityRegion);
      setSelectedArea(selectedRegion.name);
      setSelectedColony("");
      setMapCenter({ lat: cityRegion.lat, lng: cityRegion.lng });
    } else if (selectedLevel === "area") {
      setSelectedLevel("city");
      setMapZoom(10);
      setSelectedRegion(null);
      setSelectedArea("");
      setSelectedColony("");
      setMapCenter({ lat: 18.5204, lng: 73.8567 });
    }
  };

  const handleSchedulePickup = async () => {
    const today = new Date().toISOString().split("T")[0];
    if (!pickupDate) {
      alert("Please select a pickup date.");
      return;
    }
    if (pickupDate < today) {
      alert("Pickup date must be in the future.");
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/pickups/schedule`, {
        area: selectedArea ? selectedArea.trim().toLowerCase() : undefined,
        colony: selectedColony ? selectedColony.trim().toLowerCase() : undefined,
        facilityName,
        facilityAddress,
        pickupDate,
      });
      alert("Pickup scheduled successfully!");
      setIsModalOpen(false);
      setPickupDate("");
      setSelectedArea("");
      setSelectedColony("");
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/listings/scrap`);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error scheduling pickup:", error);
      alert("Failed to schedule pickup.");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex pt-16">
        <div className="w-2/3 h-screen sticky top-0 p-4">
          <Heatmap
            data={heatmapData}
            center={mapCenter}
            zoom={mapZoom}
            onRegionClick={handleRegionClick}
          />
        </div>

        <div className="w-1/3 p-6 bg-gray-50 border-l">
          {selectedRegion && (
            <Button variant="outline" className="mb-4 flex items-center gap-2" onClick={goBack}>
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          )}

          <div>
            <h2 className="text-lg font-bold mb-4">
              {selectedLevel === "user"
                ? `Users in ${selectedRegion?.name || "Selected Region"}`
                : `Heatmap for ${selectedLevel}`}
            </h2>
            {selectedLevel === "user" ? (
              users
                .filter(
                  (user) =>
                    user.address.colony.toLowerCase() === selectedRegion?.name.toLowerCase() &&
                    user.listings?.length > 0
                )
                .map((user, index) => (
                  <Card key={index} className="mb-4">
                    <CardHeader>
                      <CardTitle>{user.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Items:{" "}
                        {user.listings?.length > 0 ? user.listings.map((l) => l.title).join(", ") : "None"}
                      </CardDescription>
                      <CardDescription>Estimated Weight: {user.estimatedWeight || "0 kg"}</CardDescription>
                      {user.listings?.map((listing, idx) => (
                        <div key={idx} className="mt-2">
                          {listing.pickupDetails && (
                            <div>
                              <p>
                                <strong>Pickup Scheduled:</strong> {listing.pickupDetails.facilityName},{" "}
                                {listing.pickupDetails.facilityAddress}
                              </p>
                              <p>
                                <strong>Date:</strong>{" "}
                                {new Date(listing.pickupDetails.pickupDate).toLocaleDateString()}
                              </p>
                              <p>
                                <strong>Status:</strong> {listing.pickupDetails.status}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))
            ) : (
              heatmapData.map((region, index) => (
                <Card
                  key={index}
                  className="mb-4 cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => handleRegionClick(region)}
                >
                  <CardHeader>
                    <CardTitle>{region.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Total Requests: {region.totalRequests}</CardDescription>
                    <CardDescription>Estimated Weight: {region.estimatedWeight}</CardDescription>
                    {(selectedLevel === "area" || selectedLevel === "colony") && !region.hasScheduledPickup && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (selectedLevel === "area") {
                            setSelectedArea(region.name);
                            setSelectedColony("");
                          } else if (selectedLevel === "colony") {
                            setSelectedColony(region.name);
                            setSelectedArea(
                              users.find(
                                (u) => u.address.colony.toLowerCase() === region.name.toLowerCase()
                              )?.address.area || ""
                            );
                          }
                          setIsModalOpen(true);
                        }}
                        className="mt-2"
                        >
                        Schedule Pickup
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Schedule Pickup for {selectedLevel === "colony" ? selectedColony : selectedArea}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              placeholder={selectedLevel === "colony" ? "Colony" : "Area"}
              value={selectedLevel === "colony" ? selectedColony : selectedArea}
              onChange={(e) =>
                selectedLevel === "colony"
                  ? setSelectedColony(e.target.value)
                  : setSelectedArea(e.target.value)
              }
              className="w-full border p-2 rounded"
            />
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <Button onClick={handleSchedulePickup}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}