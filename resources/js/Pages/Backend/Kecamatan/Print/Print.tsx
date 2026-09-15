import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Printer, X, FileText } from 'lucide-react';

interface LaporanItem {
    id: number;
    judul: string;
    kategori_pokja: string;
    kecamatan: string;
    desa_kelurahan: string | null;
    nama_dasawisma: string | null;
    status: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
    };
}

interface PrintProps {
    kecamatan: string;
    jenis: string;
    laporan: LaporanItem[];
    tanggal: string;
}

export default function Print({ kecamatan, jenis, laporan, tanggal }: PrintProps) {
    // Auto print saat halaman dibuka
    useEffect(() => {
        const timer = setTimeout(() => {
            window.print();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Status label
    const getStatusLabel = (status: string): string => {
        const map: Record<string, string> = {
            pending: 'Menunggu',
            approved: 'Disetujui',
            rejected: 'Ditolak',
            reviewed: 'Direview',
        };
        return map[status] || status;
    };

    const totalLaporan = laporan.length;

    return (
        <>
            <Head title={`Print Laporan - ${kecamatan}`} />

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { margin: 0; padding: 0; background: white; }
                    .print-container { padding: 15mm; }
                    @page { size: A4 landscape; margin: 10mm; }
                }
            `}</style>

            <div className="min-h-screen bg-slate-100">
                {/* TOOLBAR */}
                <div className="no-print sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-900">Print Preview</h1>
                            <p className="text-xs text-slate-500">Laporan Kecamatan {kecamatan}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                            Print Ulang
                        </button>
                        <button
                            onClick={() => window.close()}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Tutup
                        </button>
                    </div>
                </div>

                {/* PRINT CONTENT */}
                <div className="print-container p-8 max-w-7xl mx-auto">
                    <div className="bg-white shadow-lg rounded-2xl p-10">
                        {/* KOP SURAT */}
                        <div className="text-center border-b-4 border-double border-slate-900 pb-6 mb-6">
                            <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
                                TIM PENGGERAK PKK KABUPATEN TASIKMALAYA
                            </h1>
                            <h2 className="text-base font-semibold text-slate-700 uppercase mt-1">
                                KECAMATAN {kecamatan.toUpperCase()}
                            </h2>
                            <p className="text-sm text-slate-600 mt-1">
                                Jl. Raya Tasikmalaya No. 1, Kabupaten Tasikmalaya, Jawa Barat
                            </p>
                        </div>

                        {/* JUDUL LAPORAN */}
                        <div className="text-center mb-6">
                            <h3 className="text-base font-bold text-slate-900 uppercase underline">
                                LAPORAN KEGIATAN PKK
                            </h3>
                            <p className="text-sm text-slate-600 mt-2">
                                Kecamatan {kecamatan} — Tahun {new Date().getFullYear()}
                            </p>
                        </div>

                        {/* INFO */}
                        <div className="mb-6 text-sm text-slate-600 flex justify-between">
                            <p><strong>Total Laporan:</strong> {totalLaporan} laporan</p>
                            <p><strong>Tanggal Cetak:</strong> {tanggal}</p>
                        </div>

                        {/* TABEL */}
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-800 text-white">
                                    <th className="border border-slate-300 px-3 py-2 text-center font-bold w-12">No</th>
                                    <th className="border border-slate-300 px-3 py-2 text-center font-bold w-24">Tanggal</th>
                                    <th className="border border-slate-300 px-3 py-2 text-left font-bold">Judul Laporan</th>
                                    <th className="border border-slate-300 px-3 py-2 text-center font-bold w-20">Pokja</th>
                                    <th className="border border-slate-300 px-3 py-2 text-left font-bold w-32">Desa/Kelurahan</th>
                                    <th className="border border-slate-300 px-3 py-2 text-left font-bold w-32">Dasa Wisma</th>
                                    <th className="border border-slate-300 px-3 py-2 text-center font-bold w-24">Status</th>
                                    <th className="border border-slate-300 px-3 py-2 text-left font-bold w-32">Pelapor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {laporan.length > 0 ? (
                                    laporan.map((item, index) => (
                                        <tr key={item.id} className="even:bg-slate-50">
                                            <td className="border border-slate-300 px-3 py-2 text-center">{index + 1}</td>
                                            <td className="border border-slate-300 px-3 py-2 text-center text-xs">
                                                {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="border border-slate-300 px-3 py-2">{item.judul}</td>
                                            <td className="border border-slate-300 px-3 py-2 text-center text-xs">
                                                Pokja {item.kategori_pokja}
                                            </td>
                                            <td className="border border-slate-300 px-3 py-2 text-xs">
                                                {item.desa_kelurahan || '-'}
                                            </td>
                                            <td className="border border-slate-300 px-3 py-2 text-xs">
                                                {item.nama_dasawisma || '-'}
                                            </td>
                                            <td className="border border-slate-300 px-3 py-2 text-center text-xs">
                                                {getStatusLabel(item.status)}
                                            </td>
                                            <td className="border border-slate-300 px-3 py-2 text-xs">
                                                {item.user?.name || 'Anonim'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="border border-slate-300 px-3 py-8 text-center text-slate-400 italic">
                                            Belum ada data laporan untuk kecamatan ini
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* TANDA TANGAN */}
                        <div className="mt-12 grid grid-cols-2 gap-12 text-sm">
                            <div className="text-center">
                                <p className="mb-20">Mengetahui,</p>
                                <p className="font-bold border-t border-slate-400 pt-1 inline-block px-8">
                                    Ketua TP PKK Kecamatan
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="mb-20">{kecamatan}, {tanggal}</p>
                                <p className="font-bold border-t border-slate-400 pt-1 inline-block px-8">
                                    Sekretaris
                                </p>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
                            <p>Dicetak otomatis dari Sistem Informasi PKK Kabupaten Tasikmalaya</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
