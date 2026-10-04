import { Head, Link } from "@inertiajs/react";
import { Baby, BookOpen, CheckCircle2, Clock3, FileText, Home, Sprout, Users } from "lucide-react";
import DasawismaLayout from "@/Components/Layout/DasawismaLayout";
import Toast from "@/Components/UI/Toast";
import StatsCard from "@/Components/Dasawisma/StatsCard";

interface DashboardProps {
    user: {
        name: string;
        username: string;
        kecamatan: string | null;
        desa: string | null;
    };
    stats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    };
    reports: {
        total: number;
        pending: number;
    };
    modules: Array<{
        label: string;
        href: string;
        count: number;
    }>;
    notifications: Array<{
        id: string;
        message: string;
        url: string;
        created_at: string | null;
    }>;
}

const moduleIcons = [Users, Home, BookOpen, FileText, Sprout, Home, FileText, Baby];

export default function Dashboard({ user, stats, reports, modules, notifications }: DashboardProps) {
    const location = [user.desa, user.kecamatan].filter(Boolean).join(", ");

    return (
        <DasawismaLayout>
            <Head title="Dashboard Dasawisma" />
            <Toast />
            <main className="mx-auto w-full max-w-[1600px] space-y-7 p-4 font-['Poppins',_sans-serif] sm:p-6 lg:p-8">
                <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <nav className="text-xs font-medium text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">Dasawisma <span className="mx-2">/</span> Dashboard</nav>
                        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Selamat datang, {user.name}</h1>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{location || "Ringkasan data Dasa Wisma"} · Pantau pengajuan dan data wilayah dari satu tempat.</p>
                    </div>
                    <Link href="/dasawisma/daftar-warga" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">Buka data warga</Link>
                </header>

                <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Ringkasan seluruh data">
                    <StatsCard label="Total data Dasa Wisma" value={stats.total} icon={FileText} />
                    <StatsCard label="Menunggu persetujuan" value={stats.pending} icon={Clock3} tone="amber" />
                    <StatsCard label="Sudah disetujui" value={stats.approved} icon={CheckCircle2} tone="green" />
                    <StatsCard label="Perlu diperbaiki" value={stats.rejected} icon={BookOpen} tone="rose" />
                </section>

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="space-y-4">
                        <div className="flex items-end justify-between gap-3">
                            <div><h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Modul data</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Pilih kelompok data yang akan dikelola.</p></div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {modules.map((module, index) => {
                                const Icon = moduleIcons[index] ?? FileText;
                                return (
                                    <Link key={module.href} href={module.href} className="group flex min-h-28 items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-teal-300 hover:bg-teal-50/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-800 dark:hover:bg-teal-950/20">
                                        <span className="flex min-w-0 items-center gap-4">
                                            <span className="rounded-xl bg-teal-50 p-3 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"><Icon size={20} aria-hidden="true" /></span>
                                            <span className="min-w-0"><span className="block font-semibold text-slate-900 dark:text-slate-100">{module.label}</span><span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">{module.count.toLocaleString("id-ID")} data</span></span>
                                        </span>
                                        <span className="text-slate-400 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <span className="inline-flex rounded-xl bg-teal-50 p-3 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"><Home size={20} aria-hidden="true" /></span>
                        <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">Alur persetujuan</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Data baru berstatus menunggu. Kecamatan dapat menyetujui atau mengirim catatan perbaikan; data yang ditolak tetap tersimpan dan bisa diajukan ulang.</p>
                        <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Laporan kegiatan</p>
                            <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{reports.total.toLocaleString("id-ID")} <span className="text-sm font-normal text-slate-500">laporan</span></p>
                            <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">{reports.pending.toLocaleString("id-ID")} menunggu pemeriksaan</p>
                        </div>
                    </aside>
                </section>

                {notifications.length > 0 && (
                    <section className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5 dark:border-teal-900 dark:bg-teal-950/30" aria-label="Notifikasi belum dibaca">
                        <h2 className="text-base font-semibold text-teal-950 dark:text-teal-100">Pembaruan terbaru</h2>
                        <ul className="mt-2 divide-y divide-teal-200/70 dark:divide-teal-900">
                            {notifications.map((notification) => (
                                <li key={notification.id} className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                                    <Link href={notification.url} className="font-medium text-teal-950 hover:underline dark:text-teal-100">{notification.message}</Link>
                                    <span className="text-xs text-teal-800/70 dark:text-teal-300">{notification.created_at ?? "Baru saja"}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </main>
        </DasawismaLayout>
    );
}
