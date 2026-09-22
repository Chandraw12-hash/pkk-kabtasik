import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import Navbar from "../../Layouts/Navbar";
import Footer from "../../Layouts/Footer";

import TabDataUmumPkk from "./TabDataUmumPkk";
import TabDataKegiatan from "./TabDataKegiatan";
import TabRekapBumil from "./TabRekapBumil";

interface Props {
    data: any;
    dataKegiatan?: any;
    rekapBumil?: any;
    filters?: {
        search?: string;
        year?: string;
        kecamatan?: string;
        activeTab?: string;
    };
}

export default function Index({
    data,
    dataKegiatan = [],
    rekapBumil = [],
    filters = {},
}: Props) {
    const [activeTab, setActiveTab] = useState<string>(
        filters.activeTab || "data-umum"
    );
    const [tahun, setTahun] = useState<string>(
        filters.year || new Date().getFullYear().toString()
    );

    useEffect(() => {
        setActiveTab(filters.activeTab || "data-umum");
        setTahun(filters.year || new Date().getFullYear().toString());
    }, [filters.activeTab, filters.year]);

    const tabs = [
        { id: "data-umum", label: "Data Umum PKK" },
        { id: "data-kegiatan", label: "Data Kegiatan" },
        { id: "rekap-bumil", label: "Rekap Bumil" },
    ];

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        router.get(
            "/sekretariat",
            {
                year: tahun,
                activeTab: tabId,
                kecamatan: filters.kecamatan || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleTahunChange = (newTahun: string) => {
        setTahun(newTahun);
        router.get(
            "/sekretariat",
            {
                year: newTahun,
                activeTab: activeTab,
                kecamatan: filters.kecamatan || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 pt-14 sm:pt-16">
            <Head title="Data Sekretariat - TP PKK Kab. Tasikmalaya" />
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
                {activeTab === "data-umum" && (
                    <TabDataUmumPkk
                        data={data}
                        tahun={tahun}
                        onTahunChange={handleTahunChange}
                    />
                )}
                {activeTab === "data-kegiatan" && (
                    <TabDataKegiatan
                        data={dataKegiatan}
                        tahun={tahun}
                        onTahunChange={handleTahunChange}
                    />
                )}
                {activeTab === "rekap-bumil" && (
                    <TabRekapBumil
                        data={rekapBumil}
                        tahun={tahun}
                        onTahunChange={handleTahunChange}
                    />
                )}
            </main>

            <Footer />
        </div>
    );
}
