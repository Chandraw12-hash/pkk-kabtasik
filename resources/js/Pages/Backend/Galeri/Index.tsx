import React, { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Card from "@/Components/UI/Card";
import { Head, Link, useForm } from "@inertiajs/react";
import { Search, Edit2, Trash2, RotateCcw, Plus, Image as ImageIcon } from "lucide-react";
import { usePage } from "@inertiajs/react";
import axios from "axios";

interface Galeri {
    id: number;
    judul: string;
    deskripsi: string | null;
    foto: string;
    tanggal?: string;
}

interface IndexProps {
    galeris: any; // Kita set any dulu agar tidak error saat data null
    filters: {
        search?: string;
        per_page?: number | string;
    };
}

export default function Index({ galeris, filters = {} }: IndexProps) {
    const { auth } = usePage<any>().props;

    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(Number(filters.per_page) || 10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedGaleri, setSelectedGaleri] = useState<Galeri | null>(null);

    // Data awal dikosongkan agar tidak crash
    const [localGaleris, setLocalGaleris] = useState({
        data: Array.isArray(galeris?.data) ? galeris.data : [],
        current_page: galeris?.current_page || 1,
        per_page: galeris?.per_page || 10,
        total: galeris?.total || 0,
        from: galeris?.from || 0,
        to: galeris?.to || 0,
        links: galeris?.links || [],
    });

    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = React.useRef(true);

    const { delete: destroy, processing } = useForm({});

    const fetchData = (url: string, params: any = {}) => {
        setIsLoading(true);
        axios
            .get(url, { params, headers: { Accept: "application/json" } })
            .then((res) => {
                if (res.data && res.data.data) {
                    setLocalGaleris({
                        data: res.data.data || [],
                        current_page: res.data.current_page || 1,
                        per_page: res.data.per_page || 10,
                        total: res.data.total || 0,
                        from: res.data.from || 0,
                        to: res.data.to || 0,
                        links: res.data.links || [],
                    });
                }
            })
            .catch((err) => console.error("Error fetching data:", err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (galeris.data && galeris.data.length > 0) {
            setLocalGaleris({
                data: galeris.data || [],
                current_page: galeris.current_page || 1,
                per_page: galeris.per_page || 10,
                total: galeris.total || 0,
                from: galeris.from || 0,
                to: galeris.to || 0,
                links: galeris.links || [],
            });
        } else {
            fetchData(route("be.galeri.index"), { search, per_page: perPage });
        }
    }, []);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            fetchData(route("be.galeri.index"), {
                search: search || "",
                per_page: perPage,
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, perPage]);

    const openDeleteModal = (galeri: Galeri) => {
        setSelectedGaleri(galeri);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!selectedGaleri) return;
        destroy(route("be.galeri.destroy", selectedGaleri.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedGaleri(null);
                fetchData(route("be.galeri.index"), { search: search || "", per_page: perPage });
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Manajemen Galeri Kegiatan" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Manajemen Galeri Kegiatan
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola dokumentasi foto dan kegiatan TP PKK
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="primary" href={route("be.galeri.create")} className="shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-2">
                        <Plus size={16} />
                        <span>Tambah Galeri</span>
                    </Button>
                </div>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50">
                <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <TextInput
                            iconLeft={<Search size={18} />}
                            placeholder="Cari judul galeri..."
                            className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            containerClassName="relative w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {search && (
                        <Button variant="danger" onClick={() => { setSearch(""); setPerPage(10); }} className="flex items-center gap-2">
                            <RotateCcw size={16} />
                            <span>Reset</span>
                        </Button>
                    )}
                </div>

                {/* ==================== TABLE SECTION (DIUBAH KE DIV BIAR GA CRASH) ==================== */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                            <tr>
                                <th className="px-6 py-3 w-16 text-center">#</th>
                                <th className="px-6 py-3 w-24 text-center">Foto</th>
                                <th className="px-6 py-3">Judul</th>
                                <th className="px-6 py-3 w-32 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={4} className="text-center py-10">Memuat data...</td></tr>
                            ) : localGaleris.data.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-10 text-slate-400">Belum ada data galeri.</td></tr>
                            ) : (
                                localGaleris.data.map((item: Galeri, index: number) => (
                                    <tr key={item.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                                        <td className="px-6 py-4 text-center font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                            {((localGaleris.current_page - 1) * localGaleris.per_page) + index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {item.foto ? (
                                                <img src={`/storage/${item.foto}`} alt={item.judul} className="w-12 h-12 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mx-auto" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 mx-auto">
                                                    <ImageIcon size={20} />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                            {item.judul || "-"}
                                            <p className="text-xs text-slate-400 font-normal mt-0.5">{item.deskripsi || "Tidak ada deskripsi"}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link href={route("be.galeri.edit", item.id)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                                    <Edit2 size={16} />
                                                </Link>
                                                <button onClick={() => openDeleteModal(item)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Section */}
                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Menampilkan {localGaleris.from ?? 0} sampai {localGaleris.to ?? 0} dari {localGaleris.total} data
                    </p>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>Tampilkan</span>
                        <select value={perPage} onChange={(e) => setPerPage(parseInt(e.target.value))} className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl block py-1.5 px-3 outline-none dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                    {/* Pagination Manual (Karena komponen Pagination error) */}
                    <div className="flex gap-1">
                        {localGaleris.links.map((link: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => link.url && fetchData(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1 rounded-lg border text-sm transition-colors ${link.active ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                            />
                        ))}
                    </div>
                </div>
            </Card>

            <ConfirmationModal show={showDeleteModal} processing={processing} title="Hapus Galeri" message="Apakah Anda yakin ingin menghapus dokumentasi galeri ini? Data yang dihapus tidak dapat dikembalikan." onConfirm={handleDelete} onCancel={() => setShowDeleteModal(false)} />
        </MainLayout>
    );
}
