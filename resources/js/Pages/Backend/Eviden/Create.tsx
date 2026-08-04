import React, { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import Button from "@/Components/UI/Button";
import TextInput from "@/Components/Form/TextInput";
import SelectInput from "@/Components/Form/SelectInput";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import { ArrowLeft, Save, Upload, Info } from "lucide-react";
import axios from "axios";

interface CreateProps {
    indikators: { id: number; nama_indikator: string }[];
    skpds: { id: number; nama_skpd: string }[];
}

interface IndikatorDetail {
    indikator_id: number;
    nama_indikator: string;
    deskripsi: {
        tingkat: string;
        kriteria_kenaikan_tingkat: string;
    }[];
}

export default function Create({ indikators, skpds }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        indikator_id: "",
        skpd_id: "",
        tahun: "2026",
        files: [] as File[],
    });

    const [indikatorDetail, setIndikatorDetail] =
        useState<IndikatorDetail | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const { auth } = usePage().props as any;
    const isAdmin = auth.roles && auth.roles.includes("admin");

    useEffect(() => {
        if (!isAdmin && auth.user && auth.user.skpd_id) {
            setData("skpd_id", auth.user.skpd_id.toString());
        }
    }, [auth.user, isAdmin]);

    useEffect(() => {
        if (data.indikator_id) {
            setIsLoadingDetail(true);
            // ... existing axios code
            axios
                .get(route("be.api.indikator.detail", data.indikator_id))
                .then((res) => {
                    setIndikatorDetail(res.data.data);
                })
                .catch((err) => {
                    console.error("Failed to fetch indikator detail", err);
                    setIndikatorDetail(null);
                })
                .finally(() => {
                    setIsLoadingDetail(false);
                });
        } else {
            setIndikatorDetail(null);
        }
    }, [data.indikator_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("be.eviden.store"));
    };

    return (
        <>
            <Head title="Tambah Data Eviden" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        Tambah Data Eviden
                    </h1>
                    <p className="text-slate-500 text-sm dark:text-slate-400">
                        Upload bukti dukung SPBE baru
                    </p>
                </div>
                <Link href={route("be.eviden.index")}>
                    <Button variant="secondary">Kembali</Button>
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="w-full lg:w-2/3">
                    <Card className="w-full p-6 dark:bg-slate-800 dark:border-slate-700">
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* SKPD */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3 dark:text-slate-300">
                                    Pilih SKPD{" "}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <SelectInput
                                    value={data.skpd_id}
                                    onChange={(e) =>
                                        setData("skpd_id", e.target.value)
                                    }
                                    error={errors.skpd_id}
                                    disabled={!isAdmin}
                                >
                                    <option value="">-- Pilih SKPD --</option>
                                    {skpds.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nama_skpd}
                                        </option>
                                    ))}
                                </SelectInput>
                            </div>

                            {/* Indikator */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3 dark:text-slate-300">
                                    Pilih Indikator{" "}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <SelectInput
                                    value={data.indikator_id}
                                    onChange={(e) =>
                                        setData("indikator_id", e.target.value)
                                    }
                                    error={errors.indikator_id}
                                >
                                    <option value="">
                                        -- Pilih Indikator --
                                    </option>
                                    {indikators.map((ind) => (
                                        <option key={ind.id} value={ind.id}>
                                            {ind.nama_indikator}
                                        </option>
                                    ))}
                                </SelectInput>
                            </div>

                            {/* Tahun Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3 dark:text-slate-300">
                                    Tahun{" "}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <SelectInput
                                    value={data.tahun}
                                    onChange={(e) =>
                                        setData("tahun", e.target.value)
                                    }
                                    error={errors.tahun}
                                >
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                </SelectInput>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3 dark:text-slate-300">
                                    Upload Bukti Dukung
                                </label>
                                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) =>
                                            setData(
                                                "files",
                                                Array.from(
                                                    e.target.files || [],
                                                ),
                                            )
                                        }
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 pointer-events-none">
                                        <div className="p-3 bg-indigo-50 dark:bg-slate-700 rounded-full mb-3 text-indigo-600 dark:text-indigo-400">
                                            <Upload size={24} />
                                        </div>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            Klik untuk upload file
                                        </span>
                                        <span className="text-sm mt-1">
                                            atau drag and drop file di sini
                                        </span>
                                        <span className="text-xs text-slate-400 mt-2">
                                            Format: PDF, JPG, PNG, DOC (Max
                                            10MB/file)
                                        </span>
                                    </div>
                                </div>

                                {/* File Preview List */}
                                {data.files.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            File yang dipilih:
                                        </p>
                                        <ul className="text-sm text-slate-500 space-y-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                            {data.files.map((file, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center gap-2"
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                                    {file.name} (
                                                    {(file.size / 1024).toFixed(
                                                        0,
                                                    )}{" "}
                                                    KB)
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {errors.files && (
                                    <div className="text-rose-500 text-sm mt-1">
                                        {errors.files}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-4 border-slate-100 dark:border-slate-700">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={processing}
                                    className="w-full md:w-auto"
                                >
                                    {processing
                                        ? "Menyimpan Data"
                                        : "Simpan Data Eviden"}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                {/* Info Detail Indikator - Right Sidebar */}
                <div className="w-full lg:w-1/3">
                    <Card className="w-full h-full p-6 dark:bg-slate-800 dark:border-slate-700 flex flex-col">
                        <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400">
                            <Info size={20} />
                            <h3 className="font-semibold text-lg">
                                Informasi Indikator
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {isLoadingDetail ? (
                                <div className="flex flex-col items-center justify-center h-40 text-slate-400 animate-pulse">
                                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                    <p>Memuat informasi...</p>
                                </div>
                            ) : indikatorDetail ? (
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            Nama Indikator
                                        </span>
                                        <p className="text-slate-700 dark:text-slate-300 font-medium text-sm mt-1">
                                            {indikatorDetail.nama_indikator}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                                            Penjelasan Level
                                        </span>
                                        <div className="space-y-3">
                                            {indikatorDetail.deskripsi.map(
                                                (desc, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700/50"
                                                    >
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded text-xs font-bold text-sm">
                                                                Level{" "}
                                                                {desc.tingkat}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                            {
                                                                desc.kriteria_kenaikan_tingkat
                                                            }
                                                        </p>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-sm text-slate-400 py-10">
                                    <p>
                                        Pilih indikator terlebih dahulu untuk
                                        melihat informasi detail.
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}

Create.layout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>;
