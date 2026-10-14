// Satu sheet/tab: A. Data Dukung + B. Data Program.
// Tampilan tabel kolom persis format laporan (1 tabel per kecamatan).
// Kontrak key kolom (snake_case) disepakati dengan backend
// (dikirim via Inertia + JSON oleh Pokja4Controller@index).
import React, { useEffect, useMemo, useState } from "react";
import Card from "@/Components/UI/Card";
import TabPageLayout from "./TabPageLayout";
import {
    buildPivot,
    formatValue,
    kecamatanDisplayName,
    Pokja4DataRow,
    sumField,
    uniqueKecamatan,
} from "./Pokja4TabUtils";

interface Props {
    dukung: Pokja4DataRow[];
    program: Pokja4DataRow[];
    year: number;
    years: number[];
    onYearChange: (year: number) => void;
    semester: string;
    semesters?: string[];
    onSemesterChange: (semester: string) => void;
}

const dukungIndicators: Array<{ key: string; label: string }> = [
    { key: "jumlah_penduduk", label: "Jumlah Penduduk" },
    { key: "jumlah_kepala_keluarga", label: "Jumlah Kepala Keluarga" },
    { key: "jumlah_rumah", label: "Jumlah Rumah" },
    { key: "jumlah_laki_laki", label: "Jumlah Laki-Laki" },
    { key: "jumlah_perempuan", label: "Jumlah Perempuan" },
    {
        key: "jumlah_usia_produktif",
        label: "Jumlah Usia Produktif (15-64 thn)",
    },
    {
        key: "jumlah_pasangan_usia_subur",
        label: "Jumlah Pasangan Usia Subur",
    },
    { key: "jumlah_ibu_hamil", label: "Jumlah Ibu Hamil" },
    { key: "jumlah_bayi_0_2", label: "Jumlah Bayi (0-2 Tahun)" },
    {
        key: "jumlah_bayi_asi_eksklusif",
        label: "Jumlah Bayi yang mendapatkan ASI Eksklusif (0-6 Bulan)",
    },
    { key: "jumlah_balita_2_5", label: "Jumlah Balita (≥2-5 Tahun)" },
    { key: "jumlah_anak_6_14", label: "Jumlah Anak (6-14 Tahun)" },
    { key: "jumlah_lansia", label: "Jumlah Lansia (≥65 Tahun)" },
    { key: "jumlah_peserta_kb_aktif", label: "Jumlah Peserta KB Aktif" },
    { key: "jumlah_ibu_menyusui", label: "Jumlah Ibu Menyusui" },
    { key: "jumlah_keluarga_sejahtera", label: "Jumlah Keluarga Sejahtera" },
    {
        key: "jumlah_keluarga_pra_sejahtera",
        label: "Jumlah Keluarga Pra Sejahtera",
    },
    {
        key: "jumlah_mbr",
        label: "Jumlah Masyarakat Berpenghasilan Rendah (MBR)",
    },
    { key: "jumlah_kader_pkk_rt_rw", label: "Jumlah Kader PKK RT/RW" },
    {
        key: "jumlah_kader_pkk_kesehatan",
        label: "Jumlah Kader PKK Bidang Kesehatan",
    },
    {
        key: "jumlah_kelompok_dasa_wisma",
        label: "Jumlah Kelompok Dasa Wisma",
    },
    { key: "jumlah_kader_dasa_wisma", label: "Jumlah Kader Dasa Wisma" },
    { key: "jumlah_posyandu_aktif", label: "Jumlah Posyandu Aktif" },
    { key: "jumlah_bidan_desa", label: "Jumlah Bidan Desa" },
    { key: "jumlah_bank_sampah", label: "Jumlah Bank Sampah" },
    { key: "jumlah_posko_bencana", label: "Jumlah Posko Bencana" },
];

