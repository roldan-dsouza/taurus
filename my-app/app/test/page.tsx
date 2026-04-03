"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Thermometer,
  Wind,
  Zap,
  Move,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
}

interface ESP32Response {
  bpm: number;
  temperature: number;
  gas: number;
  points: number;
  intensity: number;
  accel: AccelerometerData;
}

const ESP32Dashboard = () => {
  const [data, setData] = useState<ESP32Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ipAddress = "192.168.4.1";

  const fetchSensorData = async () => {
    try {
      const response = await fetch(`http://${ipAddress}/data`);

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const json: ESP32Response = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError("Could not connect to ESP32. Check IP and CORS headers.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData();

    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchSensorData, 1000);
    return () => clearInterval(interval);
  }, []);

  // 1. Loading State
  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-300 font-sans">
        <RefreshCw className="animate-spin mb-4 text-blue-500" size={32} />
        <p className="font-mono text-sm">
          Connecting to http://{ipAddress}/data...
        </p>
      </div>
    );
  }

  // 2. Error State
  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-red-400 p-6 text-center font-sans">
        <AlertCircle size={48} className="mb-4" />
        <p className="font-bold mb-2">Connection Failed</p>
        <p className="text-sm opacity-80 mb-6 max-w-xs font-mono">{error}</p>
        <button
          onClick={fetchSensorData}
          className="px-6 py-2 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition text-sm font-bold"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // 3. Main UI (Only renders if data exists)
  return (
    <div className="min-h-screen bg-slate-950 p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-blue-900/20">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-slate-100 text-xl font-bold tracking-tight">
              ESP32 Monitor
            </h1>
            <p className="text-slate-500 text-xs font-mono">{ipAddress}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase">
              Live
            </span>
          </div>
        </div>

        {/* Vital Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-2 text-rose-400 mb-2">
              <Activity size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Heart Rate
              </span>
            </div>
            <div className="text-3xl font-black text-white">
              {data?.bpm}
              <span className="ml-1 text-xs font-normal text-slate-500">
                BPM
              </span>
            </div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Thermometer size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Temperature
              </span>
            </div>
            <div className="text-3xl font-black text-white">
              {Number(data?.temperature).toFixed(1)}
              <span className="text-lg">°C</span>
            </div>
          </div>
        </div>

        {/* List Stats */}
        <div className="space-y-3 mb-6 px-1">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2 text-slate-400 font-medium">
              <Wind size={14} className="text-sky-400" /> Gas Concentration
            </span>
            <span className="font-mono text-white font-bold">{data?.gas}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2 text-slate-400 font-medium">
              <Zap size={14} className="text-yellow-400" /> Intensity
            </span>
            <span className="font-mono text-white font-bold">
              {data?.intensity}
            </span>
          </div>
        </div>

        {/* Accelerometer Box */}
        <div className="bg-black/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400 mb-4">
            <Move size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
              Motion / IMU
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(["x", "y", "z"] as const).map((axis) => (
              <div
                key={axis}
                className="text-center p-2 bg-slate-900 rounded-lg border border-slate-800"
              >
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                  {axis}
                </div>
                <div className="font-mono text-emerald-400 font-bold">
                  {data?.accel[axis]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
            Total Points: {data?.points}
          </span>
          <button
            onClick={fetchSensorData}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 transition transform active:scale-95"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ESP32Dashboard;
