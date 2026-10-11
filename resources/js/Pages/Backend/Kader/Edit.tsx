import React from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, Info } from "lucide-react";

interface Kader {
    id: number;
    nama: string;
    nik: string | null;
    jabatan: string;
    pokja: string | null;
    kecamatan: string | null;
    desa_kelurahan: string | null;
    no_hp: string | null;
    alamat: string | null;
    status_aktif: boolean;
    tanggal_bergabung: string | null;
}

interface EditProps {
    kader: Kader;
    kecamatanList?: string[];
    desaByKecamatan?: Record<string, string[]>;
}

const JABATAN_OPTIONS = [
    "Ketua",
    "Wakil Ketua",
    "Sekretaris",
    "Bendahara",
    "Ketua Pokja I",
    "Ketua Pokja II",
    "Ketua Pokja III",
    "Ketua Pokja IV",
    "Anggota",
];

const POKJA_OPTIONS = ["I", "II", "III", "IV", "Sekretariat"];

/** Format tanggal ke YYYY-MM-DD untuk input type="date" */
const toDateInput = (value: string | null): string => {
    if (!value) return "";
    try {
        return value.substring(0, 10);
    } catch {
        return "";
    }
};

export default function Edit({ kader, kecamatanList = [], desaByKecamatan = {} }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        nama: kader.nama || "",
        nik: kader.nik || "",
        jabatan: kader.jabatan || "Anggota",
        pokja: kader.pokja || "",
        kecamatan: kader.kecamatan || "",
        desa_kelurahan: kader.desa_kelurahan || "",
        no_hp: kader.no_hp || "",
        alamat: kader.alamat || "",
        status_aktif: Boolean(kader.status_aktif),
        tanggal_bergabung: toDateInput(kader.tanggal_bergabung),
    });

    const desaOptions =
        data.kecamatan && desaByKecamatan[data.kecamatan]
            ? desaByKecamatan[data.kecamatan]
            : [];
    // Nilai lama (di luar master) tetap ditampilkan agar tak hilang.
    const kecamatanOptions =
        data.kecamatan && !kecamatanList.includes(data.kecamatan)
            ? [data.kecamatan, ...kecamatanList]
            : kecamatanList;
    const desaOptionsFull =
        data.desa_kelurahan && !desaOptions.includes(data.desa_kelurahan)
            ? [data.desa_kelurahan, ...desaOptions]
            : desaOptions;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("be.kader.update", kader.id));
    };

    const fieldClass =
        "w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 block py-2.5 px-3.5 transition-all outline-none dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600";

    const labelClass =
        "block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5";

    return (
        <MainLayout>
            <Head title={`Edit Kader — ${kader.nama}`} />

            <div className="flex items-center gap-3 mb-6">
                <Link
                    href={route("be.kader.index")}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-100">
                        Edit Kader
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Perbarui data: {kader.nama}
                    </p>
                </div>
            </div>

            <div className="mb-5 flex gap-3 rounded-xl border border-teal-100 bg-teal-50/80 dark:bg-teal-900/20 dark:border-teal-800 px-4 py-3">
                <Info
                    size={18}
                    className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5"
                />
                <p className="text-sm text-teal-900/80 dark:text-teal-100/90 leading-relaxed">
                    Pastikan <strong>No. HP</strong> dan{" "}
                    <strong>wilayah</strong> benar. Data ini nanti dipakai untuk
                    akun login aplikasi mobile kader.
                </p>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <form onSubmit={submit} className="p-5 sm:p-6 space-y-8">
                    {/* Identitas */}
                    <section>
                        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
                            Identitas
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className={labelClass}>
                                    Nama lengkap{" "}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <TextInput
                                    placeholder="Nama sesuai identitas"
                                    value={data.nama}
                                    onChange={(e) =>
                                        setData("nama", e.target.value)
                                    }
                                    className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                />
                                {errors.nama && (
                                    <p className="text-rose-500 text-xs mt-1">
                                        {errors.nama}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>NIK</label>
                                <TextInput
                                    placeholder="Opsional"
                                    value={data.nik}
                                    onChange={(e) =>
                                        setData("nik", e.target.value)
                                    }
                                    className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                />
                                {errors.nik && (
                                    <p className="text-rose-500 text-xs mt-1">
                                        {errors.nik}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Jabatan{" "}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.jabatan}
                                    onChange={(e) =>
                                        setData("jabatan", e.target.value)
                                    }
                                    className={fieldClass}
                                >
                                    {JABATAN_OPTIONS.map((j) => (
                                        <option key={j} value={j}>
                                            {j}
                                        </option>
                                    ))}
                                </select>
                                {errors.jabatan && (
                                    <p className="text-rose-500 text-xs mt-1">
                                        {errors.jabatan}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Pokja</label>
                                <select
                                    value={data.pokja}
                                    onChange={(e) =>
                                        setData("pokja", e.target.value)
                                    }
                                    className={fieldClass}
                                >
                                    <option value="">Tidak ada</option>
                                    {POKJA_OPTIONS.map((p) => (
                                        <option key={p} value={p}>
                                            {p === "Sekretariat"
                                                ? p
                                                : `Pokja ${p}`}
                                        </option>
                                    ))}
                                </select>
                                {errors.pokja && (
                                    <p className="text-rose-500 text-xs mt-1">
                                        {errors.pokja}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Tanggal bergabung
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal_bergabung}
                                    onChange={(e) =>
                                        setData(
                                            "tanggal_bergabung",
                                            e.target.value
                                        )
                                    }
                                    className={fieldClass}
                                />
                                {errors.tanggal_bergabung && (
                                    <p className="text-rose-500 text-xs mt-1">
                                        {errors.tanggal_bergabung}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Wilayah & kontak */}
                    <section>
                        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1 pb-2 border-b border-slate-100 dark:border-slate-700">
                            Wilayah & kontak
                        </h2>
                        <p className="text-xs text-slate-400 mb-4">
                            Dipakai untuk filter laporan per wilayah dan login
                            mobile (No. HP).
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className={labelClass}>Kecamatan</label>
                                <select
                                    value={data.kecamatan}
                                    onChange={(e) => {
                                        setData("kecamatan", e.target.value);
                                        setData("desa_kelurahan", "");
                                    }}
                                    className={fieldClass + " cursor-pointer"}
                                >
                                    <option value="">-- Pilih Kecamatan --</option>
                                    {kecamatanOptions.map((kec) => (
                                        <option key={kec} value={kec}>
                                            {kec}
                                        </option>
                                    ))}
                                </select>
                                {errors.kecamatan && (
                                    <p className="text-rose-500 text-xs mt-1">
                                        {errors.kecamatan}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Desa / kelurahan
                                </label>
                                <select
                                    value={data.desa_kelurahan}
                                    onChange={(e) =>
                                        setData(
                                            "desa_kelurahan",
                                            e.target.value
                                        )
                                    }
                                    disabled={!data.kecamatan || desaOptionsFull.length === 0}
                                    className={fieldClass + " cursor-pointer disabled:opacity-60"}
                                >
                                    <option value="">
                                        {data.kecamatan
                                            ? "-- Pilih Desa --"
                                            : "-- Pilih Kecamatan Dahulu --"}
                                    </option>
                                    {desaOptionsFull.map((desa) => (
                                        <option key={desa} value={desa}>
                                            {desa}
                                        </option>
                                    ))}
                                </select>
                                {errors.desa_kelurahan && (
                                    <p className="text-rose-500 text-xs mt-1">
                                        {errors.desa_kelurahan}
                                    </p>
                                )}
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Daftar desa mengikuti kecamatan yang dipilih.
                                </p>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    No. HP{" "}
                                    <span className="text-slate-400 font-normal">
                                        (disarankan)
                                    </span>
                                </label>
                                <TextInput
                                    placeholder="08xxxxxxxxxx"
                                    value={data.no_hp}
                                    onChange={(e) =>
                                        setData("no_hp", e.target.value)
                                    }
                                    className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                />
                                {errors.no_hp && (
                                    <p className="text-rose-500 text-xs mt-1">
                                        {errors.no_hp}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}>Alamat</label>
                                <textarea
                                    value={data.alamat}
                                    onChange={(e) =>
                                        setData("alamat", e.target.value)
                                    }
                                    rows={3}
                                    placeholder="Alamat lengkap (opsional)"
                                    className={fieldClass}
                                />
                                {errors.alamat && (
                                    <p className="text-rose-500 text-xs mt-1">
                                        {errors.alamat}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="flex items-center gap-2.5">
                        <input
                            id="status_aktif"
                            type="checkbox"
                            checked={data.status_aktif}
                            onChange={(e) =>
                                setData("status_aktif", e.target.checked)
                            }
                            className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                        />
                        <label
                            htmlFor="status_aktif"
                            className="text-sm text-slate-600 dark:text-slate-300"
                        >
                            Kader aktif (bisa dipakai untuk akses mobile nanti)
                        </label>
                    </section>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <Link
                            href={route("be.kader.index")}
                            className="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Batal
                        </Link>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={processing}
                            className="inline-flex items-center gap-2"
                        >
                            <Save size={16} />
                            {processing ? "Menyimpan..." : "Perbarui Kader"}
                        </Button>
                    </div>
                </form>
            </Card>
        </MainLayout>
    );
}
