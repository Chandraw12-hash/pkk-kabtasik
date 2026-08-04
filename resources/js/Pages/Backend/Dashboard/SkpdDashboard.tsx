import React from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link } from "@inertiajs/react";
import Card from "@/Components/UI/Card";
import { FileText, CheckCircle, XCircle, Clock, Plus } from "lucide-react";
import Button from "@/Components/UI/Button";

interface Stats {
    total_eviden: number;
    verifikasi_pending: number;
    verifikasi_valid: number;
    verifikasi_ditolak: number;
}

interface SkpdDashboardProps {
    stats: Stats;
}

export default function SkpdDashboard({ stats }: SkpdDashboardProps) {
    return (
        <MainLayout>
            <Head title="Dashboard SKPD" />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Monitoring status pengajuan eviden
                    </p>
                </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6 flex items-center gap-4 border-l-4 border-l-indigo-500 dark:border-l-indigo-600">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Total Eviden Diupload
                        </p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                            {stats.total_eviden}
                        </h3>
                    </div>
                </Card>

                <Card className="p-6 flex items-center gap-4 border-l-4 border-l-amber-500 dark:border-l-amber-600">
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Menunggu Verifikasi
                        </p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                            {stats.verifikasi_pending}
                        </h3>
                    </div>
                </Card>

                <Card className="p-6 flex items-center gap-4 border-l-4 border-l-emerald-500 dark:border-l-emerald-600">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Sudah Diverifikasi
                        </p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                            {stats.verifikasi_valid}
                        </h3>
                    </div>
                </Card>

                <Card className="p-6 flex items-center gap-4 border-l-4 border-l-rose-500 dark:border-l-rose-600">
                    <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl text-rose-600 dark:text-rose-400">
                        <XCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Ditolak / Perbaikan
                        </p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                            {stats.verifikasi_ditolak}
                        </h3>
                    </div>
                </Card>
            </div>

            {/* Call to action or list */}
            <Card className="p-6">
                <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
                        <FileText size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
                        Kelola Eviden SPBE
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                        Pastikan eviden yang diupload sesuai dengan indikator
                        yang ditentukan. Pantau status verifikasi secara
                        berkala.
                    </p>
                    <Link href={route("be.eviden.index")}>
                        <Button variant="outline">Lihat Semua Eviden</Button>
                    </Link>
                </div>
            </Card>
        </MainLayout>
    );
}
