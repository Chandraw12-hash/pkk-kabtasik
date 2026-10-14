import React from "react";
import TextInput from "@/Components/Form/TextInput";

// Konfigurasi field form Pokja III — cermin format 20 kolom tabel publik
// (Frontend/data-data/Pokja3.tsx). Satu sumber agar Create/Edit tak dryak.
export interface Pokja3Field {
    key: string;
    label: string;
}

export interface Pokja3Group {
    title: string;
    fields: Pokja3Field[];
}

export const POKJA3_NUMERIK_KEYS: string[] = [
    "jumlah_kader",
    "jumlah_kader_p",
    "kader_tata_laksana",
    "makanan_pokok",
    "makanan_non_beras",
    "peternakan",
    "perikanan",
    "warung_hidup",
    "lumbung_hidup",
    "toga",
    "tanaman_keras",
    "tanaman_lainnya",
    "industri_pangan",
    "industri_sandang",
    "industri_jasa",
    "rumah_sehat",
    "rumah_tidak_sehat",
];

export const POKJA3_GROUPS: Pokja3Group[] = [
    {
        title: "Jumlah Kader (Kolom 3–5)",
        fields: [
            { key: "jumlah_kader", label: "Kader Pangan" },
            { key: "jumlah_kader_p", label: "Kader Sandang" },
            { key: "kader_tata_laksana", label: "Kader Tata Laksana RT" },
        ],
    },
    {
        title: "Pangan — Makanan Pokok (Kolom 6–7)",
        fields: [
            { key: "makanan_pokok", label: "Beras" },
            { key: "makanan_non_beras", label: "Non Beras" },
        ],
    },
    {
        title: "Pangan — Hatinya PKK (Kolom 8–14)",
        fields: [
            { key: "peternakan", label: "Peternakan" },
            { key: "perikanan", label: "Perikanan" },
            { key: "warung_hidup", label: "Warung Hidup" },
            { key: "lumbung_hidup", label: "Lumbung Hidup" },
            { key: "toga", label: "TOGA" },
            { key: "tanaman_keras", label: "Tanaman Keras" },
            { key: "tanaman_lainnya", label: "Tanaman Lainnya" },
        ],
    },
    {
        title: "Jumlah Industri Rumah Tangga (Kolom 15–17)",
        fields: [
            { key: "industri_pangan", label: "Pangan" },
            { key: "industri_sandang", label: "Sandang" },
            { key: "industri_jasa", label: "Jasa" },
        ],
    },
    {
        title: "Jumlah Rumah (Kolom 18–19)",
        fields: [
            { key: "rumah_sehat", label: "Sehat dan Layak Huni" },
            { key: "rumah_tidak_sehat", label: "Tidak Sehat dan Tidak Layak Huni" },
        ],
    },
];

interface BodyProps {
    data: Record<string, any>;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
}

/** Badan form angka Pokja III — dipakai Create & Edit. */
export function Pokja3FormBody({ data, setData, errors }: BodyProps) {
    return (
        <>
            {POKJA3_GROUPS.map((group) => (
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
