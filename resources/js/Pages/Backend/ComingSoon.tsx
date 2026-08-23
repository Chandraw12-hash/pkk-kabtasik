import React from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Construction, ArrowLeft, LayoutDashboard } from "lucide-react";

interface Props {
    title?: string;
    description?: string;
}

export default function ComingSoon({
    title = "Fitur Segera Hadir",
    description = "Modul ini sedang dalam pengembangan. Silakan kembali ke dashboard.",
}: Props) {
    return (
        <MainLayout>
            <Head title={title} />

            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
                        <Construction
                            size={28}
                            className="text-teal-600 dark:text-teal-400"
                        />
                    </div>

                    <p className="text-xs font-semibold tracking-wider uppercase text-teal-600 mb-2">
                        Dalam pengembangan
                    </p>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                        {title}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                        {description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href={route("be.dashboard")}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors"
                        >
                            <LayoutDashboard size={16} />
                            Ke Dashboard
                        </Link>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Kembali
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
