import React, { FormEventHandler } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import SelectInput from "@/Components/Form/SelectInput";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import { Head, Link, useForm } from "@inertiajs/react";
import { ChevronLeft, MapPin, Home } from "lucide-react";
import { Role, User } from "@/types/model";

interface EditProps {
    user: User & {
        username?: string;
        kecamatan?: string;
        desa?: string;
        nama_desa?: string;
    };
    roles: Role[];
    userRoles: string[];
    kecamatanList: string[];
    desaByKecamatan: Record<string, string[]>;
}

const KECAMATAN_FALLBACK = [
    'Bantarkalong', 'Bojongasih', 'Bojonggambir', 'Ciawi', 'Cibalong',
    'Cigalontang', 'Cikalong', 'Cikatomas', 'Cineam', 'Cipatujah',
    'Cisayong', 'Culamega', 'Gunungtanjung', 'Jamanis', 'Jatiwaras',
    'Kadipaten', 'Karangjaya', 'Karangnunggal', 'Leuwisari', 'Mangunreja',
    'Manonjaya', 'Padakembang', 'Pagerageung', 'Pancatengah', 'Parungponteng',
    'Puspahiang', 'Rajapolah', 'Salawu', 'Salopa', 'Sariwangi',
    'Singaparna', 'Sodonghilir', 'Sukahening', 'Sukaraja', 'Sukarame',
    'Sukaratu', 'Sukaresik', 'Tanjungjaya', 'Taraju',
];

