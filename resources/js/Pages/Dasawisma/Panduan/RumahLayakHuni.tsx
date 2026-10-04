import { Head, Link } from "@inertiajs/react";
import { Droplets, Home, Recycle, Toilet } from "lucide-react";
import DasawismaLayout from "@/Components/Layout/DasawismaLayout";
import Toast from "@/Components/UI/Toast";
import StatsCard from "@/Components/Dasawisma/StatsCard";

const indicators = [
    { title: "Kondisi rumah", detail: "Catat jumlah rumah sehat pada kolom Rumah Sehat di rekap kegiatan Dasa Wisma.", icon: Home },
    { title: "Pengelolaan sampah", detail: "Gunakan indikator Memiliki Tempat Sampah pada format rekap.", icon: Recycle },
    { title: "Saluran pembuangan", detail: "Gunakan kolom Memiliki SPAL sesuai data wilayah.", icon: Droplets },
    { title: "Sanitasi keluarga", detail: "Catat jumlah jamban keluarga pada kolom yang tersedia.", icon: Toilet },
];

export default function RumahLayakHuni() {
    return (
        <DasawismaLayout>
            <Head title="Panduan Rumah Layak Huni" />
            <Toast />
            <main className="mx-auto w-full max-w-6xl space-y-6 p-4 font-['Poppins',_sans-serif] sm:p-6 lg:p-8">
                <nav className="text-xs font-medium text-slate-500 dark:text-slate-400" aria-label="Breadcrumb"><Link href="/dasawisma" className="hover:text-teal-700">Dasawisma</Link><span className="mx-2">/</span>Panduan<span className="mx-2">/</span><span className="text-teal-700 dark:text-teal-300">Rumah Layak Huni</span></nav>
                <header><h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">Rumah Layak Huni</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">Gunakan indikator yang tersedia pada rekap Dasa Wisma. Penetapan status kelayakan tetap mengikuti pedoman resmi yang berlaku di wilayah.</p></header>
                <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indikator dalam format rekap">
                    <StatsCard label="Rumah sehat" value="—" icon={Home} />
                    <StatsCard label="Tempat sampah" value="—" icon={Recycle} />
                    <StatsCard label="SPAL" value="—" icon={Droplets} />
                    <StatsCard label="Jamban keluarga" value="—" icon={Toilet} />
                </section>
                <section className="grid grid-cols-1 gap-3 md:grid-cols-2" aria-label="Panduan pencatatan">
                    {indicators.map(({ title, detail, icon: Icon }) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><span className="inline-flex rounded-xl bg-teal-50 p-3 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"><Icon size={19} aria-hidden="true" /></span><h2 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{detail}</p></article>)}
                </section>
                <p className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-900 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">Halaman ini menjelaskan kolom pada format data. Untuk verifikasi kondisi bangunan dan standar teknis, gunakan petunjuk pemerintah/instansi terkait; angka ambang teknis tidak disediakan dalam format Excel proyek.</p>
            </main>
        </DasawismaLayout>
    );
}
