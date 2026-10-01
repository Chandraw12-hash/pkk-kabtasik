import React, { useMemo } from "react";
import Card from "@/Components/UI/Card";
import DataDisclosure from "./DataDisclosure";
import TabPageLayout from "./TabPageLayout";
import {
    aggregateByMonth,
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

const groups = [
    {
        title: "Pengunjung",
        fields: [
            { key: "bayi_0_12_l", label: "Bayi usia 0–12 bulan (L)" },
            { key: "bayi_0_12_p", label: "Bayi usia 0–12 bulan (P)" },
            { key: "balita_1_5_l", label: "Balita usia 1–5 tahun (L)" },
            { key: "balita_1_5_p", label: "Balita usia 1–5 tahun (P)" },
        ],
    },
    {
        title: "Ibu & keluarga",
        fields: [
            { key: "wus", label: "WUS" },
            { key: "pus", label: "PUS" },
            { key: "ibu_hamil", label: "Ibu hamil" },
            { key: "ibu_menyusui", label: "Ibu menyusui" },
        ],
    },
    {
        title: "Kelahiran & kematian",
        fields: [
            { key: "bayi_lahir", label: "Bayi lahir" },
            { key: "bayi_meninggal", label: "Bayi meninggal" },
            { key: "kematian_ibu", label: "Kematian ibu" },
        ],
    },
    {
        title: "Petugas",
        fields: [
            { key: "petugas_kader", label: "Kader" },
            { key: "petugas_plkb", label: "PLKB" },
            { key: "petugas_medis", label: "Petugas medis" },
        ],
    },
];
const fields = groups.flatMap((group) => group.fields);

export default function KunjunganPyd({
    data,
    year,
    years,
    onYearChange,
}: Props) {
    const monthlyData = useMemo(
        () => aggregateByMonth(data, fields.map((field) => field.key)),
        [data]
    );

    return (
        <TabPageLayout
            title="Kunjungan PYD"
            description="Rekap kunjungan dan layanan per bulan dari seluruh kecamatan."
            year={year}
            years={years}
            onYearChange={onYearChange}
        >
            <Card className="overflow-hidden dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Data kunjungan per bulan
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Pilih satu bulan untuk melihat rincian seluruh indikator.
                    </p>
                </div>
                {monthlyData.length > 0 ? (
                    monthlyData.map((row, index) => (
                        <DataDisclosure
                            key={row.bulan}
                            number={index + 1}
                            title={row.nama_bulan}
                            description={`Rekap bulanan · ${year}`}
                            metrics={[
                                {
                                    label: "Bayi",
                                    value: formatValue(
                                        Number(row.bayi_0_12_l || 0) +
                                            Number(row.bayi_0_12_p || 0)
                                    ),
                                },
                                {
                                    label: "Balita",
                                    value: formatValue(
                                        Number(row.balita_1_5_l || 0) +
                                            Number(row.balita_1_5_p || 0)
                                    ),
                                },
                                {
                                    label: "Ibu hamil",
                                    value: formatValue(row.ibu_hamil),
                                },
                                {
                                    label: "Bayi lahir",
                                    value: formatValue(row.bayi_lahir),
                                },
                            ]}
                            groups={groups.map((group) => ({
                                title: group.title,
                                fields: group.fields.map((field) => ({
                                    label: field.label,
                                    value: formatValue(row[field.key]),
                                })),
                            }))}
                        />
                    ))
                ) : (
                    <p className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                        Belum ada data kunjungan PYD untuk tahun {year}.
                    </p>
                )}
                {monthlyData.length > 0 && (
                    <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-700/60 dark:text-slate-200">
                        Total bayi {formatValue(sumField(monthlyData, "bayi_0_12_l") + sumField(monthlyData, "bayi_0_12_p"))}
                        <span className="px-2 text-slate-300 dark:text-slate-500">·</span>
                        Balita {formatValue(sumField(monthlyData, "balita_1_5_l") + sumField(monthlyData, "balita_1_5_p"))}
                        <span className="px-2 text-slate-300 dark:text-slate-500">·</span>
                        Ibu hamil {formatValue(sumField(monthlyData, "ibu_hamil"))}
                    </div>
                )}
            </Card>
        </TabPageLayout>
    );
}