export default function Edit({ user, roles, userRoles, kecamatanList, desaByKecamatan }: EditProps) {
    const kecamatans = kecamatanList?.length ? kecamatanList : KECAMATAN_FALLBACK;

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        password: "",
        password_confirmation: "",
        roles: userRoles || ([] as string[]),
        kecamatan: user.kecamatan || "",
        desa: user.desa || "",              // ✅ TAMBAH
        nama_desa: user.nama_desa || "",    // ✅ TAMBAH
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("be.users.update", user.id));
    };

    const handleRoleChange = (roleName: string) => {
        const currentRoles = [...data.roles];
        if (currentRoles.includes(roleName)) {
            setData("roles", currentRoles.filter((r) => r !== roleName));
        } else {
            setData("roles", [...currentRoles, roleName]);
        }
    };

    const isKecamatanRole = data.roles.includes("kecamatan");
    const isAdminDesaRole = data.roles.includes("admin desa");
    const isDasawismaRole = data.roles.includes("dasawisma");

    const showKecamatan = isKecamatanRole || isAdminDesaRole || isDasawismaRole;
    const showDesa = isAdminDesaRole || isDasawismaRole;
    const desaOptions = data.kecamatan ? (desaByKecamatan[data.kecamatan] ?? []) : [];

    return (
        <MainLayout>
            <Head title={`Edit Pengguna - ${user.name}`} />

            <div className="flex items-center gap-4 mb-8">
                <Link
                    href={route("be.users.index")}
                    className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-teal-600 hover:border-teal-100 transition-all shadow-sm dark:bg-slate-700 dark:border-slate-600"
                >
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Edit Pengguna & Kader
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Anda sedang memperbarui data akun sistem PKK untuk <b>{user.name}</b>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card as="form" onSubmit={handleSubmit} className="dark:bg-slate-800 dark:border-slate-700">
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Nama Lengkap
                                    </label>
                                    <TextInput
                                        placeholder="Masukkan nama lengkap..."
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        className="w-full py-2.5 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                        error={errors.name}
                                    />
                                </div>

                                {/* Username */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Username
                                    </label>
                                    <TextInput
                                        placeholder="Masukkan username..."
                                        value={data.username}
                                        onChange={(e) => setData("username", e.target.value)}
                                        className="w-full py-2.5 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                        error={errors.username}
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Email
                                    </label>
                                    <TextInput
                                        type="email"
                                        placeholder="user@example.com"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        className="w-full py-2.5 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                        error={errors.email}
                                    />
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Password (Opsional)
                                    </label>
                                    <TextInput
                                        type="password"
                                        placeholder="Kosongkan jika tidak ingin diubah"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        className="w-full py-2.5 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                        error={errors.password}
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Konfirmasi Password
                                    </label>
                                    <TextInput
                                        type="password"
                                        placeholder="Ulangi password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData("password_confirmation", e.target.value)}
                                        className="w-full py-2.5 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                    />
                                </div>

                                {/* Wilayah kecamatan untuk akun yang dibatasi berdasarkan wilayah */}
                                {showKecamatan && (
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                            <MapPin size={14} className="text-cyan-600" />
                                            Wilayah Kecamatan
                                            <span className="text-rose-500">*</span>
                                        </label>
                                        <SelectInput
                                            value={data.kecamatan}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                {
                                                    setData("kecamatan", e.target.value);
                                                    setData("desa", "");
                                                    setData("nama_desa", "");
                                                }
                                            }
                                            error={errors.kecamatan}
                                            className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                        >
                                            <option value="">-- Pilih Kecamatan --</option>
                                            {kecamatans.map((kec) => (
                                                <option key={kec} value={kec}>{kec}</option>
                                            ))}
                                        </SelectInput>
                                        <p className="text-xs text-slate-400">
                                            Pilih kecamatan yang menjadi wilayah kerja user ini.
                                        </p>
                                    </div>
                                )}

                                {/* Desa untuk admin desa dan kader Dasawisma */}
                                {showDesa && (
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                            <Home size={14} className="text-teal-600" />
                                            Nama Desa
                                            <span className="text-rose-500">*</span>
                                        </label>
                                        <SelectInput
                                            value={data.desa}
                                            onChange={(e) => {
                                                setData("desa", e.target.value);
                                                setData("nama_desa", e.target.value);
                                            }}
                                            disabled={!data.kecamatan || desaOptions.length === 0}
                                            className="w-full py-2.5 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                            error={errors.desa}
                                        >
                                            <option value="">
                                                {data.kecamatan
                                                    ? "-- Pilih Desa --"
                                                    : "-- Pilih Kecamatan Dahulu --"}
                                            </option>
                                            {desaOptions.map((desa) => (
                                                <option key={desa} value={desa}>{desa}</option>
                                            ))}
                                        </SelectInput>
                                        <p className="text-xs text-slate-400">
                                            Daftar desa mengikuti kecamatan yang dipilih.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="p-8 bg-slate-50/30 border-t border-slate-100 flex justify-end gap-3 dark:bg-slate-700/20 dark:border-slate-700">
                            <Button variant="secondary" href={route("be.users.index")}>
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={processing}
                                className="bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-100 dark:shadow-none"
                            >
                                <span>{processing ? "Menyimpan..." : "Perbarui"}</span>
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Roles */}
                <div className="space-y-6">
                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/30 dark:bg-slate-700/20 dark:border-slate-700">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200">
                                Assign Role PKK
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Sesuaikan hak akses kader atau pengguna ini
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            {roles.map((role) => (
                                <label
                                    key={role.id}
                                    className={`
                                        flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all dark:bg-slate-700/20
                                        ${
                                            data.roles.includes(role.name)
                                                ? "border-teal-500 bg-teal-50/50 ring-4 ring-teal-500/5"
                                                : "border-slate-100 hover:border-slate-200 dark:border-slate-700"
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded-lg border-slate-300 text-teal-600 focus:ring-teal-500"
                                            checked={data.roles.includes(role.name)}
                                            onChange={() => handleRoleChange(role.name)}
                                        />
                                        <div>
                                            <p className={`text-sm font-bold ${
                                                data.roles.includes(role.name)
                                                    ? "text-teal-700 dark:text-teal-400"
                                                    : "text-slate-700 dark:text-slate-200"
                                            }`}>
                                                {role.name.toUpperCase()}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Hak akses modul {role.name}
                                            </p>
                                        </div>
                                    </div>
                                </label>
                            ))}
                            {errors.roles && (
                                <p className="text-xs text-rose-500 mt-2">{errors.roles}</p>
                            )}
                        </div>
                    </Card>

                    {/* Information Box */}
                    <div className="p-6 bg-teal-50 rounded-xl border border-teal-100 dark:bg-teal-900/20 dark:border-teal-800/50">
                        <h4 className="text-sm font-bold text-teal-800 mb-2 dark:text-teal-300">
                            Informasi Sistem
                        </h4>
                        <p className="text-xs text-teal-700/80 leading-relaxed dark:text-teal-200/80">
                            Password hanya perlu diisi jika Anda ingin memperbarui sandi akun kader.
                            Jika dibiarkan kosong, password lama tetap akan digunakan.
                        </p>
                        <p className="text-xs text-teal-700/80 leading-relaxed dark:text-teal-200/80 mt-2">
                            <strong>Catatan:</strong> Untuk role <strong>kecamatan</strong> — wajib pilih kecamatan.
                            Untuk <strong>admin desa</strong> — wajib pilih kecamatan + isi nama desa.
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
