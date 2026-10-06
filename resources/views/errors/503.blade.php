<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sedang Perawatan — PKK Kabupaten Tasikmalaya</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #0f766e 0%, #134e4a 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            color: #fff;
        }
        .card {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 24px;
            padding: 48px 40px;
            max-width: 480px;
            width: 100%;
            text-align: center;
            backdrop-filter: blur(8px);
        }
        .icon {
            width: 72px;
            height: 72px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            margin-bottom: 24px;
        }
        h1 { font-size: 24px; margin-bottom: 12px; }
        p { font-size: 15px; opacity: 0.85; line-height: 1.6; margin-bottom: 8px; }
        .retry { font-size: 13px; opacity: 0.65; margin-top: 16px; }
        button {
            margin-top: 24px;
            background: #fff;
            color: #0f766e;
            border: none;
            font-weight: 700;
            font-size: 15px;
            padding: 12px 32px;
            border-radius: 12px;
            cursor: pointer;
        }
        button:hover { background: #f0fdfa; }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">🛠️</div>
        <h1>Situs Sedang Perawatan</h1>
        <p>Sistem PKK Kabupaten Tasikmalaya sedang diperbaiki sebentar oleh admin.</p>
        <p>Silakan kembali lagi beberapa saat lagi. Terima kasih.</p>
        <button onclick="location.reload()">Muat Ulang Halaman</button>
        <p class="retry">Otomatis mencoba lagi dalam 60 detik…</p>
    </div>
    <script>
        setTimeout(function () { location.reload(); }, 60000);
    </script>
</body>
</html>
