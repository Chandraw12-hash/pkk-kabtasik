import React, { FormEventHandler } from "react";

import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import SelectInput from "@/Components/Form/SelectInput";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";

import { Head, Link, useForm } from "@inertiajs/react";

import {
    ArrowLeft,
    MapPin,
    Home,
    Users,
    Info,
    ShieldCheck,
    Check,
} from "lucide-react";

import { Role } from "@/types/model";

interface CreateProps {
    roles: Role[];
    kecamatanList: string[];
    desaByKecamatan: Record<string, string[]>;
    prefill?: {
        kader_id?: number;
        name?: string;
        kecamatan?: string;
        desa?: string;
        roles?: string[];
    };
}

const KECAMATAN_FALLBACK = [
    "Bantarkalong",
    "Bojongasih",
    "Bojonggambir",
    "Ciawi",
    "Cibalong",
    "Cigalontang",
    "Cikalong",
    "Cikatomas",
    "Cineam",
    "Cipatujah",
    "Cisayong",
    "Culamega",
    "Gunungtanjung",
    "Jamanis",
    "Jatiwaras",
    "Kadipaten",
    "Karangjaya",
    "Karangnunggal",
    "Leuwisari",
    "Mangunreja",
    "Manonjaya",
    "Padakembang",
    "Pagerageung",
    "Pancatengah",
    "Parungponteng",
    "Puspahiang",
    "Rajapolah",
    "Salawu",
    "Salopa",
    "Sariwangi",
    "Singaparna",
    "Sodonghilir",
    "Sukahening",
    "Sukaraja",
    "Sukarame",
    "Sukaratu",
    "Sukaresik",
    "Tanjungjaya",
    "Taraju",
];