const programGroups: Array<{
    title: string;
    fields: Array<{ key: string; label: string }>;
}> = [
    {
        title: "Program Gerakan Keluarga Sehat Tanggap dan Tangguh Bencana Peduli Stunting",
        fields: [
            { key: "stunting_bayi_prematur", label: "Jumlah Bayi Lahir Prematur" },
            {
                key: "stunting_bblr",
                label: "Jumlah Bayi Lahir Berat Badan Bayi Lahir Rendah (BBLR)",
            },
            {
                key: "stunting_balita_kurang_gizi",
                label: "Jumlah Balita Kurang Gizi",
            },
            { key: "stunting_balita_stunting", label: "Jumlah Balita Stunting" },
            {
                key: "stunting_rutin_timbang",
                label: "Jumlah bayi dan balita yang rutin dilakukan pemeriksaan tumbuh kembang setiap bulan",
            },
            {
                key: "stunting_jarak_dekat",
                label: "Jumlah Ibu Yang Melahirkan dengan Jarak Terlalu Dekat",
            },
            {
                key: "stunting_tidak_direncanakan",
                label: "Jumlah Kehamilan Yang Tidak Direncanakan / Tidak Diinginkan",
            },
        ],
    },
    {
        title: "Program Gerakan Keluarga Sehat Tanggap dan Tangguh Bencana Menuju Perilaku Hidup Bersih Dan Sehat (PHBS)",
        fields: [
            {
                key: "phbs_tbc",
                label: "Jumlah penduduk penderita Tuberkulosis (TBC)",
            },
            {
                key: "phbs_jamban_sehat",
                label: "Jumlah rumah yang memiliki jamban sehat",
            },
            {
                key: "phbs_air_bersih",
                label: "Jumlah rumah yang memiliki fasilitas instalasi atau bak penampung air bersih",
            },
            { key: "phbs_diare", label: "Jumlah kasus penyakit Diare" },
            {
                key: "phbs_sadar_gizi",
                label: "Jumlah keluarga yang sadar gizi",
            },
            {
                key: "phbs_tanpa_rokok",
                label: "Jumlah rumah tanpa asap rokok",
            },
            {
                key: "phbs_babs",
                label: "Jumlah penduduk yang masih Buang Air Besar Sembarangan (BABS)",
            },
        ],
    },
    {
        title: "Program Gerakan Keluarga Sehat Tanggap dan Tangguh Bencana Peduli Kesehatan Keluarga (Ayah, Ibu dan Anak)",
        fields: [
            {
                key: "kesga_bumil_rutin",
                label: "Jumlah ibu hamil yang rutin memeriksakan kehamilannya pada tenaga kesehatan secara periodik",
            },
            { key: "kesga_ayah_merokok", label: "Jumlah Ayah yang merokok" },
            {
                key: "kesga_kematian_nifas",
                label: "Jumlah kasus Kematian Ibu nifas",
            },
            {
                key: "kesga_kanker_serviks",
                label: "Jumlah kasus Kanker Serviks pada Perempuan",
            },
            {
                key: "kesga_imunisasi_lengkap",
                label: "Jumlah bayi dan balita yang mendapat imunisasi dasar lengkap",
            },
            {
                key: "kesga_sakit_terdata",
                label: "Jumlah bayi dan balita sakit yang terdata pada fasilitas kesehatan",
            },
            {
                key: "kesga_kematian_bayi_balita",
                label: "Jumlah kasus Kematian Bayi dan Balita",
            },
        ],
    },
    {
        title: "Program Gerakan Keluarga Sehat Tanggap dan Tangguh Bencana Siaga Kebakaran lingkungan",
        fields: [
            {
                key: "kebakaran_kasus",
                label: "Jumlah kasus Kebakaran Rumah Tangga",
            },
            {
                key: "kebakaran_listrik_standar",
                label: "Jumlah Rumah Tangga Yang Memiliki Instalasi Listrik Yang Sesuai Standar",
            },
            {
                key: "kebakaran_apar",
                label: "Jumlah Rumah Tangga Yang Memiliki Alat Pemadam Kebakaran",
            },
            {
                key: "kebakaran_semi_permanen",
                label: "Jumlah Rumah Semi Permanen dan rumah kayu",
            },
            {
                key: "kebakaran_p3k",
                label: "Jumlah Rumah Tangga yang memiliki Kotak P3K",
            },
            {
                key: "kebakaran_edukasi_rt",
                label: "Jumlah Rumah Tangga Yang Telah Mendapatkan Informasi, Penyuluhan, Atau Sosialisasi Tentang Mitigasi Dan Penanggulangan Kebakaran",
            },
            {
                key: "kebakaran_edukasi_kader",
                label: "Jumlah Kader PKK Yang Telah Mendapatkan Edukasi Terkait Mitigasi Bencana Kebakaran",
            },
        ],
    },
    {
        title: "Program Gerakan Keluarga Sehat Tanggap dan Tangguh Mitigasi Bencana Alam",
        fields: [
            { key: "bencana_relawan", label: "Jumlah relawan Bencana Alam" },
            {
                key: "bencana_edukasi_rt",
                label: "Jumlah Rumah Tangga Yang Telah Mendapatkan Informasi, Penyuluhan, Atau Sosialisasi Tentang Mitigasi Dan Penanggulangan Bencana Alam",
            },
            {
                key: "bencana_edukasi_kader",
                label: "Jumlah Kader PKK Yang Telah Mendapatkan Edukasi Terkait Mitigasi Bencana Alam",
            },
            {
                key: "bencana_posko_alternatif",
                label: "Jumlah Fasilitas/Bangunan Yang Ditetapkan Sebagai Alternatif Posko Bila Terjadi Bencana Alam",
            },
            {
                key: "bencana_relawan_terdata",
                label: "Jumlah Relawan Bencana Alam Terdata",
            },
            {
                key: "bencana_tas_siaga",
                label: "Jumlah Rumah Tangga Yang Memiliki Tas Siaga Bencana",
            },
            {
                key: "bencana_fasum_rusak",
                label: "Jumlah Kerusakan Fasilitas Umum Yang Diakibatkan Oleh Bencana Alam",
            },
        ],
    },
    {
        title: "Program Gerakan Keluarga Sehat Tanggap dan Tangguh Bencana Peduli Lingkungan",
        fields: [
            {
                key: "lingkungan_bak_sampah",
                label: "Jumlah Keluarga yang memiliki bak sampah",
            },
            {
                key: "lingkungan_bank_sampah",
                label: "Jumlah Keluarga sebagai anggota Bank Sampah",
            },
            {
                key: "lingkungan_spal",
                label: "Jumlah keluarga yang menggunakan Sistem Pembuangan Air Limbah (SPAL)",
            },
            { key: "lingkungan_banjir", label: "Jumlah kasus banjir" },
            {
                key: "lingkungan_bak_desa",
                label: "Jumlah bak sampah milik desa/kelurahan",
            },
            { key: "lingkungan_rumah_sehat", label: "Jumlah Rumah sehat" },
            {
                key: "lingkungan_klb",
                label: "Jumlah kasus Kejadian Luar Biasa (KLB)",
            },
        ],
    },
    {
        title: "Program Gerakan Keluarga Sehat Tanggap dan Tangguh Bencana Menuju Keluarga Sehat Berkualitas",
        fields: [
            {
                key: "berkualitas_2_anak",
                label: "Jumlah Keluarga dengan 2 anak",
            },
            {
                key: "berkualitas_berobat",
                label: "Jumlah Penduduk yang berobat ke fasilitas kesehatan berdasarkan data di fasilitas kesehatan",
            },
            {
                key: "berkualitas_menular",
                label: "Jumlah kasus penyakit menular",
            },
            {
                key: "berkualitas_tidak_menular",
                label: "Jumlah kasus penyakit tidak menular",
            },
            { key: "berkualitas_lahir_sehat", label: "Jumlah Bayi Lahir Sehat" },
            {
                key: "berkualitas_cukup_bulan",
                label: "Jumlah Bayi Lahir Cukup Bulan",
            },
            {
                key: "berkualitas_gangguan_jiwa",
                label: "Jumlah keluarga yang memiliki anggota dengan kriteria penyakit gangguan jiwa",
            },
        ],
    },
    {
        title: "Program Gerakan Keluarga Sehat Tanggap dan Tangguh Bencana Menuju Keuangan Sehat",
        fields: [
            {
                key: "keuangan_asuransi",
                label: "Jumlah Keluarga yang memiliki Asuransi Kesehatan",
            },
            {
                key: "keuangan_tanpa_kerja",
                label: "Jumlah kepala keluarga yang tidak memiliki pekerjaan / Pengangguran",
            },
            {
                key: "keuangan_tanpa_kerja_tetap",
                label: "Jumlah kepala keluarga yang tidak memiliki pekerjaan tetap",
            },
            {
                key: "keuangan_penghasilan_tetap",
                label: "Jumlah Kepala Keluarga yang memiliki penghasilan tetap",
            },
            {
                key: "keuangan_tabulin",
                label: "Jumlah Ibu hamil yang mempunyai tabungan bersalin (TABULIN)",
            },
            {
                key: "keuangan_tabungan",
                label: "Jumlah keluarga yang memiliki tabungan",
            },
            {
                key: "keuangan_aset",
                label: "Jumlah keluarga yang mempunyai aset untuk investasi",
            },
        ],
    },
    {
        title: "Program Gerakan Keluarga Sehat Tanggap dan Tangguh Bencana Mewujudkan Keluarga Sehat Pasangan Usia Subur (PUS)",
        fields: [
            {
                key: "pus_lahir_sehat",
                label: "Jumlah Ibu melahirkan Bayi sehat",
            },
            { key: "pus_wanita_kb", label: "Jumlah wanita sebagai peserta KB" },
            { key: "pus_pria_kb", label: "Jumlah pria peserta KB" },
            {
                key: "pus_reproduksi",
                label: "Jumlah Pasangan Usia Subur (PUS) yang memiliki masalah kesehatan reproduksi",
            },
            {
                key: "pus_nikah_dini",
                label: "Jumlah Pasangan Usia Subur (PUS) yang menikah dengan istri usia dibawah usia 19 Tahun",
            },
            {
                key: "pus_hamil_beresiko",
                label: "Jumlah Wanita Usia Subur dengan kehamilan beresiko",
            },
            {
                key: "pus_ims",
                label: "Jumlah penderita penyakit infeksi menular seksual pada Pasangan Usia Subur (PUS)",
            },
        ],
    },
];

