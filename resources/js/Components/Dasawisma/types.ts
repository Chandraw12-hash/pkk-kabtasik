export interface FieldOption {
    value: string | number;
    label: string;
}

export interface FormField {
    name: string;
    label: string;
    type: "text" | "number" | "date" | "select" | "textarea";
    required: boolean;
    rules: string[];
    options?: FieldOption[];
}

export interface DataColumn {
    key: string;
    label: string;
}

export interface DasawismaRecord {
    id: number;
    status: string;
    rejected_reason?: string | null;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedRecords<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    links: PaginationLink[];
}

export interface ResourceStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

export type FormValue = string | number | File | null;
export type FormValues = Record<string, FormValue>;
