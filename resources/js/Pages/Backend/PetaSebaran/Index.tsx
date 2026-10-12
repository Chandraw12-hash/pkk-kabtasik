import React, { useEffect, useRef, useState } from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { RotateCcw, MapPin } from "lucide-react";
import axios from "axios";

interface Pin {
    id: number;
    nama: string | null;
    alamat: string | null;
    kecamatan: string | null;
    desa: string | null;
    lat: number;
    lng: number;
    kriteria: string | null;
    status: string | null;
}

interface Stats {
    total: number;
    sehat: number;
    kurang_sehat: number;
}

interface IndexProps {
    pins: Pin[];
    stats: Stats;
    filters?: {
        kecamatan?: string;
        desa?: string;
        kriteria?: string;
    };
    kecamatanList: string[];
    desaByKecamatan: Record<string, string[]>;
}

const WARNA: Record<string, string> = {
    Sehat: "#16A34A",
    "Kurang Sehat": "#DC2626",
};

const dotIcon = (kriteria: string | null) =>
    L.divIcon({
        className: "",
        html: `<span style="display:block;width:14px;height:14px;border-radius:50%;background:${
            WARNA[kriteria ?? ""] || "#64748B"
        };border:2.5px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.35)"></span>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
    });

const esc = (s: string | null | undefined) =>
    (s || "-").replace(/&/g, "&amp;").replace(/</g, "&lt;");

function ClusterLayer({ points }: { points: Pin[] }) {
    const map = useMap();
    const groupRef = useRef<L.MarkerClusterGroup | null>(null);

    useEffect(() => {
        if (groupRef.current) {
            map.removeLayer(groupRef.current);
            groupRef.current = null;
        }
        const group = L.markerClusterGroup({
            showCoverageOnHover: false,
            maxClusterRadius: 48,
        });
        points.forEach((p) => {
            const m = L.marker([p.lat, p.lng], { icon: dotIcon(p.kriteria) });
            m.bindPopup(
                `<div style="min-width:200px;font-family:inherit">` +
                    `<p style="font-weight:800;font-size:13px;margin:0 0 2px">${
                        esc(p.nama) || "Tanpa nama"
                    }</p>` +
                    `<p style="font-size:11px;color:#64748B;margin:0 0 6px">${
                        esc(p.desa)
                    } &bull; Kec. ${esc(p.kecamatan)}</p>` +
                    (p.alamat
                        ? `<p style="font-size:11px;margin:0 0 6px">${esc(
                              p.alamat
                          )}</p>`
                        : "") +
                    `<p style="font-size:11px;margin:0 0 8px">Kriteria: <b>${
                        esc(p.kriteria) || "Belum diisi"
                    }</b></p>` +
                    `<a href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}" target="_blank" rel="noopener" style="font-size:11px;font-weight:700;color:#0072BC">Buka di Google Maps</a>` +
                    `</div>`
            );
            group.addLayer(m);
        });
        group.addTo(map);
        groupRef.current = group;
        return () => {
            if (groupRef.current) {
                map.removeLayer(groupRef.current);
                groupRef.current = null;
            }
        };
    }, [map, points]);

    return null;
}

const selectClass =
    "bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shrink-0";

