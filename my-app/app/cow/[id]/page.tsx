"use client";

import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Zap,
} from "lucide-react";
import { use, useEffect, useState } from "react";
import { get } from "http";
import { useSearchParams } from "next/navigation";

interface Cow {
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
}

let text = [""];
export default function CowDetail() {
  const router = useRouter();
  const params = useParams();
  const cowId = params.id as string;
  const [cow, setCow] = useState<Cow | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  const searchParams = useSearchParams();

  const name = searchParams.get("name");
  const age = searchParams.get("age");
  const device = searchParams.get("device");
  const breed = searchParams.get("breed");

  console.log("Search Params:", { name, age, device });
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchCow = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/cows/${cowId}/latest`,
        );
        const response = await res.json();

        if (res.ok && response.data) {
          const data = response.data;
          setCow({
            ...data,
            location: {
              lat: data.location?.latitude || 0,
              lng: data.location?.longitude || 0,
            },
            reading_time: data.reading_time
              ? new Date(data.reading_time).toLocaleString()
              : "Unknown",
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    if (cowId) {
      // Initial fetch
      fetchCow();

      // Poll every 5 seconds
      intervalId = setInterval(fetchCow, 2000);
    }

    // Cleanup: Stop polling when the component unmounts or cowId changes
    return () => clearInterval(intervalId);
  }, [cowId]); // Re-run if the cowId changes // Add analysis to the dependency array

  const GetAnalysis = async () => {
    // Fetch AI analysis based on cow data
    if (!analysis) {
      const analysisRes = await fetch(
        `http://localhost:8000/api/cows/analyze/${cowId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );
      const analysisResponse = await analysisRes.json();

      if (analysisResponse.data?.jsonResponse) {
        setAnalysis(analysisResponse.data.jsonResponse);
      }
      console.log(" analysis:", analysisResponse);
      console.log("called GetAnalysis with cowId:", cowId);
    }
    // This will show the current state of analysis after the fetch attempt
  };

  useEffect(() => {
    GetAnalysis();
  }, [cowId]);

  if (!cow) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">
            Cow Not Found
          </h1>
          <button
            onClick={() => router.back()}
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50">
      {/* Header with Back Button */}
      <header className="border-b border-emerald-200 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-emerald-100 rounded-xl transition text-emerald-700 hover:text-emerald-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {name}
            </h1>
            <p className="text-gray-600">Detailed health monitoring</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Basic Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="text-gray-600 text-sm font-bold uppercase tracking-wide mb-2">
              Breed
            </div>
            <div className="text-3xl font-bold text-gray-900">{breed}</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="text-gray-600 text-sm font-bold uppercase tracking-wide mb-2">
              Age
            </div>
            <div className="text-3xl font-bold text-gray-900">{age} years</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="text-gray-600 text-sm font-bold uppercase tracking-wide mb-2">
              Last Update
            </div>
            <div className="text-xl font-bold text-gray-900">
              {cow.reading_time}
            </div>
          </div>
        </div>

        {/* Vital Signs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Temperature */}
          <div className="group bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl border border-orange-200 overflow-hidden shadow-lg hover:shadow-xl transition">
            <div className="p-8 h-full flex flex-col justify-between">
              <div>
                <div className="text-orange-700 text-sm font-bold uppercase tracking-wide mb-3">
                  Body Temperature
                </div>
                <div className="text-5xl sm:text-6xl font-bold text-gray-900 mb-2">
                  {cow.temperature}°
                </div>
                <div className="text-orange-700 font-semibold">Celsius</div>
              </div>
              <div className="text-sm text-orange-700 mt-4 pt-4 border-t border-orange-200">
                {cow.temperature > 39.5
                  ? "High - needs attention"
                  : cow.temperature > 38.8
                    ? "Slightly elevated"
                    : "Normal range"}
              </div>
            </div>
          </div>

          {/* Heartbeat */}
          <div className="group bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl border border-red-200 overflow-hidden shadow-lg hover:shadow-xl transition">
            <div className="p-8 h-full flex flex-col justify-between">
              <div>
                <div className="text-red-700 text-sm font-bold uppercase tracking-wide mb-3">
                  Heartbeat
                </div>
                <div className="text-5xl sm:text-6xl font-bold text-gray-900 mb-2">
                  {cow.heartbeat}
                </div>
                <div className="text-red-700 font-semibold">
                  Beats Per Minute
                </div>
              </div>
              <div className="text-sm text-red-700 mt-4 pt-4 border-t border-red-200">
                {cow.heartbeat > 90
                  ? "High - check on cow"
                  : cow.heartbeat > 80
                    ? "Slightly elevated"
                    : "Normal range"}
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="group bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl border border-blue-200 overflow-hidden shadow-lg hover:shadow-xl transition">
            <div className="p-8 h-full flex flex-col justify-between">
              <div>
                <div className="text-blue-700 text-sm font-bold uppercase tracking-wide mb-3">
                  Activity Level
                </div>
                <div className="text-5xl sm:text-6xl font-bold text-gray-900 mb-2">
                  {cow.activity}
                </div>
                <div className="text-blue-700 font-semibold">
                  Movement & Motion
                </div>
              </div>
              <div className="text-sm text-blue-700 mt-4 pt-4 border-t border-blue-200">
                {cow.activity < 50
                  ? "Low - check health"
                  : cow.activity < 70
                    ? "Below average"
                    : "Good activity"}
              </div>
            </div>
          </div>

          {/* Methane Level */}
          <div className="group bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl border border-emerald-200 overflow-hidden shadow-lg hover:shadow-xl transition">
            <div className="p-8 h-full flex flex-col justify-between">
              <div>
                <div className="text-emerald-700 text-sm font-bold uppercase tracking-wide mb-3">
                  Gas Level
                </div>
                <div className="text-5xl sm:text-6xl font-bold text-gray-900 mb-2">
                  {cow.methane_level}
                </div>
                <div className="text-emerald-700 font-semibold">
                  Methane Emissions
                </div>
              </div>
              <div className="text-sm text-emerald-700 mt-4 pt-4 border-t border-emerald-200">
                Baseline tracking
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 p-8 mb-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 rounded-xl p-3 flex-shrink-0">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="text-purple-700 text-sm font-bold uppercase tracking-wide mb-2">
                Location
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {cow?.location?.lat?.toFixed(4)}°N
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-4">
                {Math.abs(cow.location.lng).toFixed(4)}°W
              </div>
              <div className="text-sm text-gray-600">
                Latitude: {cow.location.lat.toFixed(4)} • Longitude:{" "}
                {cow.location.lng.toFixed(4)}
              </div>
            </div>
          </div>
        </div>
        {/*
         <div className={`bg-gradient-to-br ${health.bgGradient} border ${health.borderColor} rounded-2xl p-8 mb-8 shadow-lg`}>
          <div className="flex items-start gap-4">
            <div className={`${health.badgeBg} text-white rounded-xl p-3 flex-shrink-0`}>
              {health.icon === 'check' && <CheckCircle className="w-6 h-6" />}
              {health.icon === 'warn' && <AlertTriangle className="w-6 h-6" />}
              {health.icon === 'alert' && <AlertTriangle className="w-6 h-6" />}
            </div>
            <div className="flex-1">
              <h2 className={`text-2xl font-bold ${health.textColor} mb-2`}>Health Status</h2>
              <p className={`text-lg ${health.textColor} leading-relaxed`}>{health.message}</p>
            </div>
          </div>
        </div> */}

        {/* Device Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm text-center">
          <Zap className="w-5 h-5 text-gray-500 mx-auto mb-2" />
          <div className="text-sm text-gray-600 font-semibold mb-1">
            Device ID
          </div>
          <div className="text-2xl font-bold text-gray-900 font-mono">
            {device}
          </div>
        </div>

        {/* AI Analysis */}
        {analysis && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200 p-8 mb-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-xl p-3 flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-blue-700 text-sm font-bold uppercase tracking-wide mb-2">
                  AI Health Analysis
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  Risk Level: {analysis.Risk_Level}
                </div>
                <div className="text-md font-semibold text-gray-900 mb-4">
                  Possible Disease:{" "}
                  {analysis.possible_disease || analysis.Possible_Disease}
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Reason: {analysis.reason || analysis.Reason}
                </p>
                <div className="text-sm text-gray-600 font-semibold mb-1">
                  Recommendation:{" "}
                  {analysis.recommendation || analysis.Recommendation}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => router.back()}
            className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg hover:shadow-xl"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
