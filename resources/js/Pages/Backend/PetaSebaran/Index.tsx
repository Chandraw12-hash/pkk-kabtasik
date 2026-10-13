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
    stunting: number;
    bumil: number;
    status: string | null;
}

interface Stats {
    total: number;
    sehat: number;
    kurang_sehat: number;
    stunting: number;
    bumil: number;
}

interface IndexProps {
    pins: Pin[];
    stats: Stats;
    filters?: {
        kecamatan?: string;
        desa?: string;
        kriteria?: string;
        stunting?: string;
        bumil?: string;
    };
    kecamatanList: string[];
    desaByKecamatan: Record<string, string[]>;
}

// ─── Warna — pakai nilai DB "Sehat" / "Kurang Sehat" ──────
const WARNA: Record<string, string> = {
    Sehat: "#16A34A",
    "Kurang Sehat": "#DC2626",
};

// Oranye khusus stunting — prioritas di atas hijau/merah.
const WARNA_STUNTING = "#F59E0B";

// Pink khusus bumil — tampil sebagai badge + filter (tak mengubah dot).
const WARNA_BUMIL = "#EC4899";

// ─── Label tampilan — ubah dari "Sehat" ke "Rumah Layak Huni" ───
const LABEL: Record<string, string> = {
    Sehat: "Rumah Layak Huni",
    "Kurang Sehat": "Rumah Tidak Layak Huni",
};

