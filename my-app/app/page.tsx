"use client";

// ─── IMPORTANT: This is a single self-contained file. ───────────────────────
// No CanvasComponent.tsx needed. The Canvas is rendered inline via dynamic()
// to prevent Next.js hydration mismatch on SSR.

import React, { Suspense, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  CheckCircle,
  Zap,
  Brain,
  Radio,
  ArrowRight,
  Activity,
  MapPin,
  Mic,
} from "lucide-react";

// ─── Lazy-load the entire 3D scene (no SSR) ──────────────────────────────────
// This is the correct pattern to avoid hydration errors with R3F + Next.js.
// Everything Three.js-related lives inside this dynamic import boundary.

const CowCanvas = dynamic(() => import("./cowcanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-white/20 text-emerald-800">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <span className="font-medium text-sm tracking-wide">
        Loading 3D Model…
      </span>
    </div>
  ),
});

// ─── Main Page (pure React, zero Three.js) ───────────────────────────────────

export default function GaumitraLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50 selection:bg-emerald-200">
      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 border-b border-emerald-200 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-2xl font-bold text-emerald-900 tracking-tight">
              Gaumitra
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-emerald-600 font-medium transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-emerald-600 font-medium transition"
            >
              How It Works
            </a>
            <a
              href="#tech"
              className="text-gray-700 hover:text-emerald-600 font-medium transition"
            >
              Technology
            </a>
          </div>
          <Link
            href="/dashboard"
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-md"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-green-200/40 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <div className="inline-block px-4 py-1.5 bg-emerald-100 border border-emerald-200 rounded-full text-emerald-700 text-sm font-bold tracking-wide uppercase">
                  Next-Gen Livestock Monitoring
                </div>
                <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 leading-[1.1]">
                  Your Cow's <br />
                  <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                    Best Friend
                  </span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  AI-powered health monitoring that works{" "}
                  <span className="underline decoration-emerald-400 decoration-2 underline-offset-4 font-bold">
                    offline first
                  </span>
                  —even in remote farms with zero connectivity.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/dashboard"
                  className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition shadow-xl hover:shadow-emerald-200/50 transform hover:-translate-y-1 inline-flex items-center justify-center gap-2"
                >
                  View Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition">
                  Learn More
                </button>
              </div>

              <div className="pt-8 border-t border-emerald-200 flex flex-wrap justify-center lg:justify-start gap-6">
                {[
                  "GSM Offline Alerts",
                  "Non-Invasive IoT",
                  "AI Diagnostics",
                ].map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-2 text-gray-700 font-medium"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: 3D viewport */}
            <div className="h-[420px] sm:h-[520px] lg:h-[620px] relative rounded-3xl bg-gradient-to-b from-sky-100/60 to-emerald-50/60 backdrop-blur-sm border border-white/50 shadow-2xl overflow-hidden">
              <div className="absolute top-4 left-4 z-20 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-emerald-100 border border-emerald-400/30 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                LIVE 3D · IoT COLLAR ACTIVE
              </div>
              <div className="absolute bottom-4 right-4 z-20 bg-black/25 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white/70 font-mono select-none">
                Drag to rotate · Scroll to zoom
              </div>
              {/* CowCanvas is ssr:false — safe from hydration errors */}
              <CowCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        className="py-24 bg-white/60 backdrop-blur-md border-y border-emerald-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Built for Real-World Farming
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Proprietary sensor fusion technology to keep your livestock safe.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Radio className="w-7 h-7" />}
              title="GSM Offline Connectivity"
              desc="Uses SIM800L modules to send life-saving SMS alerts when Wi-Fi fails. Connectivity is never an issue."
              color="emerald"
            />
            <FeatureCard
              icon={<Activity className="w-7 h-7" />}
              title="Vital Biometrics"
              desc="Real-time HR, SpO2, and core body temperature tracking using medical-grade MAX30100 & DS18B20 sensors."
              color="amber"
            />
            <FeatureCard
              icon={<Zap className="w-7 h-7" />}
              title="Bloat Detection"
              desc="Unique methane gas sensing catches Bovine Tympany (Bloat) in early stages to prevent sudden fatalities."
              color="red"
            />
            <FeatureCard
              icon={<MapPin className="w-7 h-7" />}
              title="Anti-Theft Geofence"
              desc="Built-in GPS tracking with immediate alerts if your cattle move beyond designated grazing zones."
              color="blue"
            />
            <FeatureCard
              icon={<Brain className="w-7 h-7" />}
              title="Mistral AI Diagnostics"
              desc="Groq-powered edge AI analyzes patterns to diagnose mastitis or fever before symptoms are visible."
              color="purple"
            />
            <FeatureCard
              icon={<Mic className="w-7 h-7" />}
              title="Multilingual AI"
              desc="Voice-to-text health reports in regional languages ensures technology is accessible to every farmer."
              color="yellow"
            />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        id="how-it-works"
        className="py-24 bg-gradient-to-b from-white to-emerald-50/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Gaumitra Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, effective, and intelligent monitoring in three steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                title: "Attach the IoT Collar",
                desc: "The lightweight, non-invasive collar fits any cattle comfortably and starts collecting data instantly.",
              },
              {
                step: "02",
                title: "AI Analysis & Edge Processing",
                desc: "On-device AI processes vitals in real-time, detecting anomalies even without internet connection.",
              },
              {
                step: "03",
                title: "Instant Alerts & Insights",
                desc: "Receive SMS or app notifications for health issues, location breaches, or behavioral changes.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="text-center p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-emerald-100 shadow-lg"
              >
                <div className="w-16 h-16 mx-auto bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-md">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-emerald-900 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-emerald-200 font-medium">
            Gaumitra Project © 2024
          </p>
          <p className="text-emerald-400 text-sm mt-2 italic">
            Caring for the ones who provide for us.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({
  icon,
  title,
  desc,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}) {
  const palette: Record<string, string> = {
    emerald: "from-emerald-50 to-green-100 border-emerald-200 text-emerald-600",
    amber: "from-amber-50 to-yellow-100 border-amber-200 text-amber-600",
    red: "from-red-50 to-orange-100 border-red-200 text-red-600",
    blue: "from-blue-50 to-cyan-100 border-blue-200 text-blue-600",
    purple: "from-purple-50 to-indigo-100 border-purple-200 text-purple-600",
    yellow: "from-yellow-50 to-orange-100 border-yellow-200 text-yellow-600",
  };
  return (
    <div
      className={`bg-gradient-to-br ${palette[color]} rounded-3xl border p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group`}
    >
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-700 leading-relaxed italic">{desc}</p>
    </div>
  );
}
