import React from "react";
import TextInput from "@/Components/Form/TextInput";

// Konfigurasi field form Pokja II — cermin format tabel publik
// (Frontend/data-data/Pokja2.tsx) + 3 pelatihan & identitas yang
// tampil di Index backend. Satu sumber agar Create/Edit tak dryak.
export interface Pokja2Field {
    key: string;
    label: string;
}

export interface Pokja2Group {
    title: string;
    fields: Pokja2Field[];
}

export const POKJA2_NUMERIK_KEYS: string[] = [
    "warga_buta_l",
    "warga_buta_p",
    "kelompok_belajar_paket_a",
    "warga_belajar_paket_a",
    "kelompok_belajar_paket_b",
    "warga_belajar_paket_b",
    "kelompok_belajar_paket_c",
    "warga_belajar_paket_c",
    "kf",
    "warga_belajar_kf",
    "paud",
    "taman_bacaan",
    "kelompok_bkb",
    "peserta_bkb",
    "ibu_set_bkb",
    "ape_bkb",
    "kelompok_simulasi_bkb",
    "tutor_kf",
    "tutor_paud",
    "kader_bkb",
    "kelompok_kader_koperasi",
    "kader_keterampilan",
    "kader_dilatih_pengelolaan",
    "kader_dilatih_tp_pkk",
    "kader_dilatih_damas",
    "lp3_pkk",
    "tp3_pkk",
    "damas_pkk",
    "up2k_pemula_kelompok",
    "up2k_pemula_peserta",
    "up2k_madya_kelompok",
    "up2k_madya_peserta",
    "up2k_utama_kelompok",
    "up2k_utama_peserta",
    "up2k_mandiri_kelompok",
    "up2k_mandiri_peserta",
    "koperasi_berbadan_hukum",
    "anggota_koperasi",
];

export const POKJA2_GROUPS: Pokja2Group[] = [
    {
        title: "Pendidikan Keterampilan",
        fields: [
            { key: "warga_buta_l", label: "Warga Buta (L)" },
            { key: "warga_buta_p", label: "Warga Buta (P)" },
            { key: "kelompok_belajar_paket_a", label: "Paket A — Jml. KLP" },
            { key: "warga_belajar_paket_a", label: "Paket A — Belajar" },
            { key: "kelompok_belajar_paket_b", label: "Paket B — Jml. KLP" },
            { key: "warga_belajar_paket_b", label: "Paket B — Belajar" },
            { key: "kelompok_belajar_paket_c", label: "Paket C — Jml. KLP" },
            { key: "warga_belajar_paket_c", label: "Paket C — Belajar" },
            { key: "kf", label: "KF — Jml. KLP" },
            { key: "warga_belajar_kf", label: "KF — Belajar" },
            { key: "paud", label: "PAUD Sejenis" },
            { key: "taman_bacaan", label: "Taman Bacaan/Perpustakaan" },
        ],
    },
    {
        title: "Jumlah Kader Khusus",
        fields: [
            { key: "kelompok_bkb", label: "BKB — Jml. KLP" },
            { key: "peserta_bkb", label: "BKB — Peserta" },
            { key: "ibu_set_bkb", label: "BKB — Jml. Ibu (SET)" },
            { key: "ape_bkb", label: "BKB — Jml. APE" },
            { key: "kelompok_simulasi_bkb", label: "BKB — Simulasi" },
            { key: "tutor_kf", label: "Tutor — KF" },
            { key: "tutor_paud", label: "Tutor — PAUD Sejenis" },
            { key: "kader_bkb", label: "Kader — BKB" },
            { key: "kelompok_kader_koperasi", label: "Kader — Koperasi" },
            { key: "kader_keterampilan", label: "Kader — Keterampilan" },
            { key: "lp3_pkk", label: "LP3 PKK" },
            { key: "tp3_pkk", label: "TP3 PKK" },
            { key: "damas_pkk", label: "Damas PKK" },
        ],
    },
    {
        title: "Pelatihan Kader (Pelengkap Index)",
        fields: [
            { key: "kader_dilatih_pengelolaan", label: "Dilatih Pengelolaan" },
            { key: "kader_dilatih_tp_pkk", label: "Dilatih TP PKK" },
            { key: "kader_dilatih_damas", label: "Dilatih DAMAS" },
        ],
    },
    {
        title: "Pengembangan Kehidupan Berkoperasi",
        fields: [
            { key: "up2k_pemula_kelompok", label: "UP2K Pemula — Jml. Klp" },
            { key: "up2k_pemula_peserta", label: "UP2K Pemula — Peserta" },
            { key: "up2k_madya_kelompok", label: "UP2K Madya — Jml. Klp" },
            { key: "up2k_madya_peserta", label: "UP2K Madya — Peserta" },
            { key: "up2k_utama_kelompok", label: "UP2K Utama — Jml. Klp" },
            { key: "up2k_utama_peserta", label: "UP2K Utama — Peserta" },
            { key: "up2k_mandiri_kelompok", label: "UP2K Mandiri — Jml. Klp" },
            { key: "up2k_mandiri_peserta", label: "UP2K Mandiri — Peserta" },
            { key: "koperasi_berbadan_hukum", label: "Koperasi Berbadan Hukum" },
            { key: "anggota_koperasi", label: "Jml. Anggota Koperasi" },
        ],
    },
];

interface BodyProps {
    data: Record<string, any>;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
}

/** Badan form angka Pokja II — dipakai Create & Edit. */
export function Pokja2FormBody({ data, setData, errors }: BodyProps) {
    return (
        <>
            {POKJA2_GROUPS.map((group) => (
                <div key={group.title}>
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-3">
                        {group.title}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {group.fields.map((field) => (
                            <div key={field.key}>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                                    {field.label}
                                </label>
                                <TextInput
                                    type="number"
                                    min="0"
                                    value={data[field.key] ?? 0}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setData(field.key, e.target.value === "" ? 0 : Number(e.target.value))
                                    }
                                    className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                />
                                {errors[field.key] && (
                                    <p className="text-xs text-rose-500 mt-1">{errors[field.key]}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
}
