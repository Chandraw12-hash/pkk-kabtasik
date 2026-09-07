import React from "react";
import MainLayout from "@/Layouts/MainLayout";
import StatCard from "@/Components/UI/SatistikCard";
import Card from "@/Components/UI/Card";
import ChartLine from "@/Components/Data/Charts/ChartLine";
import ChartBar from "@/Components/Data/Charts/ChartBar";
import ChartPie from "@/Components/Data/Charts/ChartPie";
import { Head } from "@inertiajs/react";
import {
    FileText,
    Clock,
    AlertCircle,
    Calendar,
    Download,
    ShieldCheck,
    Activity,
    UserCheck,
    Image,
    Newspaper,
    TrendingUp,
    PieChart,
    Users,
} from "lucide-react";

interface Stats {
    totalKader: number;
    kaderAktif: number;
    totalDataPokja: number;
    totalLaporan: number;
    totalEvidenMasuk: number;
    laporanPending: number;
    laporanApproved: number;
    laporanRejected: number;
    laporanReviewed: number;
    totalGaleri: number;
    totalBerita: number;
    totalAgenda: number;
    totalInfografis: number;
    totalSurvey: number;
    surveyPublished: number;
    verifikasiPersentase: number;
}

interface DashboardProps {
    stats: Stats;
    lineData: Array<{ name: string; uploaded: number; verified: number }>;
    barData: Array<{ name: string; doc: number }>;
    pieData: Array<{ name: string; value: number; color: string }>;
    activities: Array<{ pokja: string; action: string; time: string }>;
}

