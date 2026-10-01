import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import Navbar from "../../Layouts/Navbar";
import Footer from "../../Layouts/Footer";

import TabPokja4 from "./TabPokja4";
import TabKunjunganPyd from "./TabKunjunganPyd";
import TabKegiatanPosyandu from "./TabKegiatanPosyandu";
import TabRekapitulasi from "./TabRekapitulasi";
import { Activity, Baby, ClipboardList, HeartPulse } from "lucide-react";

interface Props {
    data: any;
    kunjungan_pyd?: any;
    kegiatan_posyandu?: any;
    rekapitulasi?: any;
    filters?: {
        search?: string;
        tahun?: string;
        activeTab?: string;
    };
}

export default function Index({
    data,
    kunjungan_pyd = [],
    kegiatan_posyandu = [],
    rekapitulasi = [],
    filters = {},
}: Props) {
    const [activeTab, setActiveTab] = useState<string>(
        filters.activeTab || "pokja4"
    );
    const [tahun, setTahun] = useState<string>(
        filters.tahun || new Date().getFullYear().toString()
    );

    useEffect(() => {
        setActiveTab(filters.activeTab || "pokja4");
        setTahun(filters.tahun || new Date().getFullYear().toString());
    }, [filters.activeTab, filters.tahun]);

    const tabs = [
        { id: "pokja4", label: "POKJA IV", icon: Activity },
        { id: "kunjungan", label: "Kunjungan PYD", icon: Baby },
        { id: "posyandu", label: "Kegiatan Posyandu", icon: HeartPulse },
        { id: "rekapitulasi", label: "Rekapitulasi", icon: ClipboardList },
    ];

    // ✅ FIX: Ganti tab — update URL — BIAR DATA REFRESH
    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        router.get(
            "/pokja-4",
            {
                tahun: tahun,
                activeTab: tabId,
                search: filters.search || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                // ⬅️ JANGAN pakai only:[] — biar data ke-refresh
            }
        );
    };

    // ✅ Ganti tahun — update URL & refresh data
    const handleTahunChange = (newTahun: string) => {
        setTahun(newTahun);
        router.get(
            "/pokja-4",
            {
                tahun: newTahun,
                activeTab: activeTab,
                search: filters.search || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 pt-14 sm:pt-16">
            <Head title="Data Pokja IV - TP PKK Kab. Tasikmalaya" />  {/* ✅ FIX: typo */}
            <Navbar />

            {/* TAB BAR */}
            <div className="sticky top-14 sm:top-16 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                    <nav
                        aria-label="Bagian data Pokja IV"
                        className="overflow-x-auto"
                    >
                        <div className="inline-flex min-w-full gap-1.5 rounded-xl border border-slate-200 bg-slate-100/80 p-1.5 sm:min-w-0">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => handleTabChange(tab.id)}
                                        aria-current={isActive ? "page" : undefined}
                                        className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#0072BC] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 ${
                                            isActive
                                                ? "border-blue-100 bg-white text-[#0072BC] shadow-sm"
                                                : "border-transparent bg-transparent text-slate-600 hover:bg-white/70 hover:text-slate-900"
                                        }`}
                                    >
                                        <Icon size={17} strokeWidth={2} aria-hidden="true" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </nav>
                </div>
            </div>

            {/* CONTENT */}
            <main className="flex-1 w-full">
                {activeTab === "pokja4" && (
                    <TabPokja4
                        data={data}
                        tahun={tahun}
                        onTahunChange={handleTahunChange}
                    />
                )}
                {activeTab === "kunjungan" && (
                    <TabKunjunganPyd
                        data={kunjungan_pyd}
                        tahun={tahun}
                        onTahunChange={handleTahunChange}
                    />
                )}
                {activeTab === "posyandu" && (
                    <TabKegiatanPosyandu
                        data={kegiatan_posyandu}
                        tahun={tahun}
                        onTahunChange={handleTahunChange}
                    />
                )}
                {activeTab === "rekapitulasi" && (
                    <TabRekapitulasi
                        data={rekapitulasi}
                        tahun={tahun}
                        onTahunChange={handleTahunChange}
                    />
                )}
            </main>

            <Footer />
        </div>
    );
}
