import React from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';

interface TabDusunProps {
    data: any[];
}

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
                        <th className="px-4 py-3 text-right">Jml RW</th>
                        <th className="px-4 py-3 text-right">Jml RT</th>
                        <th className="px-4 py-3 text-right">Jml Dasa Wisma</th>
                        <th className="px-4 py-3 text-right">Jml KRT</th>
                        <th className="px-4 py-3 text-right">Jumlah KK</th>
                        <th className="px-4 py-3 text-right">Total L</th>
                        <th className="px-4 py-3 text-right">Total P</th>
                        <th className="px-4 py-3 text-right">Balita L</th>
                        <th className="px-4 py-3 text-right">Balita P</th>
                        <th className="px-4 py-3 text-right">PUS</th>
                        <th className="px-4 py-3 text-right">WUS</th>
                        <th className="px-4 py-3 text-right">Ibu Hamil</th>
                        <th className="px-4 py-3 text-right">Ibu Menyusui</th>
                        <th className="px-4 py-3 text-right">Lansia</th>
                        <th className="px-4 py-3 text-right">3 Buta L</th>
                        <th className="px-4 py-3 text-right">3 Buta P</th>
                        <th className="px-4 py-3 text-right">Berkebutuhan Khusus</th>
                        <th className="px-4 py-3 text-right">Sehat/Layak Huni</th>
                        <th className="px-4 py-3 text-right">Tidak Sehat</th>
                        <th className="px-4 py-3 text-right">Tempat Sampah</th>
                        <th className="px-4 py-3 text-right">SPAL</th>
                        <th className="px-4 py-3 text-right">Sarana MCK</th>
                        <th className="px-4 py-3 text-right">PDAM</th>
                        <th className="px-4 py-3 text-right">Sumur</th>
                        <th className="px-4 py-3 text-right">Sungai</th>
                        <th className="px-4 py-3 text-right">DLL</th>
                        <th className="px-4 py-3 text-right">Beras</th>
                        <th className="px-4 py-3 text-right">Non Beras</th>
                        <th className="px-4 py-3 text-right">UP2K</th>
                        <th className="px-4 py-3 text-right">Tanah Pekarangan</th>
                        <th className="px-4 py-3 text-right">Industri RT</th>
                        <th className="px-4 py-3 text-right">Kesling</th>
                        <th className="px-4 py-3">Ket</th>
                        <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {data.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                            <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{item.nama_dusun || item.dusun || '-'}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.jumlah_rw || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.jumlah_rt || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.jumlah_dasa_wisma || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.jumlah_krt || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.jumlah_kk?.toLocaleString('id-ID') || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.total_l?.toLocaleString('id-ID') || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.total_p?.toLocaleString('id-ID') || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.balita_l || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.balita_p || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.pus || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.wus || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.ibu_hamil || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.ibu_menyusui || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.lansia || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.buta_l || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.buta_p || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.rumah_sehat || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.rumah_kurang_sehat || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.memiliki_tempat_sampah || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.memiliki_spal || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.memiliki_stiker_p4k || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.air_pdam || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.air_sumur || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.air_sungai || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.air_dll || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.makanan_pokok_beras || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.makanan_pokok_non_beras || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.kegiatan_up2k || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.kegiatan_tanah_pekarangan || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.kegiatan_industri_rumah_tangga || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.kegiatan_kesehatan_lingkungan || 0}</td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.keterangan || '-'}</td>
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