export default function Dashboard({
    stats,
    lineData = [],
    barData = [],
    pieData = [],
    activities = [],
}: DashboardProps) {
    // Hitung total verifikasi untuk persentase
    const totalVerifikasi = stats.laporanApproved + stats.laporanPending + stats.laporanRejected + stats.laporanReviewed;
    const validPercentage = totalVerifikasi > 0 ? Math.round((stats.laporanApproved / totalVerifikasi) * 100) : 0;

    return (
        <MainLayout>
            <Head title="Dashboard PKK Kabupaten Tasikmalaya" />

            {/* ─── HEADER ─── */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            Sistem Informasi TP PKK
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500 font-medium">
                            Kabupaten Tasikmalaya
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Dashboard Administrator
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Monitoring program kerja dan rekapitulasi data PKK Kabupaten Tasikmalaya.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600">
                        <Calendar size={15} className="text-slate-400" />
                        <span>Tahun 2026</span>
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
                        <Download size={16} />
                        Unduh Rekap
                    </button>
                </div>
            </div>

            {/* ─── STATISTIK UTAMA ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Total Kader Aktif"
                    value={stats.kaderAktif.toLocaleString()}
                    icon={UserCheck}
                    color="bg-emerald-600"
                    className="border-l-4 border-emerald-600"
                    textColor="white"
                    description={`dari ${stats.totalKader} terdaftar`}
                    period="Tahun 2026"
                />
                <StatCard
                    title="Kegiatan Dilaporkan"
                    value={stats.totalLaporan.toLocaleString()}
                    icon={FileText}
                    color="bg-blue-600"
                    className="border-l-4 border-blue-600"
                    textColor="white"
                    description="Total Eviden Masuk"
                    period="Keseluruhan"
                />
                <StatCard
                    title="Menunggu Validasi"
                    value={stats.laporanPending.toLocaleString()}
                    icon={Clock}
                    color="bg-amber-500"
                    className="border-l-4 border-amber-500"
                    textColor="white"
                    description="Perlu Pengecekan"
                    period="Status Pending"
                />
                <StatCard
                    title="Perlu Revisi"
                    value={(stats.laporanRejected + stats.laporanReviewed).toLocaleString()}
                    icon={AlertCircle}
                    color="bg-rose-500"
                    className="border-l-4 border-rose-500"
                    textColor="white"
                    description="Butuh Perbaikan"
                    period="Ditolak/Revisi"
                />
            </div>

            {/* ─── VERIFIKASI ─── */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-teal-50 rounded-xl">
                            <ShieldCheck size={20} className="text-teal-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-800">
                                Verifikasi Eviden Kegiatan PKK
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Sebanyak <strong className="text-teal-600">{validPercentage}%</strong> dari total laporan kegiatan telah divalidasi.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-xs text-slate-400">Terverifikasi</p>
                            <p className="text-lg font-bold text-emerald-600">
                                {stats.laporanApproved}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-400">Pending</p>
                            <p className="text-lg font-bold text-amber-500">
                                {stats.laporanPending}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-400">Revisi/Ditolak</p>
                            <p className="text-lg font-bold text-rose-500">
                                {stats.laporanRejected + stats.laporanReviewed}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-3 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${validPercentage}%` }}
                    />
                </div>
            </div>

            {/* ─── GRAFIK ─── */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <div className="p-6 pb-2 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-slate-800 text-base">
                                    Tren Pelaporan Kegiatan
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Perbandingan laporan masuk vs terverifikasi
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg">
                                <Activity size={14} /> Real-time
                            </span>
                        </div>
                        <div className="p-2 pt-0">
                            <ChartLine
                                data={lineData}
                                xKey="name"
                                series={[
                                    { key: "uploaded", color: "#6366f1", name: "Dilaporkan" },
                                    { key: "verified", color: "#10b981", name: "Terverifikasi" },
                                ]}
                                height={330}
                            />
                        </div>
                    </Card>

                    {/* ─── AKTIVITAS ─── */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-bold text-slate-800 text-base">
                                    Aktivitas Terakhir
                                </h3>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                                    Live Log
                                </span>
                            </div>
                            <div className="space-y-5">
                                {activities.length > 0 ? (
                                    activities.map((act, i) => (
                                        <div key={i} className="flex gap-3.5 relative">
                                            {i !== activities.length - 1 && (
                                                <div className="absolute left-[9px] top-7 bottom-[-22px] w-0.5 bg-slate-100"></div>
                                            )}
                                            <div className="w-5 h-5 mt-0.5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 z-10">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold text-slate-700 truncate">
                                                    {act.pokja}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                                    {act.action}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-1">
                                                    {act.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-400 text-center py-6">
                                        Belum ada aktivitas terbaru.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── ROW 2 ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <div className="p-6 pb-2">
                            <h3 className="font-bold text-slate-800 text-base">
                                Statistik Laporan per Pokja & Sekretariat
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Akumulasi dokumen dari tiap bidang TP PKK
                            </p>
                        </div>
                        <div className="p-2 pt-0">
                            <ChartBar
                                data={barData}
                                xKey="name"
                                series={[{ key: "doc", color: "#059669", name: "Total Laporan" }]}
                                height={330}
                            />
                        </div>
                    </Card>

                    <Card>
                        <div className="p-6 pb-2">
                            <h3 className="font-bold text-slate-800 text-base">
                                Status Verifikasi
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Proporsi status dokumen laporan
                            </p>
                        </div>
                        <div className="p-2 pt-0">
                            <ChartPie data={pieData} height={330} />
                        </div>
                    </Card>
                </div>
            </div>

            {/* ─── KONTEN ─── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <StatCard
                    title="Galeri"
                    value={stats.totalGaleri.toLocaleString()}
                    icon={Image}
                    color="bg-purple-600"
                    className="border-l-4 border-purple-600"
                    textColor="white"
                    description="Foto Kegiatan"
                />
                <StatCard
                    title="Berita"
                    value={stats.totalBerita.toLocaleString()}
                    icon={Newspaper}
                    color="bg-indigo-600"
                    className="border-l-4 border-indigo-600"
                    textColor="white"
                    description="Informasi Terkini"
                />
                <StatCard
                    title="Agenda"
                    value={stats.totalAgenda.toLocaleString()}
                    icon={Calendar}
                    color="bg-teal-600"
                    className="border-l-4 border-teal-600"
                    textColor="white"
                    description="Jadwal Kegiatan"
                />
                <StatCard
                    title="Infografis"
                    value={stats.totalInfografis.toLocaleString()}
                    icon={PieChart}
                    color="bg-orange-500"
                    className="border-l-4 border-orange-500"
                    textColor="white"
                    description="Data Visual"
                />
            </div>

            {/* ─── SURVEY ─── */}
            <div className="mt-4 bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <TrendingUp size={18} className="text-slate-500" />
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Survey Kepuasan</p>
                            <p className="text-xs text-slate-400">
                                {stats.surveyPublished} dari {stats.totalSurvey} respon dipublikasikan
                            </p>
                        </div>
                    </div>
                    <span className="text-sm font-medium text-emerald-600">
                        {stats.totalSurvey > 0 ? Math.round((stats.surveyPublished / stats.totalSurvey) * 100) : 0}%
                    </span>
                </div>
            </div>
        </MainLayout>
    );
}
