import React from "react";
import Card from "@/Components/UI/Card";
import DataDisclosure from "./DataDisclosure";
import TabPageLayout from "./TabPageLayout";
import {
    formatValue,
    Pokja4DataRow,
    sumField,
} from "./Pokja4TabUtils";

interface Props {
    data: Pokja4DataRow[];
    year: number;
    years: number[];
    onYearChange: (year: number) => void;
}

const groups: Array<{
    label: string;
    fields: Array<{ key: string; label: string }>;
}> = [
    {
        label: "Ibu",
        fields: [
            { key: "ibu_hamil", label: "Hamil" },
            { key: "ibu_melahirkan", label: "Melahirkan" },
            { key: "ibu_nifas", label: "Nifas" },
            { key: "ibu_meninggal", label: "Meninggal" },
        ],
    },
    {
        label: "Bayi lahir",
        fields: [
            { key: "bayi_lahir_l", label: "L" },
            { key: "bayi_lahir_p", label: "P" },
            { key: "akte_ada", label: "Akte ada" },
            { key: "akte_tidak", label: "Akte tidak ada" },
        ],
    },
    {
        label: "Bayi meninggal",
        fields: [
            { key: "bayi_meninggal_l", label: "L" },
            { key: "bayi_meninggal_p", label: "P" },
        ],
    },
    {
        label: "Balita meninggal",
        fields: [
            { key: "balita_meninggal_l", label: "L" },
            { key: "balita_meninggal_p", label: "P" },
        ],
    },
];

export default function Rekapitulasi({
    data,
    year,
    years,
    onYearChange,
}: Props) {
    return (
        <TabPageLayout
            title="Rekapitulasi"
            description="Ringkasan data ibu, kelahiran, dan kematian per kecamatan."
            year={year}
            years={years}
            onYearChange={onYearChange}
        >
            <Card className="overflow-hidden dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Data rekapitulasi per kecamatan
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Pilih kecamatan untuk melihat rincian indikator.
                    </p>
                </div>
                {data.length > 0 ? (
                    data.map((row, index) => (
                        <DataDisclosure
                            key={String(row.id ?? `${row.kecamatan}-${index}`)}
                            number={index + 1}
                            title={String(
                                row.kecamatan || "Kecamatan belum ditentukan"
                            )}
                            description={`Rekapitulasi · ${year}`}
                            metrics={[
                                {
                                    label: "Ibu hamil",
                                    value: formatValue(row.ibu_hamil),
                                },
                                {
                                    label: "Bayi lahir",
                                    value: formatValue(
                                        Number(row.bayi_lahir_l || 0) +
                                            Number(row.bayi_lahir_p || 0)
                                    ),
                                },
                                {
                                    label: "Akte tersedia",
                                    value: formatValue(row.akte_ada),
                                },
                                {
                                    label: "Ibu melahirkan",
                                    value: formatValue(row.ibu_melahirkan),
                                },
                            ]}
                            groups={groups.map((group) => ({
                                title: group.label,
                                fields: group.fields.map((field) => ({
                                    label: field.label,
                                    value: formatValue(row[field.key]),
                                })),
                            }))}
                        />
                    ))
                ) : (
                    <p className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                        Belum ada data rekapitulasi untuk tahun {year}.
                    </p>
                )}
                {data.length > 0 && (
                    <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-700/60 dark:text-slate-200">
                        {data.length} kecamatan
                        <span className="px-2 text-slate-300 dark:text-slate-500">·</span>
                        Total ibu hamil {formatValue(sumField(data, "ibu_hamil"))}
                        <span className="px-2 text-slate-300 dark:text-slate-500">·</span>
                        Total bayi lahir {formatValue(sumField(data, "bayi_lahir_l") + sumField(data, "bayi_lahir_p"))}
                    </div>
                )}
            </Card>
        </TabPageLayout>
    );
}
