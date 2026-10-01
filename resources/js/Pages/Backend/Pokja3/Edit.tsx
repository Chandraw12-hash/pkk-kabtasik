import React from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";

interface Pokja3Record {
    id: number;
    kategori: string | null;
    kecamatan: string;
    nama_kecamatan: string;
    rumah_sehat: number | null;
    rumah_tidak_sehat: number | null;
    pemanfaatan_pekarangan: number | null;
    industri_rumah_tangga: number | null;
}

interface Props {
    pokja: Pokja3Record;
}

interface FormData {
    kategori: string;
    kecamatan: string;
    nama_kecamatan: string;
    rumah_sehat: number;
    rumah_tidak_sehat: number;
    pemanfaatan_pekarangan: number;
    industri_rumah_tangga: number;
}

const numericFields: Array<{
    key: keyof Pick<
        FormData,
        | "rumah_sehat"
        | "rumah_tidak_sehat"
        | "pemanfaatan_pekarangan"
        | "industri_rumah_tangga"
    >;
    label: string;
}> = [
    { key: "rumah_sehat", label: "Rumah sehat" },
    { key: "rumah_tidak_sehat", label: "Rumah tidak sehat" },
    { key: "pemanfaatan_pekarangan", label: "Pemanfaatan pekarangan" },
    { key: "industri_rumah_tangga", label: "Industri rumah tangga" },
];

export default function Edit({ pokja }: Props) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        kategori: pokja.kategori || "Umum",
        kecamatan: pokja.kecamatan || "",
        nama_kecamatan: pokja.nama_kecamatan || "",
        rumah_sehat: pokja.rumah_sehat ?? 0,
        rumah_tidak_sehat: pokja.rumah_tidak_sehat ?? 0,
        pemanfaatan_pekarangan: pokja.pemanfaatan_pekarangan ?? 0,
        industri_rumah_tangga: pokja.industri_rumah_tangga ?? 0,
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(route("be.pokja3.update", pokja.id));
    };

    const inputClass =
        "w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600";

    return (
        <MainLayout>
            <Head title="Edit Data Pokja III" />

            <div className="mb-8 flex items-center gap-3">
                <Link
                    href={route("be.pokja3.index")}
                    aria-label="Kembali ke daftar Pokja III"
                    className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                        Edit Data Pokja III
                    </h1>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                        Perbarui rekapitulasi Pokja III untuk kecamatan.
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <Card className="space-y-5 p-5 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            Identitas data
                        </h2>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Periksa kategori dan kecamatan sebelum menyimpan.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="kategori"
                                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                            >
                                Kategori
                            </label>
                            <TextInput
                                id="kategori"
                                value={data.kategori}
                                onChange={(event) =>
                                    setData("kategori", event.target.value)
                                }
                                className={inputClass}
                            />
                            {errors.kategori && (
                                <p className="mt-1.5 text-xs text-rose-500">
                                    {errors.kategori}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="kecamatan"
                                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                            >
                                Kecamatan
                            </label>
                            <TextInput
                                id="kecamatan"
                                value={data.kecamatan}
                                onChange={(event) =>
                                    setData("kecamatan", event.target.value)
                                }
                                className={inputClass}
                            />
                            {errors.kecamatan && (
                                <p className="mt-1.5 text-xs text-rose-500">
                                    {errors.kecamatan}
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label
                                htmlFor="nama_kecamatan"
                                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                            >
                                Nama kecamatan
                            </label>
                            <TextInput
                                id="nama_kecamatan"
                                value={data.nama_kecamatan}
                                onChange={(event) =>
                                    setData(
                                        "nama_kecamatan",
                                        event.target.value
                                    )
                                }
                                className={inputClass}
                            />
                            {errors.nama_kecamatan && (
                                <p className="mt-1.5 text-xs text-rose-500">
                                    {errors.nama_kecamatan}
                                </p>
                            )}
                        </div>
                    </div>
                </Card>

                <Card className="space-y-5 p-5 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            Rekapitulasi Pokja III
                        </h2>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Isi jumlah sesuai data yang tercatat.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        {numericFields.map((field) => (
                            <div key={field.key}>
                                <label
                                    htmlFor={field.key}
                                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    {field.label}
                                </label>
                                <TextInput
                                    id={field.key}
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={data[field.key]}
                                    onChange={(event) =>
                                        setData(
                                            field.key,
                                            Number(event.target.value)
                                        )
                                    }
                                    className={inputClass}
                                />
                                {errors[field.key] && (
                                    <p className="mt-1.5 text-xs text-rose-500">
                                        {errors[field.key]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                    <Button
                        type="button"
                        variant="secondary"
                        href={route("be.pokja3.index")}
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
                        <span>
                            {processing ? "Menyimpan..." : "Simpan perubahan"}
                        </span>
                    </Button>
                </div>
            </form>
        </MainLayout>
    );
}