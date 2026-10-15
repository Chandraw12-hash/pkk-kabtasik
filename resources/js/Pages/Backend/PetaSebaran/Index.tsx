import React, { useEffect, useMemo, useRef, useState } from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import {
    RotateCcw,
    MapPin,
    Home,
    AlertTriangle,
    Baby,
    Heart,
    Loader2,
    Info,
} from "lucide-react";
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

// ─── Kabupaten Tasikmalaya (batas persegi perkiraan) ──────────
// Kalau punya GeoJSON batas resmi, bisa diganti nanti.
const TASIK_BOUNDS = L.latLngBounds([-7.95, 107.75], [-7.05, 108.45]);
const TASIK_CENTER: [number, number] = [-7.5, 108.1];

// ─── Warna — pakai nilai DB "Sehat" / "Kurang Sehat" ──────
const WARNA: Record<string, string> = {
    Sehat: "#16A34A",
    "Kurang Sehat": "#DC2626",
};
const WARNA_STUNTING = "#D97706";
const WARNA_BUMIL = "#DB2777";
const WARNA_NETRAL = "#64748B";

// ─── Label tampilan ───
const LABEL: Record<string, string> = {
    Sehat: "Rumah Layak Huni",
    "Kurang Sehat": "Rumah Tidak Layak Huni",
};

const iconCache = new Map<string, L.DivIcon>();
const dotIcon = (kriteria: string | null, stunting = 0) => {
    const warna =
        stunting > 0 ? WARNA_STUNTING : WARNA[kriteria ?? ""] || WARNA_NETRAL;
    const cached = iconCache.get(warna);
    if (cached) return cached;
    // Pin berbentuk tetesan dengan ikon rumah putih di dalamnya.
    // Ujung bawah pin = titik koordinat sebenarnya.
    const icon = L.divIcon({
        className: "",
        html:
            `<svg width="34" height="42" viewBox="0 0 34 42" xmlns="http://www.w3.org/2000/svg" style="display:block;filter:drop-shadow(0 2px 3px rgba(15,23,42,.4))">` +
            `<path d="M17 40.5C17 40.5 3 26.5 3 16.5a14 14 0 1 1 28 0C31 26.5 17 40.5 17 40.5z" fill="${warna}" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>` +
            `<g transform="translate(9.8 9.3) scale(0.6)"><path d="M12 3 2 12h3v8h5v-5h4v5h5v-8h3z" fill="#fff"/></g>` +
            `</svg>`,
        iconSize: [34, 42],
        iconAnchor: [17, 41],
        popupAnchor: [0, -38],
    });
    iconCache.set(warna, icon);
    return icon;
};