export default function Index({
    pins,
    stats,
    filters = {},
    kecamatanList,
    desaByKecamatan,
}: IndexProps) {
    const [kecamatan, setKecamatan] = useState(filters.kecamatan || "");
    const [desa, setDesa] = useState(filters.desa || "");
    const [kriteria, setKriteria] = useState(filters.kriteria || "");
    const [localPins, setLocalPins] = useState<Pin[]>(pins || []);
    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = useRef(true);

    useEffect(() => {
        setLocalPins(pins || []);
    }, [pins]);

    const desaOptions: string[] = kecamatan
        ? desaByKecamatan[kecamatan] || []
        : [];

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            setIsLoading(true);
            axios
                .get(route("be.peta-sebaran.index"), {
                    params: {
                        kecamatan: kecamatan || undefined,
                        desa: desa || undefined,
                        kriteria: kriteria || undefined,
                    },
                    headers: { Accept: "application/json" },
                })
                .then((res) => {
                    if (res.data && Array.isArray(res.data.pins)) {
                        setLocalPins(res.data.pins);
                    }
                })
                .catch((err) =>
                    console.error("Gagal memuat pin peta:", err)
                )
                .finally(() => setIsLoading(false));
        }, 350);
        return () => clearTimeout(timeout);
    }, [kecamatan, desa, kriteria]);

    const handleReset = () => {
        setKecamatan("");
        setDesa("");
        setKriteria("");
    };

    const hasFilter = Boolean(kecamatan) || Boolean(desa) || Boolean(kriteria);

    const cards = [
        { label: "Total Pin", count: stats?.total ?? 0, dot: "#0072BC" },
        { label: "Rumah Sehat", count: stats?.sehat ?? 0, dot: "#16A34A" },
        {
            label: "Kurang Sehat",
            count: stats?.kurang_sehat ?? 0,
            dot: "#DC2626",
        },
    ];

    return (
        <MainLayout>
            <Head title="Peta Sebaran Rumah" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-100">
                        Peta Sebaran Rumah
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Titik GPS rumah dari pendataan dasawisma — hijau
                        sehat, merah kurang sehat
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
                {cards.map((c) => (
                    <div
                        key={c.label}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3"
                    >
                        <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                            {c.count}
                        </p>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <span
                                className="inline-block w-2.5 h-2.5 rounded-full"
                                style={{ background: c.dot }}
                            />
                            {c.label}
                        </p>
                    </div>
                ))}
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 flex flex-col lg:flex-row lg:items-center gap-3">
                    <select
                        value={kecamatan}
                        onChange={(e) => {
                            setKecamatan(e.target.value);
                            setDesa("");
                        }}
                        className={`${selectClass} w-full lg:w-56`}
                    >
                        <option value="">Semua Kecamatan</option>
                        {kecamatanList.map((k) => (
                            <option key={k} value={k}>
                                {k}
                            </option>
                        ))}
                    </select>

                    <select
                        value={desa}
                        onChange={(e) => setDesa(e.target.value)}
                        disabled={!kecamatan}
                        className={`${selectClass} w-full lg:w-56 disabled:opacity-50`}
                    >
                        <option value="">
                            {kecamatan ? "Semua Desa" : "Pilih kecamatan dulu"}
                        </option>
                        {desaOptions.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>

                    <select
                        value={kriteria}
                        onChange={(e) => setKriteria(e.target.value)}
                        className={`${selectClass} w-full lg:w-48`}
                    >
                        <option value="">Semua Kriteria</option>
                        <option value="Sehat">Sehat</option>
                        <option value="Kurang Sehat">Kurang Sehat</option>
                    </select>

                    {hasFilter && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shrink-0"
                        >
                            <RotateCcw size={15} />
                            Reset
                        </button>
                    )}

                    <p className="text-xs text-slate-400 sm:ml-auto">
                        {localPins.length} pin tampil
                        {isLoading ? " (memuat…)" : ""}
                    </p>
                </div>

                <div className="relative">
                    <MapContainer
                        center={[-7.35, 108.1]}
                        zoom={10}
                        scrollWheelZoom={true}
                        style={{ height: "560px", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <ClusterLayer points={localPins} />
                    </MapContainer>

                    {localPins.length === 0 && !isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-4 flex items-center gap-3 shadow-lg">
                                <MapPin
                                    size={22}
                                    className="text-slate-400 shrink-0"
                                />
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    Belum ada pin — pasang titik peta dari
                                    form dasawisma.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                        Sehat
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                        Kurang Sehat
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#64748B]" />
                        Belum diisi
                    </span>
                </div>
            </Card>
        </MainLayout>
    );
}
