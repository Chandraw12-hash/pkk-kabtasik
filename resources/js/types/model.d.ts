export interface Permission {
    id: number;
    name: string;
    guard_name?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Role {
    id: number;
    name: string;
    guard_name?: string;
    permissions?: Permission[];
    created_at?: string;
    updated_at?: string;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    email_verified_at?: string;
    roles: Role[] | string[];
    permissions?: string[];
    profile_photo_path?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Skpd {
    id: number;
    nama_skpd: string;
    alamat: string;
    created_at?: string;
    updated_at?: string;
}

export interface NilaiIndeks {
    id: number;
    indeks_spbe_id: number;
    tahun: number;
    nilai: number;
    created_at?: string;
    updated_at?: string;
}

export interface IndeksSpbe {
    id: number;
    nama_indeks: string;
    kode?: string | null;
    parent_id?: number | null;
    jenis: 'indeks' | 'domain' | 'aspek' | 'indikator';
    urutan: number;
    created_at?: string;
    updated_at?: string;
    children?: IndeksSpbe[];
    nilai_indeks?: NilaiIndeks[];
}

export interface Kebijakan {
    id: number;
    judul: string;
    file_path: string;
    deskripsi?: string | null;
    urutan: number;
    created_at?: string;
    updated_at?: string;
}

// ... existing code ...
export interface AppSettings {
    app_name: string;
    app_logo: string | null;
    primary_color: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
    prev_page_url?: string | null;
    next_page_url?: string | null;
}

export interface SharedProps {
    auth: {
        user: User;
    };
    app_settings?: AppSettings;
    flash: {
        success?: string;
        error?: string;
        message?: string;
    };
    errors: Record<string, string>;
    [key: string]: unknown;
}