const esc = (s: string | null | undefined) =>
    (s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

const nilai = (s: string | null | undefined) =>
    s && s.trim() ? esc(s) : `<span class="pp-empty">Belum diisi</span>`;

// ─── Isi popup ────────────────────────────────────────────────
const popupHtml = (p: Pin, sama = 0) => {
    const stunting = p.stunting ?? 0;
    const bumil = p.bumil ?? 0;
    const warna = WARNA[p.kriteria ?? ""] || WARNA_NETRAL;
    const label = p.kriteria ? LABEL[p.kriteria] || p.kriteria : "Kondisi belum diisi";

    const baris = (k: string, v: string) =>
        `<div class="pp-row"><dt>${k}</dt><dd>${v}</dd></div>`;

    return (
        `<div class="pp">` +
        `<div class="pp-head" style="background:${warna}12;border-bottom:1px solid ${warna}33">` +
        `<p class="pp-title">${p.nama ? esc(p.nama) : "Tanpa nama"}</p>` +
        `<span class="pp-badge" style="background:${warna};">${esc(label)}</span>` +
        `</div>` +
        `<dl class="pp-list">` +
        baris("Kecamatan", nilai(p.kecamatan)) +
        baris("Desa", nilai(p.desa)) +
        baris("Alamat", nilai(p.alamat)) +
        (p.status ? baris("Status data", esc(p.status)) : "") +
        baris(
            "Koordinat",
            `<span class="pp-mono">${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}</span>`,
        ) +
        `</dl>` +
        (sama > 0
            ? `<p class="pp-warn">${sama} rumah lain memakai titik koordinat yang sama. Periksa kembali lokasi GPS-nya.</p>`
            : "") +
        `<div class="pp-health">` +
        `<div class="pp-tile" style="${
            stunting > 0
                ? `background:${WARNA_STUNTING}14;border-color:${WARNA_STUNTING}55`
                : ""
        }">` +
        `<span class="pp-tile-num" style="color:${
            stunting > 0 ? WARNA_STUNTING : "#94A3B8"
        }">${stunting}</span>` +
        `<span class="pp-tile-lbl">Balita stunting</span></div>` +
        `<div class="pp-tile" style="${
            bumil > 0
                ? `background:${WARNA_BUMIL}14;border-color:${WARNA_BUMIL}55`
                : ""
        }">` +
        `<span class="pp-tile-num" style="color:${
            bumil > 0 ? WARNA_BUMIL : "#94A3B8"
        }">${bumil}</span>` +
        `<span class="pp-tile-lbl">Ibu hamil</span></div>` +
        `</div>` +
        `<a class="pp-btn" href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}" target="_blank" rel="noopener">Buka di Google Maps</a>` +
        `</div>`
    );
};

const POPUP_CSS = `
.leaflet-popup-content-wrapper{padding:0;border-radius:14px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,.22)}
.leaflet-popup-content{margin:0!important;width:290px!important;font-family:inherit}
.leaflet-popup-close-button{top:8px!important;right:8px!important;color:#64748B!important}
.pp{color:#0F172A}
.pp-head{padding:12px 36px 10px 16px}
.pp-title{margin:0 0 6px;font-size:15px;font-weight:700;line-height:1.3}
.pp-badge{display:inline-block;padding:3px 10px;border-radius:999px;color:#fff;font-size:11px;font-weight:600}
.pp-list{margin:0;padding:4px 16px}
.pp-row{display:grid;grid-template-columns:76px 1fr;gap:8px;padding:5px 0;border-bottom:1px solid #F1F5F9;font-size:12px;line-height:1.4}
.pp-row:last-child{border-bottom:0}
.pp-row dt{margin:0;color:#64748B}
.pp-row dd{margin:0;color:#0F172A;font-weight:500;word-break:break-word}
.pp-empty{color:#94A3B8;font-weight:400;font-style:italic}
.pp-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}
.pp-health{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:6px 16px 0}
.pp-tile{display:flex;align-items:center;justify-content:center;gap:8px;padding:7px 6px;border:1px solid #E2E8F0;border-radius:10px;background:#F8FAFC}
.pp-tile-num{font-size:18px;font-weight:700;line-height:1}
.pp-tile-lbl{font-size:11px;color:#475569;line-height:1.2}
.pp-warn{margin:4px 16px 0;padding:6px 9px;border-radius:8px;background:#FFFBEB;border:1px solid #FDE68A;color:#92400E;font-size:11px;line-height:1.4}
.pp-btn{display:block;margin:10px 16px 14px;padding:8px 12px;border-radius:8px;background:#0072BC;color:#fff!important;font-size:12px;font-weight:600;text-align:center;text-decoration:none}
.pp-btn:hover{background:#005F9B}
.cl{display:flex;align-items:center;justify-content:center;border-radius:50%;background:#0F766E;color:#fff;font-weight:700;border:3px solid #fff;box-shadow:0 0 0 2px #0F766E55,0 2px 8px rgba(15,23,42,.35)}
.leaflet-control-fokus a{display:flex;align-items:center;justify-content:center;width:34px;height:34px;color:#334155;cursor:pointer}
`;

// Cluster hanya dipakai saat peta masih menampilkan area luas.
// Mulai zoom ini ke atas, setiap rumah tampil langsung sebagai ikon rumah.
const ZOOM_IKON_RUMAH = 16;

const clusterIcon = (cluster: L.MarkerCluster) => {
    const n = cluster.getChildCount();
    const size = n < 10 ? 36 : n < 100 ? 42 : n < 1000 ? 50 : 58;
    return L.divIcon({
        html: `<div class="cl" style="width:${size}px;height:${size}px;font-size:${
            n < 1000 ? 13 : 12
        }px">${n.toLocaleString("id-ID")}</div>`,
        className: "",
        iconSize: [size, size],
    });
};

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
            maxClusterRadius: 50,
            disableClusteringAtZoom: ZOOM_IKON_RUMAH,
            chunkedLoading: true,
            iconCreateFunction: clusterIcon,
        });

        // Rumah dengan koordinat (hampir) sama disebar melingkar supaya
        // semuanya tetap terlihat. Koordinat asli tetap tampil di popup.
        const buckets = new Map<string, Pin[]>();
        points.forEach((p) => {
            const key = `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`;
            const list = buckets.get(key);
            if (list) list.push(p);
            else buckets.set(key, [p]);
        });

        // Jarak sebaran dihitung untuk zoom 17 (sekitar 30 meter)
        const degPerPx = 360 / (256 * Math.pow(2, 17));
        const markers: L.Marker[] = [];

        buckets.forEach((list) => {
            const total = list.length;
            list.forEach((p, idx) => {
                let lat = p.lat;
                let lng = p.lng;
                if (total > 1) {
                    const radius = Math.max(28, (total * 36) / (2 * Math.PI));
                    const ang = (2 * Math.PI * idx) / total - Math.PI / 2;
                    const cosLat = Math.cos((p.lat * Math.PI) / 180);
                    lat = p.lat - Math.sin(ang) * radius * degPerPx * cosLat;
                    lng = p.lng + Math.cos(ang) * radius * degPerPx;
                }
                const m = L.marker([lat, lng], {
                    icon: dotIcon(p.kriteria, p.stunting ?? 0),
                });
                // Popup dibuat saat diklik saja, bukan untuk semua marker sekaligus
                m.bindPopup(() => popupHtml(p, total - 1), {
                    minWidth: 290,
                    maxWidth: 290,
                    keepInView: true,
                    autoPanPaddingTopLeft: L.point(24, 24),
                    autoPanPaddingBottomRight: L.point(24, 24),
                    offset: L.point(0, -4),
                });
                markers.push(m);
            });
        });

        group.addLayers(markers);
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

