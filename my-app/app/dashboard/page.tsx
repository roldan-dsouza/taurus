"use client";

import Link from "next/link";
import { CheckCircle, AlertTriangle, Activity } from "lucide-react";
import { useEffect, useState } from "react";

interface Cow {
  _id: string;
  cow_id: string;
  cow_name: string;
  cow_breed: string;
  cow_age: number;
  device_id: string;
  temperature: number;
  heartbeat: number;
  activity: number;
  methane_level: number;
  location: { lat: number; lng: number };
  reading_time: string;
  risk_level?: string;
}

// Function to calculate relative time
const getRelativeTime = (date: string | Date) => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

function getCardColor(riskLevel: string) {
  switch (riskLevel?.toLowerCase()) {
    case "high":
      return "from-red-50 to-red-100 border-red-200";
    case "medium":
      return "from-amber-50 to-orange-100 border-amber-200";
    case "low":
      return "from-emerald-50 to-green-100 border-emerald-200";
    default:
      return "from-gray-50 to-gray-100 border-gray-200";
  }
}

function getBadgeColor(riskLevel: string) {
  switch (riskLevel?.toLowerCase()) {
    case "high":
      return "bg-red-600";
    case "medium":
      return "bg-amber-500";
    case "low":
      return "bg-emerald-600";
    default:
      return "bg-gray-500";
  }
}

export default function Dashboard() {
  const [textContent, setTextContent] = useState([
    " Cow Monitor",
    "Your farm's health at a glance",
  ]);
  const [cowsData, setCowsData] = useState<Cow[]>([]);

  useEffect(() => {
    const fetchCowsData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/cows`);
        const response = await res.json();
        const data = response.data;

        const mappedCows: Cow[] = data.map((item: any) => {
          const cowDetails = item.cow;
          const latestSensor = item.sensorData?.[0] || {};

          // Calculate Age from cow_dob
          const dob = new Date(cowDetails.cow_dob);
          const age = new Date().getFullYear() - dob.getFullYear();
          console.log(cowDetails._id);

          return {
            _id: cowDetails._id,
            cow_id: cowDetails.cow_id,
            cow_name: cowDetails.cow_name,
            cow_breed: cowDetails.cow_breed,
            cow_age: age, // Calculated age
            device_id: cowDetails.device_id,

            // Sensor metrics from the sensorData array
            temperature: latestSensor.temperature || 0,
            heartbeat: latestSensor.heartbeat || 0,
            activity: latestSensor.activity || 0,
            methane_level: latestSensor.methane_level || 0,

            location: {
              lat: item.location?.lat || 0,
              lng: item.location?.lng || 0,
            },

            // Fix the NaN issue by using the sensor timestamp
            reading_time: getRelativeTime(latestSensor.timestamp || new Date()),
            risk_level: item.risk_level || "Unknown",
          };
        });
        console.log(mappedCows);

        setCowsData(mappedCows);
      } catch (err) {
        console.error("Error fetching cows data:", err);
      }
    };
    fetchCowsData();
  }, []);

  const needsAttention = cowsData.filter(
    (cow) => cow.risk_level?.toLowerCase() === "high",
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50">
      {/* Header */}
      <header className="border-b border-emerald-200 bg-white/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900 mb-0.5 truncate">
                {textContent[0]}
              </h1>
              <p className="text-emerald-700 text-sm">{textContent[1]}</p>
              <div className="flex-shrink-0 w-16 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl px-3 py-2 sm:px-4 border border-emerald-200 text-2xl sm:text-3xl font-bold text-emerald-900 tabular-nums">
                {cowsData.length}
              </div>
            </div>

            <div className="text-emerald-700 font-medium text-xs sm:text-sm whitespace-nowrap">
              {textContent[2]}
            </div>
          </div>

          {/* Attention Alert */}
          {needsAttention > 0 && (
            <div className="mt-3 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-2">
              <p className="text-red-900 font-bold text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {needsAttention} cow{needsAttention !== 1 ? "s" : ""} need
                {needsAttention === 1 ? "s" : ""} attention
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cowsData.map((cow) => {
            const cardColor = getCardColor(cow.risk_level || "");
            const badgeColor = getBadgeColor(cow.risk_level || "");

            return (
              <Link
                href={`/cow/${cow._id}?name=${encodeURIComponent(
                  cow.cow_name,
                )}&age=${cow.cow_age}&device=${cow.device_id}&breed=${encodeURIComponent(
                  cow.cow_breed,
                )}`}
              >
                <div
                  className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${cardColor} shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer h-full`}
                >
                  {/* Background accent */}
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="relative p-6 h-full flex flex-col justify-between">
                    {/* Top section */}
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                            {cow.cow_name}
                          </h2>
                          <p className="text-gray-700 text-base sm:text-lg">
                            {cow.cow_breed} • {cow.cow_age} years
                          </p>
                        </div>
                        <div
                          className={`${badgeColor} text-white font-bold px-3 py-1 rounded-full text-xs whitespace-nowrap ml-2`}
                        >
                          {cow.risk_level || "Unknown"}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-6 font-medium">
                        Updated {cow.reading_time}
                      </p>
                    </div>

                    {/* Tap indicator */}
                    <div className="mt-6 text-center text-gray-600 text-sm font-medium group-hover:text-gray-900 transition-colors">
                      Tap for details
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
