import React from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';

interface TabDusunProps {
    data: any[];
}

// Header dan isi tabel dibuat dari SATU daftar ini, jadi tidak mungkin bergeser lagi.
// Urutan mengikuti template Excel. Untuk menambah/menghapus kolom, cukup ubah di sini.
const NUMERIC_COLUMNS: { label: string; key: string }[] = [
    { label: 'Jml RW', key: 'jumlah_rw' },
    { label: 'Jml RT', key: 'jumlah_rt' },
    { label: 'Jml Dasa Wisma', key: 'jumlah_dasa_wisma' },
    { label: 'Jml KRT', key: 'jumlah_krt' },
    { label: 'Jumlah KK', key: 'jumlah_kk' },
    { label: 'Total L', key: 'total_l' },
    { label: 'Total P', key: 'total_p' },
    { label: 'Balita L', key: 'balita_l' },
    { label: 'Balita P', key: 'balita_p' },
    { label: 'PUS', key: 'pus' },
    { label: 'WUS', key: 'wus' },
    { label: 'Ibu Hamil', key: 'ibu_hamil' },
    { label: 'Ibu Menyusui', key: 'ibu_menyusui' },
    { label: 'Lansia', key: 'lansia' },
    { label: '3 Buta L', key: 'buta_l' },
    { label: '3 Buta P', key: 'buta_p' },
    { label: 'Sehat/Layak Huni', key: 'rumah_sehat' },
    { label: 'Tidak Sehat', key: 'rumah_kurang_sehat' },
    { label: 'Tempat Sampah', key: 'memiliki_tempat_sampah' },
    { label: 'SPAL', key: 'memiliki_spal' },
    { label: 'Stiker P4K', key: 'memiliki_stiker_p4k' },
    { label: 'PDAM', key: 'air_pdam' },
    { label: 'Sumur', key: 'air_sumur' },
    { label: 'Sungai', key: 'air_sungai' },
    { label: 'DLL', key: 'air_dll' },
    { label: 'Jamban', key: 'jumlah_jamban_keluarga' },
    { label: 'Beras', key: 'makanan_pokok_beras' },
    { label: 'Non Beras', key: 'makanan_pokok_non_beras' },
    { label: 'UP2K', key: 'kegiatan_up2k' },
    { label: 'Tanah Pekarangan', key: 'kegiatan_tanah_pekarangan' },
    { label: 'Industri RT', key: 'kegiatan_industri_rumah_tangga' },
    { label: 'Kesling', key: 'kegiatan_kesehatan_lingkungan' },
];

const formatAngka = (value: any): string => Number(value || 0).toLocaleString('id-ID');

export default function TabDusun({ data }: TabDusunProps) {
    if (!data || data.length === 0) {
        return (
            <div className="p-16 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                    Belum Ada Data Level Dusun
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    Import data dari file Excel
                </p>
            </div>
        );
    }

    const handleDelete = (dusun: string) => {
        if (!confirm(`Yakin hapus data dusun "${dusun}"? Semua data RT di dusun ini akan terhapus.`)) {
            return;
        }
        router.delete(`/desa/kegiatan/dusun/${encodeURIComponent(dusun)}`, {
            preserveScroll: true,
        });
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr className="text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <th className="px-4 py-3">No</th>
                        <th className="px-4 py-3">Dusun</th>
                        {NUMERIC_COLUMNS.map((col) => (
                            <th key={col.key} className="px-4 py-3 text-right">
                                {col.label}
                            </th>
                        ))}
                        <th className="px-4 py-3">Ket</th>
                        <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {data.map((item, idx) => (
                        <tr key={item.id ?? idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                            <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                                {item.nama_dusun || item.dusun || '-'}
                            </td>
                            {NUMERIC_COLUMNS.map((col) => (
                                <td
                                    key={col.key}
                                    className="px-4 py-3 text-right text-slate-700 dark:text-slate-300"
                                >
                                    {formatAngka(item[col.key])}
                                </td>
                            ))}
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                {item.keterangan || '-'}
                            </td>
                            <td className="px-4 py-3 text-center">
                                <button
                                    onClick={() => handleDelete(item.nama_dusun || item.dusun)}
                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1"
                                    title="Hapus dusun"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
