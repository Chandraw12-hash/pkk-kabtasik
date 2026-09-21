import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import Navbar from "../../Layouts/Navbar";
import Footer from "../../Layouts/Footer";

import TabPokja4 from "./TabPokja4";
import TabKunjunganPyd from "./TabKunjunganPyd";
import TabKegiatanPosyandu from "./TabKegiatanPosyandu";
import TabRekapitulasi from "./TabRekapitulasi";

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
        { id: "pokja4", label: "POKJA IV" },
        { id: "kunjungan", label: "Kunjungan PYD" },
        { id: "posyandu", label: "Kegiatan Posyandu" },
        { id: "rekapitulasi", label: "Rekapitulasi" },
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
            <div className="bg-white border-b border-slate-200 sticky top-14 sm:top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-1 overflow-x-auto">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`shrink-0 px-4 sm:px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
                                        isActive
                                            ? "text-[#0072BC] border-[#0072BC]"
                                            : "text-slate-500 border-transparent hover:text-slate-700"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
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
