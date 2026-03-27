"use client";

import React, { useState } from "react";

export default function IPManager() {
  const [ipAddress, setIpAddress] = useState("");
  const [deviceData, setDeviceData] = useState<any>(null);
  const [status, setStatus] = useState("Ready");

  // 1. FIRST SEPARATE API: GET FROM DEVICE IP
  const fetchFromDevice = async () => {
    setStatus("Fetching from IP...");
    try {
      const response = await fetch(`http://${ipAddress}/data`);
      const data = await response.json();

      setDeviceData(data); // Save data to state so we can send it later
      setStatus("✅ Data Received from IP");
      forwardToApi(data);
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to reach IP");
    }
  };

  // 2. SECOND SEPARATE API: POST TO FIXED ENDPOINT
  const forwardToApi = async (data: any) => {
    if (!deviceData) {
      setStatus("⚠️ No data to send! Fetch from IP first.");
      return;
    }

    setStatus("Forwarding to Final API...");
    try {
      const FIXED_API = "https://your-fixed-api.com/endpoint";
      const response = await fetch(FIXED_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus("✅ Successfully Forwarded to API");
      } else {
        setStatus(`❌ API error: ${response.status}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to reach Final API");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-6">
        <h1 className="text-sm font-bold text-zinc-500 uppercase">
          Dual-Stage Relay
        </h1>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400">Target IP Address</label>
          <input
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded outline-none focus:border-blue-500"
            placeholder="192.168.x.x"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={fetchFromDevice}
            className="bg-zinc-100 text-black py-2 rounded font-bold text-xs hover:bg-white transition-colors"
          >
            1. GET FROM IP
          </button>

          <button
            onClick={forwardToApi}
            className="bg-blue-600 py-2 rounded font-bold text-xs hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            2. POST TO API
          </button>
        </div>

        <div className="p-4 bg-black/50 border border-zinc-800 rounded text-xs font-mono">
          <p className="text-zinc-500 mb-1">Status: {status}</p>
          <div className="max-h-24 overflow-auto text-emerald-500">
            {deviceData ? JSON.stringify(deviceData) : "// Waiting for data..."}
          </div>
        </div>
      </div>
    </div>
  );
}
