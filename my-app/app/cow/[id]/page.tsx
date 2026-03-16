'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MapPin, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

// Dummy cow data
const cowsData = [
  {
    cow_id: 1,
    cow_name: 'Bessie',
    cow_breed: 'Holstein',
    cow_age: 5,
    device_id: 'DEV001',
    temperature: 38.2,
    heartbeat: 65,
    activity: 85,
    methane_level: 42,
    location: { lat: 40.7128, lng: -74.0060 },
    reading_time: '2 min ago',
  },
  {
    cow_id: 2,
    cow_name: 'Daisy',
    cow_breed: 'Jersey',
    cow_age: 3,
    device_id: 'DEV002',
    temperature: 38.5,
    heartbeat: 72,
    activity: 90,
    methane_level: 48,
    location: { lat: 40.7150, lng: -74.0070 },
    reading_time: '1 min ago',
  },
  {
    cow_id: 3,
    cow_name: 'Molly',
    cow_breed: 'Angus',
    cow_age: 6,
    device_id: 'DEV003',
    temperature: 39.8,
    heartbeat: 95,
    activity: 45,
    methane_level: 68,
    location: { lat: 40.7100, lng: -74.0050 },
    reading_time: '5 min ago',
  },
  {
    cow_id: 4,
    cow_name: 'Clara',
    cow_breed: 'Guernsey',
    cow_age: 4,
    device_id: 'DEV004',
    temperature: 38.3,
    heartbeat: 68,
    activity: 88,
    methane_level: 44,
    location: { lat: 40.7180, lng: -74.0090 },
    reading_time: '3 min ago',
  },
];

function getHealthStatus(cow: typeof cowsData[0]) {
  const temp = cow.temperature;
  const heart = cow.heartbeat;
  const activity = cow.activity;

  if (temp > 39.5 || heart > 90 || activity < 50) {
    return {
      status: 'danger',
      message: 'Check on this cow soon! Temperature or heartbeat is high, or activity is low.',
      bgGradient: 'from-red-50 to-orange-100',
      borderColor: 'border-red-200',
      badgeBg: 'bg-red-600',
      textColor: 'text-red-700',
      icon: 'alert',
    };
  }

  if (temp > 38.8 || heart > 80 || activity < 70) {
    return {
      status: 'warning',
      message: 'Keep an eye on this cow. Vital signs are slightly elevated.',
      bgGradient: 'from-amber-50 to-orange-100',
      borderColor: 'border-amber-200',
      badgeBg: 'bg-amber-500',
      textColor: 'text-amber-700',
      icon: 'warn',
    };
  }

  return {
    status: 'healthy',
    message: 'Your cow looks healthy! All vital signs are normal.',
    bgGradient: 'from-emerald-50 to-green-100',
    borderColor: 'border-emerald-200',
    badgeBg: 'bg-emerald-600',
    textColor: 'text-emerald-700',
    icon: 'check',
  };
}