const SEMESTERS = ["I", "II"];

export default function DataDukung({
    dukung,
    program,
    year,
    years,
    onYearChange,
    semester,
    semesters = SEMESTERS,
    onSemesterChange,
}: Props) {
    // Kecamatan terpilih: 1 kecamatan = tabel A + B nya nyatu.
    const [selectedKec, setSelectedKec] = useState("semua");
    const kecOptions = useMemo(
        () => uniqueKecamatan([...dukung, ...program]),
        [dukung, program]
    );
    useEffect(() => {
        if (selectedKec !== "semua" && !kecOptions.includes(selectedKec)) {
            setSelectedKec("semua");
        }
    }, [kecOptions, selectedKec]);

    const dukungFiltered =
        selectedKec === "semua"
            ? dukung
            : dukung.filter(
                  (r) => kecamatanDisplayName(r) === selectedKec
              );
    const programFiltered =
        selectedKec === "semua"
            ? program
            : program.filter(
                  (r) => kecamatanDisplayName(r) === selectedKec
              );

    // Kolom tahun dinamis: gabungan tahun yang ada di data + tahun filter.
    const tableYears = useMemo(() => {
        const set = new Set<number>();
        [...dukungFiltered, ...programFiltered].forEach((row) => {
            const t = Number(row.tahun);
            if (Number.isFinite(t)) set.add(t);
        });
        set.add(year);
        return Array.from(set).sort((a, b) => a - b);
    }, [dukungFiltered, programFiltered, year]);

    const pivotDukung = useMemo(
        () => buildPivot(dukungFiltered),
        [dukungFiltered]
    );
    const pivotProgram = useMemo(
        () => buildPivot(programFiltered),
        [programFiltered]
    );
    const dukungKec = useMemo(
        () => uniqueKecamatan(dukungFiltered),
        [dukungFiltered]
    );
    const programKec = useMemo(
        () => uniqueKecamatan(programFiltered),
        [programFiltered]
    );

    const str = (v: unknown) =>
        v === null || v === undefined || v === "" ? "—" : String(v);

    const cell = (
        lookup: ReturnType<typeof buildPivot>,
        kec: string,
        t: number,
        s: string,
        key: string
    ): string => {
        const row = lookup(kec, t, s);
        if (
            !row ||
            row[key] === null ||
            row[key] === undefined ||
            row[key] === ""
        ) {
            return "–";
        }
        return formatValue(row[key]);
    };

    const isActiveCell = (t: number, s: string) =>
        t === year && s === semester;

    const thBase =
        "border border-slate-300 px-2 py-2 text-center text-xs font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200";
    const tdNum =
        "border border-slate-200 px-2 py-1.5 text-center text-xs tabular-nums text-slate-600 dark:border-slate-700 dark:text-slate-300";
    const tdVal =
        "border border-slate-200 px-2 py-1.5 text-center text-sm tabular-nums min-w-[64px] text-slate-700 dark:border-slate-700 dark:text-slate-200";

    const fokusDukung = dukungFiltered.filter(
        (r) => Number(r.tahun) === year && String(r.semester) === semester
    );
    const fokusProgram = programFiltered.filter(
        (r) => Number(r.tahun) === year && String(r.semester) === semester
    );

    const kop = (dukungFiltered[0] ??
        programFiltered[0] ??
        dukung[0] ??
        program[0] ?? {}) as Pokja4DataRow;
    const programRowCount =
        programGroups.length +
        programGroups.reduce((n, g) => n + g.fields.length, 0);

    return (
        <TabPageLayout
            title="Data Dukung"
            description="Laporan data dukung dan pelaksanaan GKS Tanggap dan Tangguh Bencana — A. Data Dukung + B. Data Program."
            year={year}
            years={years}
            onYearChange={onYearChange}
            semester={semester}
            semesters={semesters}
            onSemesterChange={onSemesterChange}
            kecamatan={selectedKec}
            kecamatanList={kecOptions}
            onKecamatanChange={setSelectedKec}
        >
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700 sm:px-6">
                <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                        Laporan Data Dukung dan Pelaksanaan GKS Tanggap dan
                        Tangguh Bencana — Bidang Kesehatan Keluarga dan
                        Lingkungan, Pokja IV
                    </p>
                    <p className="mt-1">
                        {str(kop.provinsi ?? "—")} ·{" "}
                        {str(kop.kabupaten_kota ?? "Kab. Tasikmalaya")} ·
                        Semester {semester} Tahun {year}
                    </p>
                </div>
            </div>

            {/* ─── A. DATA DUKUNG ─── */}
            <Card className="overflow-hidden dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        A. Data dukung per kecamatan
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Kolom tahun mengikuti data. Kolom tahun {year} semester{" "}
                        {semester} ditandai.
                    </p>
                </div>
                {dukungKec.length > 0 ? (
                    dukungKec.map((kec, ki) => {
                        const focus =
                            pivotDukung(kec, year, semester) ??
                            dukungFiltered.find(
                                (r) => kecamatanDisplayName(r) === kec
                            );
                        return (
                            <details
                                key={kec}
                                open={dukungKec.length <= 3}
                                className="group border-b border-slate-100 last:border-b-0 dark:border-slate-700"
                            >
                                <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/40 sm:px-6 [&::-webkit-details-marker]:hidden">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold tabular-nums text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                                        {ki + 1}
                                    </span>
                                    <div className="min-w-0">
                                        <h4 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                            {kec}
                                        </h4>
                                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                            Semester {semester} Tahun {year}
                                        </p>
                                    </div>
                                    <span className="ml-auto shrink-0 text-xs font-medium text-slate-500 group-open:hidden dark:text-slate-400">
                                        Lihat tabel
                                    </span>
                                    <span className="ml-auto hidden shrink-0 text-xs font-medium text-slate-500 group-open:inline dark:text-slate-400">
                                        Tutup
                                    </span>
                                </summary>
                                <div className="overflow-x-auto px-5 pb-4 sm:px-6">
                                    <table className="w-full min-w-[1100px] border-collapse">
                                        <thead>
                                            <tr>
                                                <th
                                                    rowSpan={2}
                                                    className={`${thBase} sticky left-0 w-10 min-w-10 max-w-10 bg-slate-100 dark:bg-slate-700`}
                                                >
                                                    NO
                                                </th>
                                                <th
                                                    rowSpan={2}
                                                    className={`${thBase} sticky left-10 min-w-[240px] bg-slate-100 text-left dark:bg-slate-700`}
                                                >
                                                    DATA UMUM YANG DIMONITOR
                                                </th>
                                                {tableYears.map((t) => (
                                                    <th
                                                        key={t}
                                                        colSpan={2}
                                                        className={`${thBase} bg-slate-100 ${
                                                            t === year
                                                                ? "bg-teal-100 dark:bg-teal-950"
                                                                : "dark:bg-slate-700"
                                                        }`}
                                                    >
                                                        {t}
                                                    </th>
                                                ))}
                                                <th
                                                    rowSpan={2}
                                                    className={`${thBase} min-w-[140px] bg-slate-100 dark:bg-slate-700`}
                                                >
                                                    EVALUASI
                                                </th>
                                                <th
                                                    rowSpan={2}
                                                    className={`${thBase} min-w-[140px] bg-slate-100 dark:bg-slate-700`}
                                                >
                                                    KETERANGAN
                                                </th>
                                            </tr>
                                            <tr>
                                                {tableYears.map((t) =>
                                                    SEMESTERS.map((s) => (
                                                        <th
                                                            key={`${t}-${s}`}
                                                            className={`${thBase} w-14 bg-slate-50 ${
                                                                isActiveCell(
                                                                    t,
                                                                    s
                                                                )
                                                                    ? "bg-teal-100 dark:bg-teal-950"
                                                                    : "dark:bg-slate-800"
                                                            }`}
                                                        >
                                                            {s}
                                                        </th>
                                                    ))
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dukungIndicators.map((f, i) => (
                                                <tr
                                                    key={f.key}
                                                    className={
                                                        i % 2 === 1
                                                            ? "bg-slate-50/70 dark:bg-slate-900/30"
                                                            : ""
                                                    }
                                                >
                                                    <td
                                                        className={`${tdNum} sticky left-0 w-10 min-w-10 max-w-10 bg-white dark:bg-slate-800`}
                                                    >
                                                        {i + 1}.
                                                    </td>
                                                    <td className="sticky left-10 border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                        {f.label}
                                                    </td>
                                                    {tableYears.map((t) =>
                                                        SEMESTERS.map((s) => (
                                                            <td
                                                                key={`${t}-${s}`}
                                                                className={`${tdVal} ${
                                                                    isActiveCell(
                                                                        t,
                                                                        s
                                                                    )
                                                                        ? "bg-teal-50/60 dark:bg-teal-950/30"
                                                                        : ""
                                                                }`}
                                                            >
                                                                {cell(
                                                                    pivotDukung,
                                                                    kec,
                                                                    t,
                                                                    s,
                                                                    f.key
                                                                )}
                                                            </td>
                                                        ))
                                                    )}
                                                    {i === 0 && (
                                                        <td
                                                            rowSpan={
                                                                dukungIndicators.length
                                                            }
                                                            className="border border-slate-200 px-2 py-1.5 align-top text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300"
                                                        >
                                                            {str(
                                                                focus?.evaluasi
                                                            )}
                                                        </td>
                                                    )}
                                                    {i === 0 && (
                                                        <td
                                                            rowSpan={
                                                                dukungIndicators.length
                                                            }
                                                            className="border border-slate-200 px-2 py-1.5 align-top text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300"
                                                        >
                                                            {str(
                                                                focus?.keterangan
                                                            )}
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </details>
                        );
                    })
                ) : (
                    <p className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                        Belum ada data dukung untuk tahun {year} semester{" "}
                        {semester}.
                    </p>
                )}
                {fokusDukung.length > 0 && (
                    <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-700/60 dark:text-slate-200">
                        {fokusDukung.length} kecamatan · Semester {semester}{" "}
                        {year}
                        <span className="px-2 text-slate-300 dark:text-slate-500">
                            ·
                        </span>
                        Total penduduk{" "}
                        {formatValue(sumField(fokusDukung, "jumlah_penduduk"))}
                        <span className="px-2 text-slate-300 dark:text-slate-500">
                            ·
                        </span>
                        Total KK{" "}
                        {formatValue(
                            sumField(fokusDukung, "jumlah_kepala_keluarga")
                        )}
                    </div>
                )}
            </Card>

            {/* ─── B. DATA PROGRAM ─── */}
            <Card className="overflow-hidden dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        B. Data program per kecamatan
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Kolom tahun mengikuti data. Kolom tahun {year} semester{" "}
                        {semester} ditandai.
                    </p>
                </div>
                {programKec.length > 0 ? (
                    programKec.map((kec, ki) => {
                        const focus =
                            pivotProgram(kec, year, semester) ??
                            programFiltered.find(
                                (r) => kecamatanDisplayName(r) === kec
                            );
                        let rowNo = 0;
                        return (
                            <details
                                key={kec}
                                open={programKec.length <= 3}
                                className="group border-b border-slate-100 last:border-b-0 dark:border-slate-700"
                            >
                                <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/40 sm:px-6 [&::-webkit-details-marker]:hidden">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold tabular-nums text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                                        {ki + 1}
                                    </span>
                                    <div className="min-w-0">
                                        <h4 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                            {kec}
                                        </h4>
                                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                            Semester {semester} Tahun {year}
                                        </p>
                                    </div>
                                    <span className="ml-auto shrink-0 text-xs font-medium text-slate-500 group-open:hidden dark:text-slate-400">
                                        Lihat tabel
                                    </span>
                                    <span className="ml-auto hidden shrink-0 text-xs font-medium text-slate-500 group-open:inline dark:text-slate-400">
                                        Tutup
                                    </span>
                                </summary>
                                <div className="px-5 pb-4 sm:px-6">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr>
                                                <th
                                                    rowSpan={2}
                                                    className={`${thBase} w-10 min-w-10 max-w-10 bg-slate-100 dark:bg-slate-700`}
                                                >
                                                    NO
                                                </th>
                                                <th
                                                    rowSpan={2}
                                                    className={`${thBase} min-w-[180px] bg-slate-100 text-left dark:bg-slate-700`}
                                                >
                                                    DATA UTAMA YANG DI MONITOR
                                                </th>
                                                {tableYears.map((t) => (
                                                    <th
                                                        key={t}
                                                        colSpan={2}
                                                        className={`${thBase} bg-slate-100 ${
                                                            t === year
                                                                ? "bg-teal-100 dark:bg-teal-950"
                                                                : "dark:bg-slate-700"
                                                        }`}
                                                    >
                                                        {t}
                                                    </th>
                                                ))}
                                                <th
                                                    rowSpan={2}
                                                    className={`${thBase} min-w-[140px] bg-slate-100 dark:bg-slate-700`}
                                                >
                                                    EVALUASI
                                                </th>
                                            </tr>
                                            <tr>
                                                {tableYears.map((t) =>
                                                    SEMESTERS.map((s) => (
                                                        <th
                                                            key={`${t}-${s}`}
                                                            className={`${thBase} w-14 bg-slate-50 ${
                                                                isActiveCell(
                                                                    t,
                                                                    s
                                                                )
                                                                    ? "bg-teal-100 dark:bg-teal-950"
                                                                    : "dark:bg-slate-800"
                                                            }`}
                                                        >
                                                            {s}
                                                        </th>
                                                    ))
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {programGroups.map((group, gi) => (
                                                <React.Fragment
                                                    key={group.title}
                                                >
                                                    <tr>
                                                        <td
                                                            className={`${tdNum} w-10 min-w-10 max-w-10 bg-slate-100 font-bold dark:bg-slate-700`}
                                                        >
                                                            {["I","II","III","IV","V","VI","VII","VIII","IX"][gi]}
                                                        </td>
                                                        <td
                                                            colSpan={
                                                                tableYears.length *
                                                                    2 +
                                                                2
                                                            }
                                                            className="whitespace-normal break-words border border-slate-200 bg-slate-100 px-2 py-1.5 text-left text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200"
                                                        >
                                                            {group.title}
                                                        </td>
                                                    </tr>
                                                    {group.fields.map(
                                                        (f) => {
                                                            rowNo += 1;
                                                            const showEval =
                                                                rowNo === 1;
                                                            return (
                                                                <tr
                                                                    key={f.key}
                                                                    className={
                                                                        rowNo %
                                                                            2 ===
                                                                        0
                                                                            ? "bg-slate-50/70 dark:bg-slate-900/30"
                                                                            : ""
                                                                    }
                                                                >
                                                                    <td
                                                                        className={`${tdNum} w-10 min-w-10 max-w-10 bg-white dark:bg-slate-800`}
                                                                    >
                                                                        {
                                                                            group.fields.indexOf(
                                                                                f
                                                                            ) + 1
                                                                        }
                                                                    </td>
                                                                    <td className="min-w-[180px] whitespace-normal break-words border border-slate-200 bg-white px-2 py-1.5 text-left text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                                        {
                                                                            f.label
                                                                        }
                                                                    </td>
                                                                    {tableYears.map(
                                                                        (t) =>
                                                                            SEMESTERS.map(
                                                                                (
                                                                                    s
                                                                                ) => (
                                                                                    <td
                                                                                        key={`${t}-${s}`}
                                                                                        className={`${tdVal} ${
                                                                                            isActiveCell(
                                                                                                t,
                                                                                                s
                                                                                            )
                                                                                                ? "bg-teal-50/60 dark:bg-teal-950/30"
                                                                                                : ""
                                                                                        }`}
                                                                                    >
                                                                                        {cell(
                                                                                            pivotProgram,
                                                                                            kec,
                                                                                            t,
                                                                                            s,
                                                                                            f.key
                                                                                        )}
                                                                                    </td>
                                                                                )
                                                                            )
                                                                    )}
                                                                    {showEval && (
                                                                        <td
                                                                            rowSpan={
                                                                                programRowCount
                                                                            }
                                                                            className="min-w-[100px] max-w-[180px] whitespace-normal break-words border border-slate-200 px-2 py-1.5 align-top text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300"
                                                                        >
                                                                            {str(
                                                                                focus?.evaluasi
                                                                            )}
                                                                        </td>
                                                                    )}
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </details>
                        );
                    })
                ) : (
                    <p className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                        Belum ada data program untuk tahun {year} semester{" "}
                        {semester}.
                    </p>
                )}
                {fokusProgram.length > 0 && (
                    <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-700/60 dark:text-slate-200">
                        {fokusProgram.length} kecamatan · Semester {semester}{" "}
                        {year}
                        <span className="px-2 text-slate-300 dark:text-slate-500">
                            ·
                        </span>
                        Total balita stunting{" "}
                        {formatValue(
                            sumField(fokusProgram, "stunting_balita_stunting")
                        )}
                        <span className="px-2 text-slate-300 dark:text-slate-500">
                            ·
                        </span>
                        Total kasus diare{" "}
                        {formatValue(sumField(fokusProgram, "phbs_diare"))}
                    </div>
                )}
            </Card>
        </TabPageLayout>
    );
}