// Arahkan peta: ke titik hasil filter, atau ke Kabupaten Tasikmalaya
function ViewController({
    points,
    hasFilter,
}: {
    points: Pin[];
    hasFilter: boolean;
}) {
    const map = useMap();
    useEffect(() => {
        if (hasFilter && points.length > 0) {
            map.fitBounds(
                L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number])),
                { padding: [48, 48], maxZoom: 15 },
            );
        } else if (!hasFilter) {
            map.fitBounds(TASIK_BOUNDS, { padding: [8, 8] });
        }
    }, [map, points, hasFilter]);
    return null;
}

// Tombol "kembali ke Kab. Tasikmalaya"
function FokusControl() {
    const map = useMap();
    useEffect(() => {
        const ctrl = new L.Control({ position: "topleft" });
        ctrl.onAdd = () => {
            const div = L.DomUtil.create(
                "div",
                "leaflet-bar leaflet-control leaflet-control-fokus",
            );
            div.innerHTML = `<a role="button" title="Fokus ke Kabupaten Tasikmalaya" aria-label="Fokus ke Kabupaten Tasikmalaya"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg></a>`;
            L.DomEvent.disableClickPropagation(div);
            div.querySelector("a")!.addEventListener("click", () =>
                map.fitBounds(TASIK_BOUNDS, { padding: [8, 8] }),
            );
            return div;
        };
        ctrl.addTo(map);
        return () => {
            ctrl.remove();
        };
    }, [map]);
    return null;
}

