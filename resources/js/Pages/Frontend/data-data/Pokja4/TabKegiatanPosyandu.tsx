import React from "react";
import {
    Download,
    Activity,
    Syringe,
    Baby,
    Users,
    HeartPulse,
    Scale,
    Droplets,
} from "lucide-react";

interface PosyanduItem {
    id: number;
    bulan: number;
    nama_bulan: string;
    tahun: number;

    // IBU HAMIL & MENYUSUI
    ibu_hamil?: number;
    ibu_hamil_diperiksa?: number;
    ibu_hamil_dapat_fe?: number;
    ibu_menyusui?: number;

    // KB
    kb_iud?: number;
    kb_mow?: number;
    kb_mop?: number;
    kb_implan?: number;
    kb_pil?: number;
    kb_suntik?: number;
    kb_kondom?: number;

    // BALITA
    balita_l?: number;
    balita_p?: number;
    balita_kia_l?: number;
    balita_kia_p?: number;
    balita_ditimbang_l?: number;
    balita_ditimbang_p?: number;
    balita_naik_l?: number;
    balita_naik_p?: number;

    // VITAMIN
    vit_a_1?: number;
    vit_a_2?: number;

    // IMUNISASI
    imunisasi_tt_1?: number;
    imunisasi_tt_2?: number;
    imunisasi_bcg?: number;
    imunisasi_dpt_1?: number;
    imunisasi_dpt_2?: number;
    imunisasi_dpt_3?: number;
    imunisasi_polio_1?: number;
    imunisasi_polio_2?: number;
    imunisasi_polio_3?: number;
    imunisasi_polio_4?: number;
    imunisasi_campak?: number;
    imunisasi_hepatitis_1?: number;
    imunisasi_hepatitis_2?: number;
    imunisasi_hepatitis_3?: number;

    // DIARE
    balita_diare?: number;
    balita_oralit?: number;

    [key: string]: any;
}

interface Props {
    data: PosyanduItem[];
    tahun?: string;
    onTahunChange?: (tahun: string) => void;
}

