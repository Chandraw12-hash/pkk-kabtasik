import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { toast } from "sonner";

interface FlashProps {
    success?: string;
    message?: string;
    error?: string;
}

interface SharedProps {
    flash?: FlashProps;
    errors?: Record<string, string>;
    [key: string]: unknown;
}

export default function Toast() {
    const { flash = {}, errors = {} } = usePage<SharedProps>().props;

    useEffect(() => {
        // Notifikasi Sukses
        if (flash.success) {
            toast.success("Berhasil!", {
                description: flash.success,
            });
        }
        // Fallback untuk 'message'
        else if (flash.message) {
            toast.success("Informasi!", {
                description: flash.message,
            });
        }

        // Notifikasi Error (Flash)
        if (flash.error) {
            toast.error("Gagal!", {
                description: flash.error,
            });
        }

        // Notifikasi Validasi (Peringatan Umum)
        if (errors && Object.keys(errors).length > 0) {
            toast.warning("Peringatan!", {
                description:
                    "Terdapat kesalahan pada inputan Anda. Silakan cek kembali.",
            });
        }
    }, [flash, errors]);

    return null;
}