const labelClass =
    "block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5";

const selectClass =
    "w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded-lg py-2.5 px-3 outline-none transition-colors hover:border-slate-300 dark:hover:border-slate-500 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-800";

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
                .catch((err) => console.error("Gagal memuat pin peta:", err))
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
        Boolean(kecamatan) ||
        Boolean(desa) ||
        Boolean(kriteria) ||
        Boolean(stunting) ||
        Boolean(bumil);

    const activeFilterCount = [kecamatan, desa, kriteria, stunting, bumil].filter(
        Boolean,
    ).length;

    // Pin yang koordinatnya jatuh di luar Kab. Tasikmalaya (indikasi salah input GPS)
    const pinLuar = useMemo(
        () =>
            localPins.filter((p) => !TASIK_BOUNDS.contains([p.lat, p.lng])).length,
        [localPins],
    );

    const belumDiisi = Math.max(
        0,
        (stats?.total ?? 0) - (stats?.sehat ?? 0) - (stats?.kurang_sehat ?? 0),
    );

    const cards = [
        { label: "Total pin", count: stats?.total ?? 0, color: "#0072BC", Icon: MapPin },
        { label: "Rumah Layak Huni", count: stats?.sehat ?? 0, color: "#16A34A", Icon: Home },
        {
            label: "Rumah Tidak Layak Huni",
            count: stats?.kurang_sehat ?? 0,
            color: "#DC2626",
            Icon: AlertTriangle,
        },
        { label: "Ada stunting", count: stats?.stunting ?? 0, color: WARNA_STUNTING, Icon: Baby },
        { label: "Ada bumil", count: stats?.bumil ?? 0, color: WARNA_BUMIL, Icon: Heart },
    ];

    const legend = [
        { label: "Rumah Layak Huni", count: stats?.sehat ?? 0, color: "#16A34A" },
        { label: "Rumah Tidak Layak Huni", count: stats?.kurang_sehat ?? 0, color: "#DC2626" },
        { label: "Ada balita stunting", count: stats?.stunting ?? 0, color: WARNA_STUNTING },
        { label: "Belum diisi", count: belumDiisi, color: WARNA_NETRAL },
    ];

    return (
        <MainLayout>
            <Head title="Peta Sebaran Rumah" />
            <style>{POPUP_CSS}</style>

            {/* Header */}
            <div className="mb-6">
                <p className="text-sm font-medium text-teal-700 dark:text-teal-400 mb-1">
                    Kabupaten Tasikmalaya
                </p>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-100">
                    Peta Sebaran Rumah
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                    Titik GPS rumah dari pendataan dasawisma. Pilih kecamatan
                    atau desa untuk memperbesar peta ke wilayah tersebut, lalu
                    klik titik untuk melihat detail rumah.
                </p>
            </div>

            {/* Ringkasan */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
                {cards.map(({ label, count, color, Icon }) => (
                    <div
                        key={label}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5"
                    >
                        <span
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                            style={{ background: `${color}1A`, color }}
                        >
                            <Icon size={20} />
                        </span>
                        <div className="min-w-0">
                            <p className="text-xl font-bold leading-tight text-slate-800 dark:text-slate-100 tabular-nums">
                                {count.toLocaleString("id-ID")}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                                {label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                {/* Filter */}
                <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div>
                            <label className={labelClass}>Kecamatan</label>
                            <select
                                value={kecamatan}
                                onChange={(e) => {
                                    setKecamatan(e.target.value);
                                    setDesa("");
                                }}
                                className={selectClass}
                            >
                                <option value="">Semua kecamatan</option>
                                {kecamatanList.map((k) => (
                                    <option key={k} value={k}>
                                        {k}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Desa</label>
                            <select
                                value={desa}
                                onChange={(e) => setDesa(e.target.value)}
                                disabled={!kecamatan}
                                className={selectClass}
                            >
                                <option value="">
                                    {kecamatan ? "Semua desa" : "Pilih kecamatan dulu"}
                                </option>
                                {desaOptions.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Kondisi rumah</label>
                            <select
                                value={kriteria}
                                onChange={(e) => setKriteria(e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Semua kondisi</option>
                                <option value="Sehat">Rumah Layak Huni</option>
                                <option value="Kurang Sehat">Rumah Tidak Layak Huni</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Stunting</label>
                            <select
                                value={stunting}
                                onChange={(e) => setStunting(e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Semua</option>
                                <option value="ada">Ada stunting</option>
                                <option value="tidak">Tanpa stunting</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Ibu hamil</label>
                            <select
                                value={bumil}
                                onChange={(e) => setBumil(e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Semua</option>
                                <option value="ada">Ada bumil</option>
                                <option value="tidak">Tanpa bumil</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <p className="flex items-center gap-2">
                                {isLoading && (
                                    <Loader2 size={14} className="animate-spin text-teal-600" />
                                )}
                                <span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                                        {localPins.length.toLocaleString("id-ID")}
                                    </span>{" "}
                                    pin ditampilkan
                                    {activeFilterCount > 0 &&
                                        ` dengan ${activeFilterCount} filter aktif`}
                                </span>
                            </p>
                            {pinLuar > 0 && (
                                <p className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 px-2.5 py-1 text-xs text-amber-800 dark:text-amber-300">
                                    <Info size={13} />
                                    {pinLuar} pin di luar wilayah Kab. Tasikmalaya, periksa
                                    koordinatnya
                                </p>
                            )}
                        </div>
                        {hasFilter && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 transition-colors"
                            >
                                <RotateCcw size={15} />
                                Reset filter
                            </button>
                        )}
                    </div>
                </div>

                {/* Peta */}
                <div className="relative">
                    <MapContainer
                        center={TASIK_CENTER}
                        zoom={10}
                        minZoom={8}
                        scrollWheelZoom={true}
                        className="h-[480px] sm:h-[620px] w-full z-0"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <ClusterLayer points={localPins} />
                        <ViewController points={localPins} hasFilter={hasFilter} />
                        <FokusControl />
                    </MapContainer>

                    {isLoading && (
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
                            <div className="flex items-center gap-2 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-md">
                                <Loader2 size={13} className="animate-spin text-teal-600" />
                                Memuat pin…
                            </div>
                        </div>
                    )}

                    {/* Legenda melayang (tablet ke atas) */}
                    <div className="hidden sm:block absolute bottom-6 left-4 z-[1000] rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 shadow-lg px-4 py-3 backdrop-blur">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                            Keterangan
                        </p>
                        <ul className="space-y-1.5">
                            {legend.map((l) => (
                                <li
                                    key={l.label}
                                    className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"
                                >
                                    <span
                                        className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                                        style={{ background: l.color }}
                                    />
                                    <span className="flex-1">{l.label}</span>
                                    <span className="font-semibold tabular-nums text-slate-700 dark:text-slate-200 pl-3">
                                        {l.count.toLocaleString("id-ID")}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-400">
                            Titik oranye menandakan rumah dengan balita stunting
                        </p>
                    </div>

                    {localPins.length === 0 && !isLoading && (
                        <div className="absolute inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-none">
                            <div className="max-w-sm bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-4 flex items-start gap-3 shadow-lg">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400">
                                    <MapPin size={20} />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        Tidak ada pin yang cocok
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        {hasFilter
                                            ? "Ubah atau reset filter untuk melihat titik lain."
                                            : "Pasang titik peta dari form dasawisma agar muncul di sini."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Legenda (mobile) */}
                <div className="sm:hidden px-4 py-3 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {legend.map((l) => (
                        <span key={l.label} className="flex items-center gap-1.5">
                            <span
                                className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                                style={{ background: l.color }}
                            />
                            <span className="flex-1">{l.label}</span>
                            <span className="font-semibold tabular-nums">
                                {l.count.toLocaleString("id-ID")}
                            </span>
                        </span>
                    ))}
                </div>
            </Card>
        </MainLayout>
    );
}
