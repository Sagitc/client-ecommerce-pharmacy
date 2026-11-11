<?php
// api/routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\PharmacyUnitController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ShippingController;
use App\Http\Controllers\Api\PrescriptionReviewController;

// --- ROTAS PÚBLICAS ---
Route::middleware('throttle:auth')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
});

Route::middleware('throttle:password-reset')->group(function () {
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
});

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/pharmacy-units', [PharmacyUnitController::class, 'index']);
Route::post('/shipping/calculate', [ShippingController::class, 'calculate'])->middleware('throttle:shipping');

// --- ROTAS AUTENTICADAS ---
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store'])->middleware('throttle:orders');

    // Painel Farmacêutico / Admin (ANVISA RDC 44)
    Route::get('/admin/prescriptions', [PrescriptionReviewController::class, 'index']);
    Route::patch('/admin/prescriptions/{id}/review', [PrescriptionReviewController::class, 'review']);
    Route::get('/admin/prescriptions/{id}/file', [PrescriptionReviewController::class, 'download']);
});