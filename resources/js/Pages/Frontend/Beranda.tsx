import React from "react";
import { Head } from "@inertiajs/react";
import Navbar from "./Layouts/Navbar";
import Footer from "./Layouts/Footer";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    CheckCircle,
    ChevronRight,
    Download,
    Eye,
    FileText,
    Layers,
    TrendingUp,
} from "lucide-react";

interface Kebijakan {
    id: number;
    judul: string;
    file_path: string;
    deskripsi?: string;
    urutan: number;
}

interface ChartData {
    year: string;
    value: number;
}

interface DomainData {
    id: number;
    title: string;
    nilai: number;
}

interface WelcomeProps {
    kebijakan: Kebijakan[];
    chartData: ChartData[];
    domainData: DomainData[];
    year: number;
    berita?: any[];
    galeri?: any[];
}

const domainStyles = [
    {
        color: "text-blue-600",
        bg: "bg-blue-100",
    },
    {
        color: "text-purple-600",
        bg: "bg-purple-100",
    },
    {
        color: "text-emerald-600",
        bg: "bg-emerald-100",
    },
    {
        color: "text-orange-600",
        bg: "bg-orange-100",
    },
];

export default function Welcome({
    kebijakan,
    chartData,
    domainData,
    year,
}: WelcomeProps) {
    // Merge domain data with styles based on index
    const domains = domainData.map((domain, index) => ({
        ...domain,
        ...domainStyles[index % domainStyles.length],
    }));

    // Get latest value from chartData for the main card, or 0 if empty
    const latestValue =
        chartData.length > 0 ? chartData[chartData.length - 1].value : 0;
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            <Head title="SPBE Kabupaten Tasikmalaya" />

            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Hero Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/70"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-100 text-xs font-bold tracking-wider uppercase mb-6 border border-blue-400/30 backdrop-blur-sm">
                        Sistem Pemerintahan Berbasis Elektronik
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-8">
                        Transformasi Digital <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                            Pemerintahan Modern
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-200 mb-10 leading-relaxed">
                        Mewujudkan tata kelola pemerintahan yang bersih,
                        efektif, transparan, dan akuntabel serta pelayanan
                        publik yang berkualitas dan terpercaya.
                    </p>
                </div>
            </section>

            {/* Stats Overview Section */}
            <section className="py-16 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        {/* Total Index Card */}
                        <div className="lg:col-span-1 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-3xl p-8 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4 text-blue-100">
                                    <TrendingUp size={24} />
                                    <span className="font-semibold tracking-wide uppercase text-sm">
                                        Indeks SPBE Total
                                    </span>
                                </div>
                                <div className="text-7xl font-black mb-2 tracking-tighter">
                                    {latestValue}
                                </div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-sm font-medium backdrop-blur-sm border border-white/10">
                                    <CheckCircle size={14} className="mr-2" />{" "}
                                    Tahun {year}
                                </div>
                                <p className="mt-8 text-blue-100 text-sm opacity-80 leading-relaxed">
                                    Pencapaian Indeks SPBE Kabupaten Tasikmalaya
                                    terus meningkat, mencerminkan komitmen kuat
                                    dalam digitalisasi pelayanan publik.
                                </p>
                            </div>
                        </div>

                        {/* Domain Grid */}
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {domains.map((domain, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-50 hover:bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-lg transition-all duration-300 group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div
                                            className={`p-3 rounded-xl ${domain.bg} ${domain.color}`}
                                        >
                                            <Layers size={24} />
                                        </div>
                                        <span
                                            className={`text-2xl font-bold ${domain.color}`}
                                        >
                                            {domain.nilai}
                                        </span>
                                    </div>
                                    <h3 className="text-slate-800 font-bold text-lg group-hover:text-blue-700 transition-colors">
                                        {domain.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm mt-1">
                                        Indeks Kematangan
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Chart Section */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                Tren Indeks SPBE
                            </h2>
                            <p className="text-slate-600">
                                Perkembangan nilai indeks SPBE dari tahun ke
                                tahun.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
                                <span className="w-2 h-2 rounded-full bg-blue-600"></span>{" "}
                                {chartData.length} Periode Data
                            </div>
                        </div>
                    </div>

                    <div className="bg-white py-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={chartData}
                                    margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="colorValue"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#2563eb"
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#2563eb"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f1f5f9"
                                    />
                                    <XAxis
                                        dataKey="year"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#64748b", fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#64748b", fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1e293b",
                                            borderRadius: "12px",
                                            border: "none",
                                            boxShadow:
                                                "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                            color: "#f8fafc",
                                        }}
                                        itemStyle={{ color: "#f8fafc" }}
                                        cursor={{
                                            stroke: "#cbd5e1",
                                            strokeWidth: 2,
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#2563eb"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </section>

            {/* Kebijakan SPBE Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 skew-x-12 translate-x-32 -z-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-700 text-xs font-bold tracking-wider uppercase mb-4 border border-blue-100">
                            Regulasi & Dasar Hukum
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
                            Kebijakan SPBE
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Kumpulan dokumen peraturan dan kebijakan yang
                            menjadi landasan dalam penyelenggaraan Sistem
                            Pemerintahan Berbasis Elektronik.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {kebijakan && kebijakan.length > 0 ? (
                            kebijakan.map((item) => (
                                <a
                                    key={item.id}
                                    href={`/storage/${item.file_path}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                                            <FileText size={24} />
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                                            {item.judul}
                                        </h3>

                                        <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-grow">
                                            {item.deskripsi ||
                                                "Dokumen Kebijakan SPBE"}
                                        </p>

                                        <div className="flex items-center text-blue-600 font-semibold text-sm mt-auto group-hover:translate-x-1 transition-transform">
                                            <span>Lihat Dokumen</span>
                                            <Eye size={16} className="ml-2" />
                                        </div>
                                    </div>
                                </a>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                                    <FileText size={32} />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-700 mb-1">
                                    Belum ada kebijakan
                                </h3>
                                <p className="text-slate-500 text-sm">
                                    Dokumen kebijakan akan segera ditambahkan.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
