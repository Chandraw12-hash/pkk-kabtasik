import { X } from "lucide-react";
import type { ChangeEvent } from "react";
import type { FieldOption, FormField, FormValue } from "./types";

interface ModalFormProps {
    title: string;
    fields: FormField[];
    options: Record<string, FieldOption[]>;
    values: Record<string, FormValue>;
    errors: Record<string, string>;
    processing: boolean;
    onChange: (name: string, value: FormValue) => void;
    onClose: () => void;
    onSubmit: () => void;
}

const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100";

export default function ModalForm({
    title,
    fields,
    options,
    values,
    errors,
    processing,
    onChange,
    onClose,
    onSubmit,
}: ModalFormProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
            <section className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:max-w-3xl sm:rounded-2xl" role="dialog" aria-modal="true" aria-labelledby="dasawisma-form-title">
                <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
                    <h2 id="dasawisma-form-title" className="font-['Poppins',_sans-serif] text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
                    <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 dark:hover:bg-slate-800" aria-label="Tutup formulir"><X size={18} /></button>
                </header>
                <form
                    className="space-y-5 p-5"
                    onSubmit={(event) => {
                        event.preventDefault();
                        onSubmit();
                    }}
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {fields.map((field) => {
                            const fieldOptions = options[field.name] ?? field.options ?? [];
                            const error = errors[field.name];
                            const value = values[field.name] ?? "";
                            const common = {
                                id: `field-${field.name}`,
                                name: field.name,
                                value: value instanceof File ? "" : String(value),
                                required: field.required,
                                "aria-invalid": Boolean(error),
                                "aria-describedby": error ? `error-${field.name}` : undefined,
                                className: `${inputClass} ${error ? "border-rose-500 focus:ring-rose-500" : ""}`,
                                onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                                    const nextValue = field.type === "number" && event.target.value !== ""
                                        ? Number(event.target.value)
                                        : event.target.value;
                                    onChange(field.name, nextValue);
                                },
                            };
                            return (
                                <label key={field.name} htmlFor={`field-${field.name}`} className={`block text-sm font-medium text-slate-700 dark:text-slate-300 ${field.type === "textarea" ? "sm:col-span-2" : ""}`}>
                                    {field.label}{field.required && <span className="ml-1 text-rose-600" aria-label="wajib diisi">*</span>}
                                    {field.type === "textarea" ? (
                                        <textarea {...common} rows={3} />
                                    ) : field.type === "select" ? (
                                        <select {...common}>
                                            <option value="">Pilih {field.label.toLowerCase()}</option>
                                            {fieldOptions.map((option) => (
                                                <option key={String(option.value)} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input {...common} type={field.type} min={field.type === "number" ? 0 : undefined} />
                                    )}
                                    {error && <span id={`error-${field.name}`} className="mt-1 block text-xs text-rose-600" role="alert">{error}</span>}
                                </label>
                            );
                        })}
                    </div>
                    <footer className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:justify-end">
                        <button type="button" onClick={onClose} className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Batal</button>
                        <button type="submit" disabled={processing} className="min-h-11 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
                            {processing ? "Menyimpan..." : "Simpan"}
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
}
