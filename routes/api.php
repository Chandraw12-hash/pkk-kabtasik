<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\IndeksSpbeApiController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('throttle:60,1')->group(function () {
    Route::get('/spbe/dashboard', [IndeksSpbeApiController::class, 'getDashboardData']);
    Route::get('/spbe/tree', [IndeksSpbeApiController::class, 'getTreeData']);
});
