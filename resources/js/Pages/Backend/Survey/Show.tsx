import React from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import Badge from "@/Components/UI/Badge";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Calendar, Mail, User, MessageSquare, Star, MapPin } from "lucide-react";

interface Survey {
    id: number;
    nama: string | null;
    email: string | null;
    rating: number;
    saran: string | null;
    status: string;
    ip_address: string | null;
    created_at: string;
    rating_label: string;
    rating_color: string;
}

interface Props {
    survey: Survey;
}

const getStatusBadge = (status: string) => {
    if (status === "active") {
        return <Badge type="success">Aktif</Badge>;
    }
    return <Badge type="default">Nonaktif</Badge>;
};

const getRatingStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
};

export default function Show({ survey }: Props) {
    return (
        <MainLayout>
            <Head title={`Survey - ${survey.nama || 'Anonim'}`} />

            <div className="flex items-center gap-3 mb-8">
                <Link
                    href={route("be.survey.index")}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all dark:hover:bg-slate-700"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Detail Survey
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Lihat detail hasil survey kepuasan masyarakat
                    </p>
                </div>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                {survey.nama || "Anonim"}
                            </h2>
                            <p className="text-sm text-slate-500">
                                {getStatusBadge(survey.status)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-yellow-500">
                                {getRatingStars(survey.rating)}
                            </p>
                            <p className="text-sm text-slate-500">{survey.rating_label}</p>
                        </div>
                    </div>

                    {/* Detail */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {survey.email && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <Mail size={18} className="text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-400">Email</p>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {survey.email}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <Calendar size={18} className="text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-400">Tanggal</p>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {new Date(survey.created_at).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>

                        {survey.ip_address && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <MapPin size={18} className="text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-400">IP Address</p>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {survey.ip_address}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <Star size={18} className="text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-400">Rating</p>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {survey.rating} / 5 - {survey.rating_label}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Saran */}
                    {survey.saran && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <MessageSquare size={18} className="text-slate-400" />
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Saran & Kritik
                                </p>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                                {survey.saran}
                            </p>
                        </div>
                    )}

                    {/* Tombol kembali */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                        <Link
                            href={route("be.survey.index")}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            </Card>
        </MainLayout>
    );
}
