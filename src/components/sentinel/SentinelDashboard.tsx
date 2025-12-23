"use client";

import React, { useRef, useEffect } from "react";
import { useSentinelVision } from "@/hooks/useSentinelVision";
import { Shield, LayoutDashboard, Zap, Eye, AlertTriangle } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function SentinelDashboard() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { state, startVision } = useSentinelVision();

    useEffect(() => {
        async function setupCamera() {
            if (!videoRef.current) return;
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480, frameRate: 24 }
                });
                videoRef.current.srcObject = stream;
                startVision(videoRef.current);
            } catch (err) {
                console.error("Camera Setup Error:", err);
            }
        }
        setupCamera();
    }, [startVision]);

    return (
        <main className="min-h-screen bg-neutral-950 text-white p-6 font-sans">
            {/* Privacy Shield Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-50 transition-all duration-500 pointer-events-none flex items-center justify-center",
                    state.multiplePeople ? "backdrop-blur-3xl bg-black/60 opacity-100" : "opacity-0"
                )}
            >
                <div className="text-center">
                    <Shield className="w-24 h-24 text-cyan-500 animate-pulse mx-auto mb-4" />
                    <h2 className="text-4xl font-bold tracking-tighter text-cyan-400">GİZLİLİK KALKANI AKTİF</h2>
                    <p className="text-neutral-400 mt-2">Yakın çevrede yetkisiz personel tespit edildi.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex justify-between items-end border-b border-neutral-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-white">SENTINEL_FOCUS</h1>
                        <p className="text-neutral-500 text-sm font-mono tracking-widest uppercase mt-1">DURUM: {state.active ? "NOMİNAL" : "BAŞLATILIYOR"}</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-lg flex items-center gap-3">
                            <Zap className={cn("w-4 h-4 transition-colors", state.active ? "text-yellow-500" : "text-neutral-600")} />
                            <span className="text-xs font-mono">ÇEKİRDEK_YZ</span>
                        </div>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Vision Feed */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="relative aspect-video bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 ring-1 ring-white/5">
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className={cn(
                                    "w-full h-full object-cover transition-all duration-300",
                                    state.multiplePeople && "grayscale brightness-50"
                                )}
                            />

                            {/* HUD Elements */}
                            <div className="absolute top-4 left-4 p-3 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
                                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                                    CANLI_TARAYICI_v4.1
                                </div>
                            </div>

                            <div className="absolute bottom-4 right-4 flex gap-2">
                                {state.phoneDetected && (
                                    <div className="bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1.5 rounded-md text-xs font-bold animate-bounce flex items-center gap-2">
                                        <AlertTriangle className="w-3 h-3" /> DİKKAT_DAĞITICI_TESPİT_EDİLDİ
                                    </div>
                                )}
                                {state.isSlouching && (
                                    <div className="bg-orange-500/20 text-orange-400 border border-orange-500/50 px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2">
                                        <Eye className="w-3 h-3" /> DURUŞ_UYARISI
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 hover:border-neutral-700 transition-colors">
                                <p className="text-neutral-500 text-[10px] font-mono uppercase tracking-[0.2em]">Verimlilik Skoru</p>
                                <h3 className="text-4xl font-bold mt-1 text-white">94<span className="text-sm font-normal text-neutral-500 ml-1">%</span></h3>
                            </div>
                            <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 hover:border-neutral-700 transition-colors">
                                <p className="text-neutral-500 text-[10px] font-mono uppercase tracking-[0.2em]">Oturum Süresi</p>
                                <h3 className="text-4xl font-bold mt-1 text-white">02<span className="text-sm font-normal text-neutral-500">:</span>42</h3>
                            </div>
                        </div>
                    </div>

                    {/* Action Center */}
                    <section className="space-y-6">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl">
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="text-cyan-500 w-5 h-5" />
                                <h3 className="text font-bold uppercase tracking-widest text-sm">Savunma Protokolleri</h3>
                            </div>

                            <ul className="space-y-4">
                                {[
                                    { label: "Gizlilik Kalkanı", active: state.multiplePeople, color: "text-cyan-400" },
                                    { label: "Telefon Dedektörü", active: state.phoneDetected, color: "text-red-400" },
                                    { label: "Ergo-Tarayıcı", active: true, color: "text-green-400" },
                                    { label: "Yerel Şifreleme", active: true, color: "text-blue-400" }
                                ].map((item, idx) => (
                                    <li key={idx} className="flex justify-between items-center text-xs font-mono">
                                        <span className="text-neutral-400">{item.label}</span>
                                        <span className={cn(item.active ? item.color : "text-neutral-700")}>
                                            {item.active ? "√ AKTİF" : "× BEKLEMEDE"}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800">
                            <div className="flex items-center gap-3 mb-4">
                                <LayoutDashboard className="text-purple-500 w-5 h-5" />
                                <h3 className="text font-bold uppercase tracking-widest text-sm">Derin Çalışma Günlüğü</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 w-3/4" />
                                </div>
                                <p className="text-[10px] text-neutral-500 font-mono">GÜNLÜK_HEDEF: %75 TAMAMLANDI</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
