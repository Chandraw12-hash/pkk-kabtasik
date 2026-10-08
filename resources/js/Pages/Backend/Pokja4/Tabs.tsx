import React from "react";
import {
    Activity,
    ClipboardList,
    Database,
    FileText,
    Users,
} from "lucide-react";

export type Pokja4TabId =
    | "pokja4"
    | "kunjungan"
    | "posyandu"
    | "rekapitulasi"
    | "data_dukung";

interface Props {
    activeTab: Pokja4TabId;
    onTabChange: (tab: Pokja4TabId) => void;
}

const tabs = [
    { id: "pokja4", label: "POKJA IV", icon: FileText },
    { id: "kunjungan", label: "Kunjungan PYD", icon: Users },
    { id: "posyandu", label: "Kegiatan Posyandu", icon: Activity },
    { id: "rekapitulasi", label: "Rekapitulasi", icon: ClipboardList },
    { id: "data_dukung", label: "Data Dukung", icon: Database },
] as const;

export default function Tabs({ activeTab, onTabChange }: Props) {
    return (
        <div className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div
                className="flex items-center gap-1 overflow-x-auto px-2 sm:px-6"
                role="tablist"
                aria-label="Data Pokja IV"
            >
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            id={`pokja4-tab-${tab.id}`}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`pokja4-panel-${tab.id}`}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500 ${
                                isActive
                                    ? "border-slate-700 text-slate-800 dark:border-slate-300 dark:text-slate-100"
                                    : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                            }`}
                        >
                            <Icon size={16} aria-hidden="true" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
