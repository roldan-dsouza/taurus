"use client";

import React, { useState, useRef } from "react";

export default function IPManager() {
  const [ipAddress, setIpAddress] = useState("192.168.4.1");
  const [status, setStatus] = useState("Ready");
  const [isLive, setIsLive] = useState(false);
  const isLiveRef = useRef(false); // Ref used to stop the loop immediately

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const startLoop = async () => {
    if (isLive) return;
    setIsLive(true);
    isLiveRef.current = true;
    runCycle();
  };

  const stopLoop = () => {
    setIsLive(false);
    isLiveRef.current = false;
    setStatus("Stopped");
  };

  const runCycle = async () => {
    if (!isLiveRef.current) return;

    setStatus("Fetching...");
    try {
      // 1. GET FROM IP
      const response = await fetch(`http://${ipAddress}/data`);
      const data = await response.json();
      console.log(data);
      const dataToSend = {
        cow_id: "COW188",
        cow_name: "Bessie",
        cow_breed: "Desi",
        cow_dob: "2015-06-15",
        device_id: "dev188",
        temperature: data.temperature,
        heartbeat: data.bpm - 5,
        activity: Math.abs(data.intensity - 300),
        methane_level: data.gas,
      };

      console.log("Data to send:", dataToSend);
      const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
      await delay(2000);
      setStatus("Forwarding...");

      // 2. POST TO FIXED API (Passing data directly)

      const FIXED_API = `${process.env.NEXT_PUBLIC_BACKEND}/api/cows/sensor-data`;
      const respoce = await fetch(FIXED_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      console.log(await respoce.json());
      setStatus("✅ Cycle Complete");
    } catch (err) {
      setStatus("❌ Bridge Failed");
    }

    // 3. WAIT AND REPEAT
    await delay(1500);
    runCycle();
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xs font-bold text-zinc-500 uppercase">
            Live Relay
          </h1>
          <div
            className={`h-2 w-2 rounded-full ${
              isLive ? "bg-emerald-500 animate-pulse" : "bg-red-500"
            }`}
          />
        </div>

        <input
          type="text"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded outline-none focus:border-blue-500 text-sm"
          placeholder="Device IP (192.168.x.x)"
        />

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={startLoop}
            disabled={isLive}
            className="bg-zinc-100 text-black py-2 rounded font-bold text-xs hover:bg-white disabled:opacity-30"
          >
            START
          </button>
          <button
            onClick={stopLoop}
            className="bg-red-600/20 text-red-500 border border-red-600/30 py-2 rounded font-bold text-xs hover:bg-red-600 hover:text-white transition-all"
          >
            STOP
          </button>
        </div>

        <div className="p-3 bg-black/50 border border-zinc-800 rounded text-[10px] font-mono text-zinc-400">
          STATUS: {status}
        </div>
      </div>
    </div>
  );
}
