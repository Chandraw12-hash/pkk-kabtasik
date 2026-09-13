import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

/**
 * ErrorBoundary — Pengaman Aplikasi React
 *
 * Menangkap error runtime pada komponen anak dan menampilkan
 * halaman fallback yang informatif, sehingga pengguna tidak
 * melihat halaman kosong saat terjadi kesalahan.
 *
 * Penggunaan:
 * <ErrorBoundary>
 *     <App />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<Props, State> {
    state: State = {
        hasError: false,
    };

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error untuk keperluan debugging
        console.error("ErrorBoundary menangkap kesalahan:");
        console.error("Error:", error);
        console.error("Error Info:", errorInfo);
        console.error("Component Stack:", errorInfo.componentStack);

        this.setState({
            error,
            errorInfo,
        });

        // Opsional: Kirim error ke server untuk keperluan monitoring
        // fetch("/api/log-error", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({
        //         message: error.message,
        //         stack: error.stack,
        //         componentStack: errorInfo.componentStack,
        //         url: window.location.href,
        //         timestamp: new Date().toISOString(),
        //     }),
        // });
    }

    handleRefresh = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = "/";
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 font-['Poppins',_sans-serif]">
                    <div className="max-w-md w-full text-center">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-50 border border-rose-100 mb-6">
                            <svg
                                className="w-10 h-10 text-rose-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                            Terjadi Kesalahan
                        </h1>

                        {/* Message */}
                        <p className="text-sm text-slate-500 leading-relaxed mb-8">
                            Maaf, terjadi kesalahan teknis pada halaman ini.
                            Silakan muat ulang halaman atau kembali ke
                            beranda.
                        </p>

                        {/* Error Detail (Hanya Development) */}
                        {import.meta.env.DEV && this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="cursor-pointer text-xs font-semibold text-rose-600 hover:text-rose-700 mb-2">
                                    Detail Kesalahan (Mode Development)
                                </summary>
                                <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 text-left">
                                    <p className="text-xs font-bold text-rose-800 mb-2">
                                        {this.state.error.name}:{" "}
                                        {this.state.error.message}
                                    </p>
                                    <pre className="text-[10px] text-rose-700 whitespace-pre-wrap break-all max-h-40 overflow-y-auto">
                                        {this.state.error.stack}
                                    </pre>
                                </div>
                            </details>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={this.handleRefresh}
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 w-full sm:w-auto"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                Muat Ulang Halaman
                            </button>
                            <button
                                type="button"
                                onClick={this.handleGoHome}
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 w-full sm:w-auto"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                                Kembali ke Beranda
                            </button>
                        </div>

                        {/* Footer */}
                        <p className="mt-8 text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                            Tim Penggerak PKK Kabupaten Tasikmalaya
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