export default function TabKegiatanPosyandu({
    data,
    tahun = new Date().getFullYear().toString(),
    onTahunChange,
}: Props) {
    const items = data || [];

    // ✅ FIX: Group per bulan — jumlahkan semua kecamatan
    const groupedByBulan = items.reduce((acc, item) => {
        const key = `${item.bulan}-${item.nama_bulan}`;
        if (!acc[key]) {
            acc[key] = {
                bulan: item.bulan,
                nama_bulan: item.nama_bulan,
                ibu_hamil: 0,
                ibu_hamil_diperiksa: 0,
                ibu_hamil_dapat_fe: 0,
                ibu_menyusui: 0,
                kb_iud: 0, kb_mow: 0, kb_mop: 0, kb_implan: 0,
                kb_pil: 0, kb_suntik: 0, kb_kondom: 0,
                balita_l: 0, balita_p: 0,
                balita_kia_l: 0, balita_kia_p: 0,
                balita_ditimbang_l: 0, balita_ditimbang_p: 0,
                balita_naik_l: 0, balita_naik_p: 0,
                vit_a_1: 0, vit_a_2: 0,
                imunisasi_tt_1: 0, imunisasi_tt_2: 0, imunisasi_bcg: 0,
                imunisasi_dpt_1: 0, imunisasi_dpt_2: 0, imunisasi_dpt_3: 0,
                imunisasi_polio_1: 0, imunisasi_polio_2: 0,
                imunisasi_polio_3: 0, imunisasi_polio_4: 0,
                imunisasi_campak: 0,
                imunisasi_hepatitis_1: 0, imunisasi_hepatitis_2: 0, imunisasi_hepatitis_3: 0,
                balita_diare: 0, balita_oralit: 0,
            };
        }
        // Jumlahkan — semua field — dari setiap kecamatan
        acc[key].ibu_hamil += Number(item.ibu_hamil) || 0;
        acc[key].ibu_hamil_diperiksa += Number(item.ibu_hamil_diperiksa) || 0;
        acc[key].ibu_hamil_dapat_fe += Number(item.ibu_hamil_dapat_fe) || 0;
        acc[key].ibu_menyusui += Number(item.ibu_menyusui) || 0;
        acc[key].kb_iud += Number(item.kb_iud) || 0;
        acc[key].kb_mow += Number(item.kb_mow) || 0;
        acc[key].kb_mop += Number(item.kb_mop) || 0;
        acc[key].kb_implan += Number(item.kb_implan) || 0;
        acc[key].kb_pil += Number(item.kb_pil) || 0;
        acc[key].kb_suntik += Number(item.kb_suntik) || 0;
        acc[key].kb_kondom += Number(item.kb_kondom) || 0;
        acc[key].balita_l += Number(item.balita_l) || 0;
        acc[key].balita_p += Number(item.balita_p) || 0;
        acc[key].balita_kia_l += Number(item.balita_kia_l) || 0;
        acc[key].balita_kia_p += Number(item.balita_kia_p) || 0;
        acc[key].balita_ditimbang_l += Number(item.balita_ditimbang_l) || 0;
        acc[key].balita_ditimbang_p += Number(item.balita_ditimbang_p) || 0;
        acc[key].balita_naik_l += Number(item.balita_naik_l) || 0;
        acc[key].balita_naik_p += Number(item.balita_naik_p) || 0;
        acc[key].vit_a_1 += Number(item.vit_a_1) || 0;
        acc[key].vit_a_2 += Number(item.vit_a_2) || 0;
        acc[key].imunisasi_tt_1 += Number(item.imunisasi_tt_1) || 0;
        acc[key].imunisasi_tt_2 += Number(item.imunisasi_tt_2) || 0;
        acc[key].imunisasi_bcg += Number(item.imunisasi_bcg) || 0;
        acc[key].imunisasi_dpt_1 += Number(item.imunisasi_dpt_1) || 0;
        acc[key].imunisasi_dpt_2 += Number(item.imunisasi_dpt_2) || 0;
        acc[key].imunisasi_dpt_3 += Number(item.imunisasi_dpt_3) || 0;
        acc[key].imunisasi_polio_1 += Number(item.imunisasi_polio_1) || 0;
        acc[key].imunisasi_polio_2 += Number(item.imunisasi_polio_2) || 0;
        acc[key].imunisasi_polio_3 += Number(item.imunisasi_polio_3) || 0;
        acc[key].imunisasi_polio_4 += Number(item.imunisasi_polio_4) || 0;
        acc[key].imunisasi_campak += Number(item.imunisasi_campak) || 0;
        acc[key].imunisasi_hepatitis_1 += Number(item.imunisasi_hepatitis_1) || 0;
        acc[key].imunisasi_hepatitis_2 += Number(item.imunisasi_hepatitis_2) || 0;
        acc[key].imunisasi_hepatitis_3 += Number(item.imunisasi_hepatitis_3) || 0;
        acc[key].balita_diare += Number(item.balita_diare) || 0;
        acc[key].balita_oralit += Number(item.balita_oralit) || 0;
        return acc;
    }, {} as Record<string, any>);

    // Urutkan per bulan
    const groupedItems = Object.values(groupedByBulan).sort(
        (a: any, b: any) => a.bulan - b.bulan
    );

    // Helper sum dari grouped
    const sum = (key: string) =>
        groupedItems.reduce((a: number, c: any) => a + (Number(c[key]) || 0), 0);

    // === IBU HAMIL ===
    const totalIbuHamil = sum("ibu_hamil");
    const totalIbuDiperiksa = sum("ibu_hamil_diperiksa");
    const totalIbuDapatFe = sum("ibu_hamil_dapat_fe");
    const totalMenyusui = sum("ibu_menyusui");

    // === KB ===
    const totalIUD = sum("kb_iud");
    const totalMOW = sum("kb_mow");
    const totalMOP = sum("kb_mop");
    const totalImplan = sum("kb_implan");
    const totalPil = sum("kb_pil");
    const totalSuntik = sum("kb_suntik");
    const totalKondom = sum("kb_kondom");
    const totalKB = totalIUD + totalMOW + totalMOP + totalImplan + totalPil + totalSuntik + totalKondom;

    // === BALITA ===
    const totalBalitaL = sum("balita_l");
    const totalBalitaP = sum("balita_p");
    const totalBalita = totalBalitaL + totalBalitaP;
    const totalDitimbangL = sum("balita_ditimbang_l");
    const totalDitimbangP = sum("balita_ditimbang_p");
    const totalDitimbang = totalDitimbangL + totalDitimbangP;
    const totalNaikL = sum("balita_naik_l");
    const totalNaikP = sum("balita_naik_p");

    // === VITAMIN ===
    const totalVitA1 = sum("vit_a_1");
    const totalVitA2 = sum("vit_a_2");

    // === IMUNISASI ===
    const totalImunisasi =
        sum("imunisasi_tt_1") + sum("imunisasi_tt_2") +
        sum("imunisasi_bcg") +
        sum("imunisasi_dpt_1") + sum("imunisasi_dpt_2") + sum("imunisasi_dpt_3") +
        sum("imunisasi_polio_1") + sum("imunisasi_polio_2") + sum("imunisasi_polio_3") + sum("imunisasi_polio_4") +
        sum("imunisasi_campak") +
        sum("imunisasi_hepatitis_1") + sum("imunisasi_hepatitis_2") + sum("imunisasi_hepatitis_3");

    // === DIARE ===
    const totalDiare = sum("balita_diare");
    const totalOralit = sum("balita_oralit");

    return (
        <div className="p-5 space-y-6">
            {/* FILTER + EXPORT */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-slate-600">Tahun</label>
                    <select
                        value={tahun}
                        onChange={(e) => onTahunChange?.(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0072BC]"
                    >
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                    </select>
                </div>

                <a
                    href={`/pokja-4/export-posyandu?tahun=${tahun}`}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                    <Download size={15} />
                    Export Excel
                </a>
            </div>

            {/* METRIC CARDS — 8 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <HeartPulse size={14} className="text-slate-600" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ibu Hamil</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{totalIbuHamil.toLocaleString("id-ID")}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Baby size={14} className="text-slate-600" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Menyusui</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{totalMenyusui.toLocaleString("id-ID")}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity size={14} className="text-slate-600" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Akseptor KB</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{totalKB.toLocaleString("id-ID")}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={14} className="text-slate-600" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Balita</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{totalBalita.toLocaleString("id-ID")}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Scale size={14} className="text-slate-600" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ditimbang</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{totalDitimbang.toLocaleString("id-ID")}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Syringe size={14} className="text-slate-600" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Imunisasi</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{totalImunisasi.toLocaleString("id-ID")}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Droplets size={14} className="text-slate-600" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Oralit</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{totalOralit.toLocaleString("id-ID")}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity size={14} className="text-slate-600" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vit A</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{(totalVitA1 + totalVitA2).toLocaleString("id-ID")}</p>
                </div>
            </div>

            {/* TABEL */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800">Data Kegiatan Posyandu</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Rekap per bulan — dari semua kecamatan</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs min-w-[1400px]">
                        <thead>
                            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                                <th rowSpan={2} className="p-2 border-r border-slate-200 text-center font-bold sticky left-0 bg-slate-100 z-10">NO</th>
                                <th rowSpan={2} className="p-2 border-r border-slate-200 text-center font-bold sticky left-[50px] bg-slate-100 z-10 min-w-[100px]">BULAN</th>
                                <th colSpan={4} className="p-2 border-r border-slate-200 text-center font-bold bg-slate-200">IBU</th>
                                <th colSpan={7} className="p-2 border-r border-slate-200 text-center font-bold bg-slate-200">AKSEPTOR KB</th>
                                <th colSpan={8} className="p-2 border-r border-slate-200 text-center font-bold bg-slate-200">BALITA</th>
                                <th colSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-slate-200">VIT A</th>
                                <th colSpan={14} className="p-2 border-r border-slate-200 text-center font-bold bg-slate-200">IMUNISASI</th>
                                <th colSpan={2} className="p-2 text-center font-bold bg-slate-200">DIARE</th>
                            </tr>
                            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Hamil</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Diperiksa</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Dapat Fe</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Menyusui</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">IUD</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">MOW</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">MOP</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Implan</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Pil</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Suntik</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Kondom</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">L</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">P</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">KIA L</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">KIA P</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Timbang L</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Timbang P</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Naik L</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Naik P</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Vit A-1</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Vit A-2</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">TT-1</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">TT-2</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">BCG</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">DPT-1</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">DPT-2</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">DPT-3</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Polio-1</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Polio-2</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Polio-3</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Polio-4</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Campak</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Hep-1</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Hep-2</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Hep-3</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Diare</th>
                                <th className="p-2 text-center font-semibold bg-slate-50">Oralit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {groupedItems.length === 0 ? (
                                <tr>
                                    <td colSpan={39} className="text-center py-12 text-slate-400">
                                        Belum ada data kegiatan posyandu untuk tahun ini.
                                    </td>
                                </tr>
                            ) : (
                                groupedItems.map((item: any, idx: number) => (
                                    <tr key={`${item.bulan}-${idx}`} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-2 border-r border-slate-100 text-center text-slate-500 sticky left-0 bg-white z-10">{idx + 1}</td>
                                        <td className="p-2 border-r border-slate-100 font-semibold text-slate-900 sticky left-[50px] bg-white z-10">
                                            {item.nama_bulan}
                                        </td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.ibu_hamil || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.ibu_hamil_diperiksa || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.ibu_hamil_dapat_fe || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.ibu_menyusui || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.kb_iud || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.kb_mow || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.kb_mop || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.kb_implan || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.kb_pil || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.kb_suntik || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.kb_kondom || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.balita_l || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.balita_p || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.balita_kia_l || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.balita_kia_p || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.balita_ditimbang_l || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.balita_ditimbang_p || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.balita_naik_l || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.balita_naik_p || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.vit_a_1 || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.vit_a_2 || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.imunisasi_tt_1 || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.imunisasi_tt_2 || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.imunisasi_bcg || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.imunisasi_dpt_1 || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.imunisasi_dpt_2 || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.imunisasi_dpt_3 || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.imunisasi_polio_1 || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.imunisasi_polio_2 || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.imunisasi_polio_3 || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.imunisasi_polio_4 || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.imunisasi_campak || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.imunisasi_hepatitis_1 || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.imunisasi_hepatitis_2 || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.imunisasi_hepatitis_3 || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.balita_diare || 0}</td>
                                        <td className="p-2 text-center">{item.balita_oralit || 0}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {groupedItems.length > 0 && (
                            <tfoot>
                                <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
                                    <td colSpan={2} className="p-2 border-r border-slate-200 text-center sticky left-0 bg-slate-100 z-10">JUMLAH</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalIbuHamil}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalIbuDiperiksa}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalIbuDapatFe}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalMenyusui}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalIUD}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalMOW}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalMOP}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalImplan}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalPil}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalSuntik}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalKondom}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalBalitaL}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalBalitaP}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("balita_kia_l")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("balita_kia_p")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalDitimbangL}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalDitimbangP}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalNaikL}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalNaikP}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalVitA1}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalVitA2}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("imunisasi_tt_1")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("imunisasi_tt_2")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("imunisasi_bcg")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("imunisasi_dpt_1")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("imunisasi_dpt_2")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("imunisasi_dpt_3")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("imunisasi_polio_1")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("imunisasi_polio_2")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("imunisasi_polio_3")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("imunisasi_polio_4")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("imunisasi_campak")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("imunisasi_hepatitis_1")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("imunisasi_hepatitis_2")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("imunisasi_hepatitis_3")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalDiare}</td>
                                    <td className="p-2 text-center">{totalOralit}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
}
