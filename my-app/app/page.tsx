"use client";

import Link from "next/link";
import { CheckCircle, AlertTriangle, Activity } from "lucide-react";

// Dummy cow data
const cowsData = [
  {
    cow_id: 1,
    cow_name: "Bessie",
    cow_breed: "Holstein",
    cow_age: 5,
    device_id: "DEV001",
    temperature: 38.2,
    heartbeat: 65,
    activity: 85,
    methane_level: 42,
    location: { lat: 40.7128, lng: -74.006 },
    reading_time: "2 min ago",
  },
  {
    cow_id: 2,
    cow_name: "Daisy",
    cow_breed: "Jersey",
    cow_age: 3,
    device_id: "DEV002",
    temperature: 38.5,
    heartbeat: 72,
    activity: 90,
    methane_level: 48,
    location: { lat: 40.715, lng: -74.007 },
    reading_time: "1 min ago",
  },
  {
    cow_id: 3,
    cow_name: "Molly",
    cow_breed: "Angus",
    cow_age: 6,
    device_id: "DEV003",
    temperature: 39.8,
    heartbeat: 95,
    activity: 45,
    methane_level: 68,
    location: { lat: 40.71, lng: -74.005 },
    reading_time: "5 min ago",
  },
  {
    cow_id: 4,
    cow_name: "Clara",
    cow_breed: "Guernsey",
    cow_age: 4,
    device_id: "DEV004",
    temperature: 38.3,
    heartbeat: 68,
    activity: 88,
    methane_level: 44,
    location: { lat: 40.718, lng: -74.009 },
    reading_time: "3 min ago",
  },
];

function getHealthStatus(cow: (typeof cowsData)[0]) {
  const temp = cow.temperature;
  const heart = cow.heartbeat;
  const activity = cow.activity;

  if (temp > 39.5 || heart > 90 || activity < 50) {
    return {
      status: "danger",
      label: "Check Soon",
      bgColor: "from-red-50 to-red-100",
      borderColor: "border-red-200",
      badgeBg: "bg-red-600",
      textColor: "text-red-700",
    };
  }

  if (temp > 38.8 || heart > 80 || activity < 70) {
    return {
      status: "warning",
      label: "Monitor",
      bgColor: "from-amber-50 to-orange-100",
      borderColor: "border-amber-200",
      badgeBg: "bg-amber-500",
      textColor: "text-amber-700",
    };
  }

  return {
    status: "healthy",
    label: "Healthy",
    bgColor: "from-emerald-50 to-green-100",
    borderColor: "border-emerald-200",
    badgeBg: "bg-emerald-600",
    textColor: "text-emerald-700",
  };
}

export default function Dashboard() {
  const healthStatuses = cowsData.map((cow) => getHealthStatus(cow));
  const needsAttention = healthStatuses.filter(
    (h) => h.status !== "healthy",
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50">
      {/* Header */}
      <header className="border-b border-emerald-200 bg-white/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-emerald-900 mb-0.5">
                Cow Monitor
              </h1>
              <p className="text-emerald-700 text-sm">
                Your farm's health at a glance
              </p>
            </div>
            <div className="text-right bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl px-4 py-1 border border-emerald-200">
              <div className="text-3xl font-bold text-emerald-900">
                {cowsData.length}
              </div>
              <div className="text-emerald-700 font-medium">Total Cows</div>
            </div>
          </div>

          {/* Attention Alert */}
          {needsAttention > 0 && (
            <div className="mt-1 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-2">
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
          {cowsData.map((cow, index) => {
            const health = healthStatuses[index];

            return (
              <Link href={`/cow/${cow.cow_id}`} key={cow.cow_id}>
                <div
                  className={`group relative overflow-hidden rounded-2xl border ${health.borderColor} bg-gradient-to-br ${health.bgColor} shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer h-full`}
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
                          className={`${health.badgeBg} text-white font-bold px-3 py-1 rounded-full text-xs whitespace-nowrap ml-2`}
                        >
                          {health.label}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-6 font-medium">
                        Updated {cow.reading_time}
                      </p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/80">
                        <div className="text-gray-700 text-xs font-bold uppercase tracking-wide mb-1">
                          Temperature
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                          {cow.temperature}°
                        </div>
                        <div className="text-xs text-gray-600 mt-1">C</div>
                      </div>

                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/80">
                        <div className="text-gray-700 text-xs font-bold uppercase tracking-wide mb-1">
                          Heartbeat
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                          {cow.heartbeat}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">bpm</div>
                      </div>

                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/80">
                        <div className="text-gray-700 text-xs font-bold uppercase tracking-wide mb-1">
                          Activity
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                          {cow.activity}%
                        </div>
                      </div>

                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/80">
                        <div className="text-gray-700 text-xs font-bold uppercase tracking-wide mb-1">
                          Gas Level
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                          {cow.methane_level}
                        </div>
                      </div>
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
