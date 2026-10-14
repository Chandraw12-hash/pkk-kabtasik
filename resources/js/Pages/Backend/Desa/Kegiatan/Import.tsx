import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminDesaLayout from '@/Components/Layout/AdminDesaLayout';
import Card from '@/Components/UI/Card';
import { Upload, ArrowLeft, FileSpreadsheet, Info } from 'lucide-react';

export default function Import() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] ?? null;
        setFile(selectedFile);
        setError(null);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!file) {
            setError('Pilih file Excel dulu');
            return;
        }

        if (processing) {
            return;
        }

        setProcessing(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        router.post('/desa/kegiatan/import', formData, {
            forceFormData: true,
            preserveScroll: true,

            onSuccess: () => {
                setFile(null);
                setProcessing(false);
            },

            onError: () => {
                setError('Import gagal. Cek file Excel.');
                setProcessing(false);
            },

            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <AdminDesaLayout>
            <Head title="Import Rekap Kegiatan" />

            <div className="space-y-6 max-w-3xl">
                <Link
                    href="/desa/kegiatan"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Rekap Kegiatan
                </Link>

                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                        Import Rekap Kegiatan
                    </h1>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Upload file Excel sesuai template PKK
                    </p>
                </div>

                <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* INFO — FORMAT FILE */}
                        <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900">
                            <div className="flex items-start gap-3">
                                <FileSpreadsheet className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />

                                <div className="text-sm">
                                    <p className="font-semibold text-purple-900 dark:text-purple-300">
                                        Format File
                                    </p>

                                    <p className="text-purple-700 dark:text-purple-400 mt-1">
                                        File harus <b>.xlsx</b> — data level <b>RT</b>.
                                    </p>

                                    <a
                                        href="/desa/kegiatan/template"
                                        className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold mt-2 hover:underline"
                                    >
                                        <Upload className="w-3 h-3" />
                                        Download Template
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* INFO — AGREGASI OTOMATIS */}
                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />

                                <div className="text-sm">
                                    <p className="font-semibold text-blue-900 dark:text-blue-300">
                                        Info
                                    </p>

                                    <p className="text-blue-700 dark:text-blue-400 mt-1">
                                        Cukup import data <b>level RT</b>. Data level <b>RW</b>, <b>Dusun</b>, dan <b>Desa</b> akan dihitung otomatis oleh sistem.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* FILE EXCEL */}
                        <div>
                            <label
                                htmlFor="file"
                                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                            >
                                File Excel
                            </label>

                            <input
                                id="file"
                                name="file"
                                type="file"
                                accept=".xlsx,.xls"
                                disabled={processing}
                                onChange={handleFileChange}
                                className="block w-full text-sm text-slate-500 dark:text-slate-400
                                    file:mr-4 file:py-2.5 file:px-4
                                    file:rounded-xl file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-purple-50 file:text-purple-700
                                    dark:file:bg-purple-950 dark:file:text-purple-400
                                    hover:file:bg-purple-100 dark:hover:file:bg-purple-900
                                    file:cursor-pointer cursor-pointer
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    border border-slate-200 dark:border-slate-700
                                    rounded-xl bg-white dark:bg-slate-800"
                            />

                            {file && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                    File dipilih:{' '}
                                    <span className="font-semibold">
                                        {file.name}
                                    </span>{' '}
                                    ({(file.size / 1024).toFixed(1)} KB)
                                </p>
                            )}

                            {error && (
                                <p className="text-xs text-red-500 mt-2">
                                    ❌ {error}
                                </p>
                            )}
                        </div>

                        {/* ACTION */}
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <button
                                type="submit"
                                disabled={!file || processing}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl
                                    bg-purple-600
                                    hover:bg-purple-700
                                    disabled:bg-slate-300
                                    dark:disabled:bg-slate-700
                                    disabled:cursor-not-allowed
                                    text-white text-sm font-semibold
                                    transition-colors"
                            >
                                <Upload size={16} />

                                {processing
                                    ? 'Memproses...'
                                    : 'Import Data'}
                            </button>

                            <Link
                                href="/desa/kegiatan"
                                className="px-4 py-2.5 rounded-xl
                                    border border-slate-200
                                    dark:border-slate-700
                                    text-slate-600
                                    dark:text-slate-400
                                    text-sm font-semibold
                                    hover:bg-slate-50
                                    dark:hover:bg-slate-700
                                    transition-colors"
                            >
                                Batal
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </AdminDesaLayout>
    );
}