export default function Create({ roles, kecamatanList, desaByKecamatan, prefill }: CreateProps) {
    const kecamatans = kecamatanList?.length
        ? kecamatanList
        : KECAMATAN_FALLBACK;

    const { data, setData, post, processing, errors } = useForm({
        kader_id: prefill?.kader_id ?? null as number | null,
        name: prefill?.name ?? "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        roles: prefill?.roles ?? ([] as string[]),
        kecamatan: prefill?.kecamatan ?? "",
        desa: prefill?.desa ?? "",
        nama_desa: prefill?.desa ?? "",
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("be.users.store"));
    };

    const handleRoleChange = (roleName: string) => {
        const currentRoles = [...data.roles];

        if (currentRoles.includes(roleName)) {
            setData(
                "roles",
                currentRoles.filter((r) => r !== roleName)
            );

            if (roleName === "admin desa") {
                setData("desa", "");
                setData("nama_desa", "");
            }

            if (roleName === "dasawisma") {
                setData("desa", "");
                setData("nama_desa", "");
            }

            if (roleName === "kecamatan") {
                setData("kecamatan", "");
            }
        } else {
            setData("roles", [...currentRoles, roleName]);
        }
    };

    const isKecamatanRole = data.roles.includes("kecamatan");
    const isAdminDesaRole = data.roles.includes("admin desa");
    const isDasawismaRole = data.roles.includes("dasawisma");

    const showKecamatan =
        isKecamatanRole ||
        isAdminDesaRole ||
        isDasawismaRole ||
        data.kecamatan !== "";
    const showDesa =
        isAdminDesaRole || isDasawismaRole || data.desa !== "";
    const desaOptions = data.kecamatan ? (desaByKecamatan[data.kecamatan] ?? []) : [];

    const roleDescriptions: Record<string, string> = {
        admin: "Akses penuh sistem.",
        kecamatan: "Kelola data kecamatan.",
        "admin desa": "Kelola data desa.",
        pokja1: "Kelola data Pokja 1.",
        pokja2: "Kelola data Pokja 2.",
        pokja3: "Kelola data Pokja 3.",
        pokja4: "Kelola data Pokja 4.",
    };

    const formatRoleName = (name: string) =>
        name
            .replace(/pokja(\d)/i, "pokja $1")
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

    return (
        <MainLayout>
            <Head title="Tambah User" />

            {/* =====================================================
                HEADER
            ====================================================== */}
            <div className="mb-8 flex items-center gap-4">
                <Link
                    href={route("be.users.index")}
                    className="
                        flex h-10 w-10 shrink-0 items-center justify-center
                        rounded-xl
                        border border-slate-200
                        bg-white
                        text-slate-500
                        shadow-sm
                        transition-all
                        hover:border-indigo-200
                        hover:bg-indigo-50
                        hover:text-indigo-600
                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-slate-400
                        dark:hover:border-indigo-500/40
                        dark:hover:bg-indigo-500/10
                        dark:hover:text-indigo-400
                    "
                >
                    <ArrowLeft size={19} />
                </Link>

                <div>
                    <div className="mb-1 text-xs font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Manajemen User
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                        Tambah User Baru
                    </h1>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Isi form di bawah untuk mendaftarkan pengguna baru
                    </p>
                </div>
            </div>

            {prefill?.kader_id ? (
                <div className="mb-6 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800 dark:border-teal-900 dark:bg-teal-950/30 dark:text-teal-200">
                    Membuat akun dari Data Kader{prefill.name ? ` (${prefill.name})` : ""} — nama, wilayah,
                    dan peran sudah terisi otomatis. Akun yang dibuat otomatis
                    tertaut ke baris kader tersebut.
                </div>
            ) : null}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* =====================================================
                        KOLOM KIRI
                    ====================================================== */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* =================================================
                            INFORMASI AKUN
                        ================================================== */}
                        <Card className="overflow-hidden border-slate-200 dark:border-slate-700 dark:bg-slate-800">
                            <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
                                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                            1
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                            Informasi Akun
                                        </h3>

                                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                            Data login untuk pengguna
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                                {/* Nama */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        Nama Lengkap{" "}
                                        <span className="text-rose-500">*</span>
                                    </label>

                                    <TextInput
                                        placeholder="Contoh: Admin Desa Cikatomas"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                                        error={errors.name}
                                    />
                                </div>

                                {/* Username */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        Username{" "}
                                        <span className="text-rose-500">*</span>
                                    </label>

                                    <TextInput
                                        placeholder="admindesa_cikatomas"
                                        value={data.username}
                                        onChange={(e) =>
                                            setData("username", e.target.value)
                                        }
                                        className="w-full dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                                        error={errors.username}
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        Email{" "}
                                        <span className="text-rose-500">*</span>
                                    </label>

                                    <TextInput
                                        type="email"
                                        placeholder="user@example.com"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="w-full dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                                        error={errors.email}
                                    />
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        Password{" "}
                                        <span className="text-rose-500">*</span>
                                    </label>

                                    <TextInput
                                        type="password"
                                        placeholder="Minimal 8 karakter"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="w-full dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                                        error={errors.password}
                                    />
                                </div>

                                {/* Konfirmasi Password */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        Konfirmasi Password{" "}
                                        <span className="text-rose-500">*</span>
                                    </label>

                                    <TextInput
                                        type="password"
                                        placeholder="Ulangi password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        className="w-full dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* =================================================
                            WILAYAH KERJA
                        ================================================== */}
                        {showKecamatan && (
                            <Card className="overflow-hidden border-slate-200 dark:border-slate-700 dark:bg-slate-800">
                                <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-500/10">
                                            <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                                                2
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                                Wilayah Kerja
                                            </h3>

                                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                Tentukan wilayah akses user
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5 p-6">
                                    {/* Kecamatan */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                            <MapPin
                                                size={15}
                                                className="text-teal-600 dark:text-teal-400"
                                            />
                                            Kecamatan{" "}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </label>

                                        <SelectInput
                                            value={data.kecamatan}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                            ) => {
                                                setData(
                                                    "kecamatan",
                                                    e.target.value
                                                );
                                                setData("desa", "");
                                                setData("nama_desa", "");
                                            }}
                                            error={errors.kecamatan}
                                            className="w-full dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                                        >
                                            <option value="">
                                                -- Pilih Kecamatan --
                                            </option>

                                            {kecamatans.map((kec) => (
                                                <option key={kec} value={kec}>
                                                    {kec}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </div>

                                    {/* Desa */}
                                    {showDesa && (
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                                <Home
                                                    size={15}
                                                    className="text-teal-600 dark:text-teal-400"
                                                />
                                                Nama Desa{" "}
                                                <span className="text-rose-500">
                                                    *
                                                </span>
                                            </label>

                                            <SelectInput
                                                value={data.desa}
                                                onChange={(e) => {
                                                    setData("desa", e.target.value);
                                                    setData("nama_desa", e.target.value);
                                                }}
                                                disabled={!data.kecamatan || desaOptions.length === 0}
                                                className="w-full dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                                                error={errors.desa}
                                            >
                                                <option value="">
                                                    {data.kecamatan
                                                        ? "-- Pilih Desa --"
                                                        : "-- Pilih Kecamatan Dahulu --"}
                                                </option>
                                                {desaOptions.map((desa) => (
                                                    <option key={desa} value={desa}>
                                                        {desa}
                                                    </option>
                                                ))}
                                            </SelectInput>

                                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                                Daftar desa mengikuti kecamatan yang dipilih.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* =================================================
                            ACTION FOOTER
                        ================================================== */}
                        <Card className="border-slate-200 dark:border-slate-700 dark:bg-slate-800">
                            <div className="flex justify-end gap-3 p-5">
                                <Button
                                    variant="secondary"
                                    href={route("be.users.index")}
                                >
                                    Batal
                                </Button>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={processing}
                                    className="bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-100 dark:shadow-none"
                                >
                                    {processing
                                        ? "Menyimpan..."
                                        : "Simpan User"}
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* =====================================================
                        KOLOM KANAN
                    ====================================================== */}
                    <div className="space-y-6">
                        {/* =================================================
                            HAK AKSES
                        ================================================== */}
                        <Card className="overflow-hidden border-slate-200 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            {/* Header */}
                            <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-900/20">
                                        <ShieldCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                    </div>

                                    <div>
                                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                            Hak Akses
                                        </h2>

                                        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                                            Pilih role pengguna.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                {/* Role Header */}
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Role dipilih
                                    </span>

                                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-900/20 dark:text-teal-400">
                                        {data.roles.length} role
                                    </span>
                                </div>

                                {/* Role Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {roles.map((role) => {
                                        const selected = data.roles.includes(
                                            role.name
                                        );

                                        return (
                                            <label
                                                key={role.id}
                                                title={
                                                    roleDescriptions[
                                                        role.name
                                                    ] ?? "Hak akses pengguna."
                                                }
                                                className={`
                                                    group relative flex min-h-[92px] cursor-pointer
                                                    flex-col justify-between rounded-xl border p-3.5
                                                    transition-all duration-200
                                                    ${
                                                        selected
                                                            ? "border-teal-500 bg-teal-50 shadow-sm ring-1 ring-teal-500/30 dark:border-teal-400 dark:bg-teal-900/20"
                                                            : "border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500 dark:hover:bg-slate-700/50"
                                                    }
                                                `}
                                            >
                                                {/* Checkbox asli (disembunyikan, tetap aksesibel) */}
                                                <input
                                                    type="checkbox"
                                                    checked={selected}
                                                    onChange={() =>
                                                        handleRoleChange(
                                                            role.name
                                                        )
                                                    }
                                                    className="sr-only"
                                                />

                                                {/* Indikator centang */}
                                                <span
                                                    className={`
                                                        flex h-5 w-5 items-center justify-center
                                                        rounded-full border transition-all
                                                        ${
                                                            selected
                                                            ? "border-teal-600 bg-teal-600 text-white"
                                                            : "border-slate-300 bg-white text-transparent group-hover:border-teal-400 dark:border-slate-600 dark:bg-slate-700"
                                                        }
                                                    `}
                                                >
                                                    <Check
                                                        size={12}
                                                        strokeWidth={3}
                                                    />
                                                </span>

                                                {/* Nama & deskripsi */}
                                                <div className="mt-3">
                                                    <p
                                                        className={`
                                                            text-sm font-semibold leading-tight
                                                            ${
                                                                selected
                                                                    ? "text-teal-700 dark:text-teal-300"
                                                                    : "text-slate-800 dark:text-slate-100"
                                                            }
                                                        `}
                                                    >
                                                        {formatRoleName(
                                                            role.name
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                                                        {roleDescriptions[
                                                            role.name
                                                        ] ??
                                                            "Hak akses pengguna."}
                                                    </p>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>

                                {/* Error */}
                                {errors.roles && (
                                    <p className="mt-3 text-xs text-rose-500">
                                        {errors.roles}
                                    </p>
                                )}
                            </div>
                        </Card>

                        {/* =================================================
                            PANDUAN ROLE
                        ================================================== */}
                        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
                            <div className="mb-3 flex items-center gap-2">
                                <Info
                                    size={16}
                                    className="shrink-0 text-amber-600 dark:text-amber-400"
                                />

                                <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">
                                    Panduan Role
                                </h4>
                            </div>

                            <ul className="space-y-2.5 text-xs text-amber-800/80 dark:text-amber-200/80">
                                <li className="flex gap-2">
                                    <Users
                                        size={13}
                                        className="mt-0.5 shrink-0 text-amber-600"
                                    />

                                    <span>
                                        <b>Admin Desa</b> — import data PKK desa
                                    </span>
                                </li>

                                <li className="flex gap-2">
                                    <MapPin
                                        size={13}
                                        className="mt-0.5 shrink-0 text-amber-600"
                                    />

                                    <span>
                                        <b>Kecamatan</b> — approve data desa
                                    </span>
                                </li>

                                <li className="flex gap-2">
                                    <Home
                                        size={13}
                                        className="mt-0.5 shrink-0 text-amber-600"
                                    />

                                    <span>
                                        <b>Admin</b> — kelola semua sistem
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </MainLayout>
    );
}
