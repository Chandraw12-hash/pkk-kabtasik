import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminDesaLayout from '@/Components/Layout/AdminDesaLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import { Upload, ArrowLeft, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

export default function Import() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setProcessing(true);
        const formData = new FormData();
        formData.append('file', file);

        router.post('/desa/data-umum/import', formData, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminDesaLayout>
            <Head title="Import Data Umum PKK" />

            <div className="space-y-6 max-w-3xl">
                <Link
                    href="/desa/data-umum"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Data Umum
                </Link>

                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                        Import Data Umum PKK
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Upload file Excel sesuai template PKK
                    </p>
                </div>

                <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Info */}
                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900">
                            <div className="flex items-start gap-3">
                                <FileSpreadsheet className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-semibold text-blue-900 dark:text-blue-300">Format File</p>
                                    <p className="text-blue-700 dark:text-blue-400 mt-1">
                                        File harus <b>.xlsx</b> dan sesuai dengan template Excel dari PKK.
                                    </p>
                                    <a
                                        href="/desa/data-umum/template"
                                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold mt-2 hover:underline"
                                    >
                                        <Upload className="w-3 h-3" />
                                        Download Template
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* File Input */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                File Excel
                            </label>
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="block w-full text-sm text-slate-500 dark:text-slate-400
                                    file:mr-4 file:py-2.5 file:px-4
                                    file:rounded-xl file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-teal-50 file:text-teal-700
                                    dark:file:bg-teal-950 dark:file:text-teal-400
                                    hover:file:bg-teal-100 dark:hover:file:bg-teal-900
                                    file:cursor-pointer cursor-pointer
                                    border border-slate-200 dark:border-slate-700
                                    rounded-xl bg-white dark:bg-slate-800"
                            />
                            {file && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                    File dipilih: <span className="font-semibold">{file.name}</span> ({(file.size / 1024).toFixed(1)} KB)
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <button
                                type="submit"
                                disabled={!file || processing}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                            >
                                <Upload size={16} />
                                {processing ? 'Memproses...' : 'Import Data'}
                            </button>
                            <Link
                                href="/desa/data-umum"
                                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
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
