<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8" />

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />

    <!-- SEO -->
    <meta
        name="description"
        content="Situs resmi Tim Penggerak PKK Kabupaten Tasikmalaya sebagai media informasi, komunikasi, dan publikasi kegiatan pemberdayaan dan kesejahteraan keluarga."
    />

    <meta
    name="keywords"
        content="PKK Kabupaten Tasikmalaya, TP PKK Tasikmalaya, Pemberdayaan Keluarga, Kesejahteraan Keluarga, 10 Program Pokok PKK, Pokja PKK"
    />

    <meta
        name="author"
        content="Tim Penggerak PKK Kabupaten Tasikmalaya"
    />

    <meta
        name="robots"
        content="index, follow"
    />

    <meta
        name="language"
        content="id"
    />

    <!-- Open Graph -->
    <meta
        property="og:type"
        content="website"
    />

    <meta
        property="og:locale"
        content="id_ID"
    />

    <meta
        property="og:title"
        content="PKK Kabupaten Tasikmalaya - Sejahtera & Mandiri"
    />

    <meta
        property="og:description"
        content="Situs resmi Tim Penggerak PKK Kabupaten Tasikmalaya sebagai media informasi, komunikasi, dan publikasi kegiatan pemberdayaan dan kesejahteraan keluarga."
    />

    <meta
        property="og:url"
        content="{{ url('/') }}"
    />

    <meta
        property="og:image"
        content="{{ asset('assets/logo/logotasik.png') }}"
    />

    <!-- Twitter Card -->
    <meta
        name="twitter:card"
        content="summary_large_image"
    />

    <meta
        name="twitter:title"
        content="PKK Kabupaten Tasikmalaya - Sejahtera & Mandiri"
    />

    <meta
        name="twitter:description"
        content="Situs resmi Tim Penggerak PKK Kabupaten Tasikmalaya."
    />

    <meta
        name="twitter:image"
        content="{{ asset('assets/logo/logotasik.png') }}"
    />

    <!-- Favicon -->
    <link
        rel="icon"
        type="image/png"
        href="{{ asset('assets/logo/logotasik.png') }}"
    />

    <link
        rel="apple-touch-icon"
        href="{{ asset('assets/logo/logotasik.png') }}"
    />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin
    >

    <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
        rel="stylesheet"
    >

    @viteReactRefresh
    @routes
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead

    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
        }

        html {
            scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
            background: #0d9488;
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #0f766e;
        }
    </style>
</head>

<body class="font-sans antialiased bg-slate-50 text-slate-900">

    @inertia

</body>

</html>
