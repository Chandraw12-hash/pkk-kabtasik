import React from "react";
import TextInput from "@/Components/Form/TextInput";

// Konfigurasi 6 program Pokja I — cermin format tabel publik
// (Frontend/data-data/Pokja1.tsx): kegiatan, volume, metode, sasaran.
// Satu sumber agar Create/Edit tak dryak.
export const POKJA1_PROGRAMS: Array<{ key: string; label: string }> = [
    { key: "kisah", label: "KISAH" },
    { key: "kilas", label: "KILAS" },
    { key: "krisan", label: "KRISAN" },
    { key: "kiat", label: "KIAT" },
    { key: "kisak", label: "KISAK" },
    { key: "pkbn", label: "PKBN" },
];

interface BodyProps {
    data: Record<string, any>;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
}

/** Badan form 6 program Pokja I — dipakai Create & Edit. */
export function Pokja1FormBody({ data, setData, errors }: BodyProps) {
    return (
        <>
            {POKJA1_PROGRAMS.map((program) => (
                <div
                    key={program.key}
                    className="border border-slate-100 dark:border-slate-700 rounded-xl p-4"
                >
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">
                        {program.label}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                                Kegiatan
                            </label>
                            <TextInput
                                placeholder={`Contoh: Kegiatan ${program.label}`}
                                value={data[`${program.key}_kegiatan`] ?? ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setData(`${program.key}_kegiatan`, e.target.value)
                                }
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors[`${program.key}_kegiatan`] && (
                                <p className="text-xs text-rose-500 mt-1">{errors[`${program.key}_kegiatan`]}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                                Volume
                            </label>
                            <TextInput
                                type="number"
                                min="0"
                                value={data[`${program.key}_volume`] ?? 0}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setData(`${program.key}_volume`, e.target.value === "" ? 0 : Number(e.target.value))
                                }
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors[`${program.key}_volume`] && (
                                <p className="text-xs text-rose-500 mt-1">{errors[`${program.key}_volume`]}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                                Sasaran
                            </label>
                            <TextInput
                                type="number"
                                min="0"
                                value={data[`${program.key}_sasaran`] ?? 0}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setData(`${program.key}_sasaran`, e.target.value === "" ? 0 : Number(e.target.value))
                                }
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors[`${program.key}_sasaran`] && (
                                <p className="text-xs text-rose-500 mt-1">{errors[`${program.key}_sasaran`]}</p>
                            )}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                                Metode
                            </label>
                            <TextInput
                                placeholder="Contoh: Penyuluhan, Pelatihan"
                                value={data[`${program.key}_metode`] ?? ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setData(`${program.key}_metode`, e.target.value)
                                }
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors[`${program.key}_metode`] && (
                                <p className="text-xs text-rose-500 mt-1">{errors[`${program.key}_metode`]}</p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
