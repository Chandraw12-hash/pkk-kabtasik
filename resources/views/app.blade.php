<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />

    <!-- Meta Tags untuk SEO -->
    <meta name="description" content="PKK Kabupaten Tasikmalaya - Pemberdayaan dan Kesejahteraan Keluarga menuju Sejahtera & Mandiri. Informasi 10 Program Pokok PKK, kegiatan, dan berita terbaru." />
    <meta name="keywords" content="PKK, Tasikmalaya, Pemberdayaan Keluarga, Kesejahteraan Keluarga, 10 Program Pokok PKK, Pokja PKK" />
    <meta name="author" content="PKK Kabupaten Tasikmalaya" />

    <!-- Open Graph / Social Media -->
    <meta property="og:title" content="PKK Kabupaten Tasikmalaya - Sejahtera & Mandiri" />
    <meta property="og:description" content="Pemberdayaan dan Kesejahteraan Keluarga Kabupaten Tasikmalaya. Sinergi pemberdayaan masyarakat menuju kemajuan berbasis kearifan lokal." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{{ url('/') }}" />
    <meta property="og:image" content="{{ asset('assets/logo/logotasik.png') }}" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="PKK Kabupaten Tasikmalaya - Sejahtera & Mandiri" />
    <meta name="twitter:description" content="Pemberdayaan dan Kesejahteraan Keluarga Kabupaten Tasikmalaya" />
    <meta name="twitter:image" content="{{ asset('assets/logo/logotasik.png') }}" />

    @viteReactRefresh
    @routes
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="{{ asset('assets/logo/logotasik.png') }}">
    <link rel="apple-touch-icon" href="{{ asset('assets/logo/logotasik.png') }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet">

    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* Scroll behavior */
        html {
            scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
            background: #e11d48;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #be123c;
        }
    </style>
</head>

<body class="font-sans antialiased bg-slate-50 text-slate-900">
    @inertia
</body>

</html>