export default function CowDetail() {
  const router = useRouter();
  const params = useParams();
  const cowId = parseInt(params.id as string);

  const cow = cowsData.find(c => c.cow_id === cowId);

  if (!cow) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">Cow Not Found</h1>
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

  const health = getHealthStatus(cow);

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
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{cow.cow_name}</h1>
            <p className="text-gray-600">Detailed health monitoring</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Basic Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="text-gray-600 text-sm font-bold uppercase tracking-wide mb-2">Breed</div>
            <div className="text-3xl font-bold text-gray-900">{cow.cow_breed}</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="text-gray-600 text-sm font-bold uppercase tracking-wide mb-2">Age</div>
            <div className="text-3xl font-bold text-gray-900">{cow.cow_age} years</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="text-gray-600 text-sm font-bold uppercase tracking-wide mb-2">Last Update</div>
            <div className="text-xl font-bold text-gray-900">{cow.reading_time}</div>
          </div>
        </div>

        {/* Vital Signs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Temperature */}
          <div className="group bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl border border-orange-200 overflow-hidden shadow-lg hover:shadow-xl transition">
            <div className="p-8 h-full flex flex-col justify-between">
              <div>
                <div className="text-orange-700 text-sm font-bold uppercase tracking-wide mb-3">Body Temperature</div>
                <div className="text-5xl sm:text-6xl font-bold text-gray-900 mb-2">{cow.temperature}°</div>
                <div className="text-orange-700 font-semibold">Celsius</div>
              </div>
              <div className="text-sm text-orange-700 mt-4 pt-4 border-t border-orange-200">
                {cow.temperature > 39.5 ? 'High - needs attention' : cow.temperature > 38.8 ? 'Slightly elevated' : 'Normal range'}
              </div>
            </div>
          </div>

          {/* Heartbeat */}
          <div className="group bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl border border-red-200 overflow-hidden shadow-lg hover:shadow-xl transition">
            <div className="p-8 h-full flex flex-col justify-between">
              <div>
                <div className="text-red-700 text-sm font-bold uppercase tracking-wide mb-3">Heartbeat</div>
                <div className="text-5xl sm:text-6xl font-bold text-gray-900 mb-2">{cow.heartbeat}</div>
                <div className="text-red-700 font-semibold">Beats Per Minute</div>
              </div>
              <div className="text-sm text-red-700 mt-4 pt-4 border-t border-red-200">
                {cow.heartbeat > 90 ? 'High - check on cow' : cow.heartbeat > 80 ? 'Slightly elevated' : 'Normal range'}
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="group bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl border border-blue-200 overflow-hidden shadow-lg hover:shadow-xl transition">
            <div className="p-8 h-full flex flex-col justify-between">
              <div>
                <div className="text-blue-700 text-sm font-bold uppercase tracking-wide mb-3">Activity Level</div>
                <div className="text-5xl sm:text-6xl font-bold text-gray-900 mb-2">{cow.activity}%</div>
                <div className="text-blue-700 font-semibold">Movement & Motion</div>
              </div>
              <div className="text-sm text-blue-700 mt-4 pt-4 border-t border-blue-200">
                {cow.activity < 50 ? 'Low - check health' : cow.activity < 70 ? 'Below average' : 'Good activity'}
              </div>
            </div>
          </div>

          {/* Methane Level */}
          <div className="group bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl border border-emerald-200 overflow-hidden shadow-lg hover:shadow-xl transition">
            <div className="p-8 h-full flex flex-col justify-between">
              <div>
                <div className="text-emerald-700 text-sm font-bold uppercase tracking-wide mb-3">Gas Level</div>
                <div className="text-5xl sm:text-6xl font-bold text-gray-900 mb-2">{cow.methane_level}</div>
                <div className="text-emerald-700 font-semibold">Methane Emissions</div>
              </div>
              <div className="text-sm text-emerald-700 mt-4 pt-4 border-t border-emerald-200">
                Baseline tracking
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 p-8 mb-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 rounded-xl p-3 flex-shrink-0">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="text-purple-700 text-sm font-bold uppercase tracking-wide mb-2">Location</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {cow.location.lat.toFixed(4)}°N
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-4">
                {Math.abs(cow.location.lng).toFixed(4)}°W
              </div>
              <div className="text-sm text-gray-600">
                Latitude: {cow.location.lat.toFixed(4)} • Longitude: {cow.location.lng.toFixed(4)}
              </div>
            </div>
          </div>
        </div>

        {/* Health Status */}
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
        </div>

        {/* Device Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm text-center">
          <Zap className="w-5 h-5 text-gray-500 mx-auto mb-2" />
          <div className="text-sm text-gray-600 font-semibold mb-1">Device ID</div>
          <div className="text-2xl font-bold text-gray-900 font-mono">{cow.device_id}</div>
        </div>

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
