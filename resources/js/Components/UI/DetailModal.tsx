import React, { useState } from "react";
import Modal from "@/Components/UI/Modal";
import Button from "@/Components/UI/Button";
import { ImageIcon } from "lucide-react";

export interface DetailImage {
    id: string | number;
    path: string;
    alt?: string;
}

export interface DetailItem {
    label: string;
    value: string | number | React.ReactNode | null | undefined;
    icon?: React.ElementType;
}

export interface DetailSection {
    title: string;
    icon?: React.ElementType;
    items: DetailItem[];
}

interface DetailModalProps {
    show: boolean;
    onClose: () => void;
    title: React.ReactNode;
    images?: DetailImage[];
    mainInfo?: {
        title: string;
        badges?: React.ReactNode[];
        description?: React.ReactNode;
        listInfo?: Array<{ icon?: React.ElementType; text: React.ReactNode }>;
    };
    sections?: DetailSection[];
    footer?: React.ReactNode;
    coordinates?: {
        latitude: string | number;
        longitude: string | number;
        label?: string;
    };
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
}

export default function DetailModal({
    show,
    onClose,
    title,
    images = [],
    mainInfo,
    sections = [],
    footer,
    coordinates,
    maxWidth = "4xl",
}: DetailModalProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const hasImages = images && images.length > 0;

    return (
        <Modal
            show={show}
            onClose={onClose}
            title={title}
            maxWidth={maxWidth}
            footer={
                footer || (
                    <Button variant="secondary" onClick={onClose}>
                        Tutup
                    </Button>
                )
            }
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Photo Gallery */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="relative aspect-[4/5] bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm group">
                        {hasImages ? (
                            <img
                                src={`/storage/${images[activeImageIndex].path}`}
                                alt={
                                    images[activeImageIndex].alt ||
                                    "Detail Image"
                                }
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                <ImageIcon
                                    size={48}
                                    className="mb-2 opacity-50"
                                />
                                <span className="text-sm">Tidak ada foto</span>
                            </div>
                        )}

                        {/* Badges Overlay if any */}
                        {mainInfo?.badges && mainInfo.badges.length > 0 && (
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {mainInfo.badges.map((badge, idx) => (
                                    <div
                                        key={idx}
                                        className="shadow-lg backdrop-blur-md bg-opacity-90"
                                    >
                                        {badge}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {hasImages && images.length > 1 && (
                        <div className="grid grid-cols-3 gap-2">
                            {images.map((img, idx) => (
                                <button
                                    key={img.id}
                                    onClick={() => setActiveImageIndex(idx)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                        activeImageIndex === idx
                                            ? "border-indigo-500 ring-2 ring-indigo-500/20"
                                            : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                                    }`}
                                >
                                    <img
                                        src={`/storage/${img.path}`}
                                        alt={img.alt || `Thumbnail ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Information */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Main Info */}
                    {mainInfo && (
                        <div>
                            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                                {mainInfo.title}
                            </h4>
                            {(mainInfo.listInfo || mainInfo.description) && (
                                <div className="space-y-4">
                                    {mainInfo.listInfo && (
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                            {mainInfo.listInfo.map(
                                                (info, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-2"
                                                    >
                                                        {info.icon && (
                                                            <info.icon
                                                                size={16}
                                                                className="text-indigo-500"
                                                            />
                                                        )}
                                                        <span>{info.text}</span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                    {mainInfo.description && (
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                            {mainInfo.description}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Sections Grid */}
                    {sections.map((section, idx) => (
                        <div key={idx}>
                            <h5 className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                                {section.icon && (
                                    <section.icon
                                        size={18}
                                        className="text-indigo-500"
                                    />
                                )}
                                {section.title}
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {section.items.map((item, itemIdx) => (
                                    <InfoItem
                                        key={itemIdx}
                                        label={item.label}
                                        value={item.value}
                                        icon={
                                            item.icon && <item.icon size={14} />
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Coordinates */}
                    {coordinates &&
                        coordinates.latitude &&
                        coordinates.longitude && (
                            <div className="pt-2">
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    {coordinates.label ||
                                        `Lihat Lokasi di Google Maps (${coordinates.latitude}, ${coordinates.longitude})`}
                                </a>
                            </div>
                        )}
                </div>
            </div>
        </Modal>
    );
}

function InfoItem({
    label,
    value,
    icon,
}: {
    label: string;
    value: string | number | React.ReactNode | null | undefined;
    icon?: React.ReactNode;
}) {
    return (
        <div className="group p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:border-slate-700">
            <dt className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                {icon}
                {label}
            </dt>
            <dd className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {value || "-"}
            </dd>
        </div>
    );
}