const dotIcon = (kriteria: string | null, stunting = 0) =>
    L.divIcon({
        className: "",
        html: `<span style="display:block;width:14px;height:14px;border-radius:50%;background:${
            stunting > 0 ? WARNA_STUNTING : WARNA[kriteria ?? ""] || "#64748B"
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
            const stunting = p.stunting ?? 0;
            const bumil = p.bumil ?? 0;
            const m = L.marker([p.lat, p.lng], { icon: dotIcon(p.kriteria, stunting) });
            const labelKriteria = p.kriteria
                ? LABEL[p.kriteria] || p.kriteria
                : "Belum diisi";
            const warnaKriteria = WARNA[p.kriteria ?? ""] || "#64748B";
            m.bindPopup(
                `<div style="min-width:220px;font-family:inherit">` +
                    `<p style="font-weight:800;font-size:13px;margin:0 0 2px">${
                        esc(p.nama) || "Tanpa nama"
                    }</p>` +
                    `<p style="font-size:11px;color:#64748B;margin:0 0 8px">${
                        esc(p.desa)
                    } &bull; Kec. ${esc(p.kecamatan)}</p>` +
                    (p.alamat
                        ? `<p style="font-size:11px;margin:0 0 8px">${esc(
                              p.alamat,
                          )}</p>`
                        : "") +
                    `<div style="display:inline-flex;align-items:center;gap:6px;padding:4px 8px;background:${warnaKriteria}15;border:1px solid ${warnaKriteria}40;border-radius:6px;margin:0 0 10px">` +
                    `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${warnaKriteria}"></span>` +
                    `<span style="font-size:11px;font-weight:700;color:${warnaKriteria}">${labelKriteria}</span>` +
                    `</div>` +
                    (stunting > 0
                        ? `<div style="display:inline-flex;align-items:center;gap:6px;padding:4px 8px;background:${WARNA_STUNTING}15;border:1px solid ${WARNA_STUNTING}40;border-radius:6px;margin:0 0 10px">` +
                          `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${WARNA_STUNTING}"></span>` +
                          `<span style="font-size:11px;font-weight:700;color:${WARNA_STUNTING}">Stunting: ${stunting} balita</span>` +
                          `</div>`
                        : "") +
                    (bumil > 0
                        ? `<div style="display:inline-flex;align-items:center;gap:6px;padding:4px 8px;background:${WARNA_BUMIL}15;border:1px solid ${WARNA_BUMIL}40;border-radius:6px;margin:0 0 10px">` +
                          `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${WARNA_BUMIL}"></span>` +
                          `<span style="font-size:11px;font-weight:700;color:${WARNA_BUMIL}">Bumil: ${bumil} ibu</span>` +
                          `</div>`
                        : "") +
                    `<div><a href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}" target="_blank" rel="noopener" style="font-size:11px;font-weight:700;color:#0072BC;text-decoration:none">Buka di Google Maps →</a></div>` +
                    `</div>`,
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
    const [stunting, setStunting] = useState(filters.stunting || "");
    const [bumil, setBumil] = useState(filters.bumil || "");
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
                        stunting: stunting || undefined,
                        bumil: bumil || undefined,
                    },
                    headers: { Accept: "application/json" },
                })
                .then((res) => {
                    if (res.data && Array.isArray(res.data.pins)) {
                        setLocalPins(res.data.pins);
                    }
                })
                .catch((err) =>
                    console.error("Gagal memuat pin peta:", err),
                )
                .finally(() => setIsLoading(false));
        }, 350);
        return () => clearTimeout(timeout);
    }, [kecamatan, desa, kriteria, stunting, bumil]);

    const handleReset = () => {
        setKecamatan("");
        setDesa("");
        setKriteria("");
        setStunting("");
        setBumil("");
    };

    const hasFilter =
        Boolean(kecamatan) || Boolean(desa) || Boolean(kriteria) || Boolean(stunting) || Boolean(bumil);

    // ─── Stats pakai key asli dari controller (sehat, kurang_sehat) ─
    //     Cuma LABEL yang diubah — data tetap dari backend.
    const cards = [
        { label: "Total Pin", count: stats?.total ?? 0, dot: "#0072BC" },
        {
            label: "Rumah Layak Huni",
            count: stats?.sehat ?? 0,
            dot: "#16A34A",
        },
        {
            label: "Rumah Tidak Layak Huni",
            count: stats?.kurang_sehat ?? 0,
            dot: "#DC2626",
        },
        {
            label: "Ada Stunting",
            count: stats?.stunting ?? 0,
            dot: "#F59E0B",
        },
        {
            label: "Ada Bumil",
            count: stats?.bumil ?? 0,
            dot: "#EC4899",
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
                        Rumah Layak Huni, merah Rumah Tidak Layak Huni,
                        oranye ada balita stunting, pink ada bumil
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
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
                <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 space-y-4">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                                Wilayah
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 min-w-0">
                                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                        Kecamatan
                                    </label>
                                    <select
                                        value={kecamatan}
                                        onChange={(e) => {
                                            setKecamatan(e.target.value);
                                            setDesa("");
                                        }}
                                        className={`${selectClass} w-full`}
                                    >
                                        <option value="">Semua Kecamatan</option>
                                        {kecamatanList.map((k) => (
                                            <option key={k} value={k}>
                                                {k}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                        Desa
                                    </label>
                                    <select
                                        value={desa}
                                        onChange={(e) => setDesa(e.target.value)}
                                        disabled={!kecamatan}
                                        className={`${selectClass} w-full disabled:opacity-50`}
                                    >
                                        <option value="">
                                            {kecamatan
                                                ? "Semua Desa"
                                                : "Pilih kecamatan dulu"}
                                        </option>
                                        {desaOptions.map((d) => (
                                            <option key={d} value={d}>
                                                {d}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                                Kondisi Rumah
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 min-w-0">
                                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                        Kriteria
                                    </label>
                                    <select
                                        value={kriteria}
                                        onChange={(e) => setKriteria(e.target.value)}
                                        className={`${selectClass} w-full`}
                                    >
                                        <option value="">Semua Kriteria</option>
                                        {/* value = nilai DB, label = tampilan */}
                                        <option value="Sehat">Rumah Layak Huni</option>
                                        <option value="Kurang Sehat">
                                            Rumah Tidak Layak Huni
                                        </option>
                                    </select>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                        Stunting
                                    </label>
                                    <select
                                        value={stunting}
                                        onChange={(e) => setStunting(e.target.value)}
                                        className={`${selectClass} w-full`}
                                    >
                                        <option value="">Semua Stunting</option>
                                        <option value="ada">Ada Stunting</option>
                                        <option value="tidak">Tanpa Stunting</option>
                                    </select>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                        Bumil
                                    </label>
                                    <select
                                        value={bumil}
                                        onChange={(e) => setBumil(e.target.value)}
                                        className={`${selectClass} w-full`}
                                    >
                                        <option value="">Semua Bumil</option>
                                        <option value="ada">Ada Bumil</option>
                                        <option value="tidak">Tanpa Bumil</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {hasFilter && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shrink-0"
                            >
                                <RotateCcw size={15} />
                                Reset filter
                            </button>
                        )}
                        <p className="text-xs text-slate-400 sm:ml-auto">
                            {localPins.length} pin tampil
                            {isLoading ? " (memuat…)" : ""}
                        </p>
                    </div>
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

                {/* Legend — label baru, warna sama + oranye stunting */}
                <div className="px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                        Rumah Layak Huni ({stats?.sehat ?? 0})
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                        Rumah Tidak Layak Huni ({stats?.kurang_sehat ?? 0})
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                        Ada Stunting ({stats?.stunting ?? 0})
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#EC4899]" />
                        Ada Bumil ({stats?.bumil ?? 0})
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#64748B]" />
                        Belum diisi (
                        {Math.max(
                            0,
                            (stats?.total ?? 0) -
                                (stats?.sehat ?? 0) -
                                (stats?.kurang_sehat ?? 0)
                        )}
                        )
                    </span>
                </div>
            </Card>
        </MainLayout>
    );
}
