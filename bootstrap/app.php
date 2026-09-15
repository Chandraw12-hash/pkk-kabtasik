<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \App\Http\Middleware\SecurityHeadersMiddleware::class,
        ]);

        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,

            // 🔥 TAMBAH INI — Middleware Admin Kecamatan
            'kecamatan' => \App\Http\Middleware\KecamatanMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // FIX: paksa SEMUA exception (bukan cuma 404) untuk route /api/*
        // selalu dibalas sebagai JSON, bukan redirect/halaman HTML.
        // Ini yang mencegah ValidationException dkk berujung redirect 302
        // ke route 'login' saat request tidak kirim header Accept: application/json.
        $exceptions->shouldRenderJsonWhen(function (Request $request, \Throwable $e) {
            if ($request->is('api/*')) {
                return true;
            }

            return $request->expectsJson();
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            // Selain cek header Accept, cek juga apakah request-nya lewat
            // prefix /api/ — supaya client (Postman, app mobile) yang lupa
            // set header "Accept: application/json" tetap dapat response
            // JSON, bukan halaman HTML penuh yang sulit di-parse.
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json(['message' => 'Not Found'], 404);
            }

            return Inertia::render('Errors/NotFound')
                ->toResponse($request)
                ->setStatusCode(404);
        });
    })->create();
