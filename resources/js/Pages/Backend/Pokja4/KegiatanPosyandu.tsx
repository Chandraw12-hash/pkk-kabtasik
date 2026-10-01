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

const groups: Array<{
    label: string;
    fields: Array<{ key: string; label: string }>;
}> = [
    {
        label: "Ibu",
        fields: [
            { key: "ibu_hamil", label: "Hamil" },
            { key: "ibu_hamil_diperiksa", label: "Diperiksa" },
            { key: "ibu_hamil_dapat_fe", label: "Dapat Fe" },
            { key: "menyusui", label: "Menyusui" },
        ],
    },
    {
        label: "Akseptor KB",
        fields: [
            { key: "kb_iud", label: "IUD" },
            { key: "kb_mow", label: "MOW" },
            { key: "kb_mop", label: "MOP" },
            { key: "kb_implan", label: "Implan" },
            { key: "kb_pil", label: "Pil" },
            { key: "kb_suntik", label: "Suntik" },
            { key: "kb_kondom", label: "Kondom" },
        ],
    },
    {
        label: "Balita",
        fields: [
            { key: "balita_l", label: "L" },
            { key: "balita_p", label: "P" },
            { key: "balita_kia_l", label: "KIA L" },
            { key: "balita_kia_p", label: "KIA P" },
            { key: "balita_ditimbang_l", label: "Ditimbang L" },
            { key: "balita_ditimbang_p", label: "Ditimbang P" },
            { key: "balita_naik_l", label: "Naik L" },
            { key: "balita_naik_p", label: "Naik P" },
        ],
    },
    {
        label: "Vitamin A",
        fields: [
            { key: "vit_a_1", label: "Dosis 1" },
            { key: "vit_a_2", label: "Dosis 2" },
        ],
    },
    {
        label: "Imunisasi",
        fields: [
            { key: "imunisasi_tt_1", label: "TT 1" },
            { key: "imunisasi_tt_2", label: "TT 2" },
            { key: "imunisasi_bcg", label: "BCG" },
            { key: "imunisasi_dpt_1", label: "DPT 1" },
            { key: "imunisasi_dpt_2", label: "DPT 2" },
            { key: "imunisasi_dpt_3", label: "DPT 3" },
            { key: "imunisasi_polio_1", label: "Polio 1" },
            { key: "imunisasi_polio_2", label: "Polio 2" },
            { key: "imunisasi_polio_3", label: "Polio 3" },
            { key: "imunisasi_polio_4", label: "Polio 4" },
            { key: "imunisasi_campak", label: "Campak" },
            { key: "imunisasi_hepatitis_1", label: "Hepatitis 1" },
            { key: "imunisasi_hepatitis_2", label: "Hepatitis 2" },
            { key: "imunisasi_hepatitis_3", label: "Hepatitis 3" },
        ],
    },
    {
        label: "Diare",
        fields: [
            { key: "balita_diare", label: "Kasus" },
            { key: "balita_oralit", label: "Oralit" },
        ],
    },
];

const fields = groups.flatMap((group) => group.fields);

export default function KegiatanPosyandu({
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
            title="Kegiatan Posyandu"
            description="Rekap layanan ibu, KB, balita, vitamin, imunisasi, dan diare per bulan."
            year={year}
            years={years}
            onYearChange={onYearChange}
        >
            <Card className="overflow-hidden dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Data kegiatan Posyandu per bulan
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Pilih satu bulan untuk melihat rincian layanan.
                    </p>
                </div>
                {monthlyData.length > 0 ? (
                    monthlyData.map((row, index) => (
                        <DataDisclosure
                            key={row.bulan}
                            number={index + 1}
                            title={row.nama_bulan}
                            description={`Kegiatan Posyandu · ${year}`}
                            metrics={[
                                {
                                    label: "Ibu hamil",
                                    value: formatValue(row.ibu_hamil),
                                },
                                {
                                    label: "Akseptor KB",
                                    value: formatValue(
                                        groups[1].fields.reduce(
                                            (total, field) =>
                                                total +
                                                (Number(row[field.key]) || 0),
                                            0
                                        )
                                    ),
                                },
                                {
                                    label: "Balita",
                                    value: formatValue(
                                        Number(row.balita_l || 0) +
                                            Number(row.balita_p || 0)
                                    ),
                                },
                                {
                                    label: "Imunisasi",
                                    value: formatValue(
                                        groups[4].fields.reduce(
                                            (total, field) =>
                                                total +
                                                (Number(row[field.key]) || 0),
                                            0
                                        )
                                    ),
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
                        Belum ada data kegiatan Posyandu untuk tahun {year}.
                    </p>
                )}
                {monthlyData.length > 0 && (
                    <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-700/60 dark:text-slate-200">
                        Total ibu hamil {formatValue(sumField(monthlyData, "ibu_hamil"))}
                        <span className="px-2 text-slate-300 dark:text-slate-500">·</span>
                        Balita {formatValue(sumField(monthlyData, "balita_l") + sumField(monthlyData, "balita_p"))}
                        <span className="px-2 text-slate-300 dark:text-slate-500">·</span>
                        Bulan dengan data {monthlyData.length}
                    </div>
                )}
            </Card>
        </TabPageLayout>
    );
}
