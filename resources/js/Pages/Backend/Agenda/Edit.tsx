import React from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import { Head, useForm, Link } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";

interface AgendaType {
    id: number;
    judul: string;
    deskripsi: string | null;
    tanggal: string;
    waktu: string | null;
    lokasi: string | null;
}

interface Props {
    agenda: AgendaType;
}

interface AgendaFormData {
    _method: "put";
    judul: string;
    deskripsi: string;
    tanggal: string;
    waktu: string;
    lokasi: string;
    [key: string]: string;
}

// Kolom `date`/`time` dari backend sering balik format "YYYY-MM-DD 00:00:00"
// atau "HH:MM:SS" — dipotong dulu supaya cocok dengan input type="date"/"time"
const toDateInput = (value: string | null) => (value ? value.slice(0, 10) : "");
const toTimeInput = (value: string | null) => (value ? value.slice(0, 5) : "");

export default function Edit({ agenda }: Props) {
    const { data, setData, post, processing, errors } = useForm<AgendaFormData>({
        _method: "put",
        judul: agenda.judul || "",
        deskripsi: agenda.deskripsi || "",
        tanggal: toDateInput(agenda.tanggal),
        waktu: toTimeInput(agenda.waktu),
        lokasi: agenda.lokasi || "",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("be.agenda.update", agenda.id));
    };

    return (
        <MainLayout>
            <Head title="Edit Agenda" />

            <div className="flex items-center gap-3 mb-8">
                <Link
                    href={route("be.agenda.index")}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Edit Agenda
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Perbarui detail jadwal kegiatan
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="p-6 dark:bg-slate-800 dark:border-slate-700 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Judul Agenda
                        </label>
                        <TextInput
                            value={data.judul}
                            onChange={(e) => setData("judul", e.target.value)}
                            placeholder="Contoh: Rapat Koordinasi Bulanan PKK"
                            className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                        />
                        {errors.judul && (
                            <p className="text-xs text-rose-500 mt-1.5">{errors.judul}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Deskripsi
                        </label>
                        <textarea
                            value={data.deskripsi}
                            onChange={(e) => setData("deskripsi", e.target.value)}
                            rows={4}
                            placeholder="Detail agenda, opsional..."
                            className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 focus:ring-3 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
                        />
                        {errors.deskripsi && (
                            <p className="text-xs text-rose-500 mt-1.5">{errors.deskripsi}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Tanggal
                            </label>
                            <TextInput
                                type="date"
                                value={data.tanggal}
                                onChange={(e) => setData("tanggal", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.tanggal && (
                                <p className="text-xs text-rose-500 mt-1.5">{errors.tanggal}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Waktu <span className="text-slate-400 font-normal">(opsional)</span>
                            </label>
                            <TextInput
                                type="time"
                                value={data.waktu}
                                onChange={(e) => setData("waktu", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.waktu && (
                                <p className="text-xs text-rose-500 mt-1.5">{errors.waktu}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Lokasi <span className="text-slate-400 font-normal">(opsional)</span>
                        </label>
                        <TextInput
                            value={data.lokasi}
                            onChange={(e) => setData("lokasi", e.target.value)}
                            placeholder="Contoh: Aula Kecamatan Cihideung"
                            className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                        />
                        {errors.lokasi && (
                            <p className="text-xs text-rose-500 mt-1.5">{errors.lokasi}</p>
                        )}
                    </div>
                </Card>

                <div className="flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        href={route("be.agenda.index")}
                        className="dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={processing}
                        className="flex items-center gap-2"
                    >
                        <Save size={16} />
                        {processing ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </div>
            </form>
        </MainLayout>
    );
}
