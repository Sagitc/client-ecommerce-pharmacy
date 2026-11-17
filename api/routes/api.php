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
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CouponController;

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
Route::get('/categories', [ProductController::class, 'categories']);
Route::get('/users/{id}/avatar', [AuthController::class, 'showAvatar']);

Route::get('/pharmacy-units', [PharmacyUnitController::class, 'index']);
Route::post('/shipping/calculate', [ShippingController::class, 'calculate'])->middleware('throttle:shipping');
Route::get('/coupons/available', [CouponController::class, 'availableCoupons'])->middleware('throttle:coupons');
Route::post('/coupons/validate', [CouponController::class, 'validateCoupon'])->middleware('throttle:coupons');

// --- ROTAS AUTENTICADAS ---
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::post('/auth/avatar', [AuthController::class, 'updateAvatar'])->middleware('throttle:avatar-upload');
    Route::delete('/auth/avatar', [AuthController::class, 'deleteAvatar'])->middleware('throttle:avatar-upload');
    Route::put('/auth/password', [AuthController::class, 'changePassword']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/coupons/my', [CouponController::class, 'myCoupons']);
    Route::post('/coupons/redeem', [CouponController::class, 'redeemCoupon'])->middleware('throttle:coupons');

    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::put('/addresses/{id}', [AddressController::class, 'update']);
    Route::patch('/addresses/{id}/default', [AddressController::class, 'setDefault']);
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);

    // Métodos de pagamento salvos no banco de dados desativados temporariamente (pagamentos processados via gateway Mercado Pago)
    // Route::get('/payment-methods', [PaymentMethodController::class, 'index']);
    // Route::post('/payment-methods', [PaymentMethodController::class, 'store']);
    // Route::patch('/payment-methods/{id}/default', [PaymentMethodController::class, 'setDefault']);
    // Route::delete('/payment-methods/{id}', [PaymentMethodController::class, 'destroy']);

    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/sync', [FavoriteController::class, 'sync']);
    Route::post('/favorites/{productId}/toggle', [FavoriteController::class, 'toggle']);

    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::post('/cart/sync', [CartController::class, 'sync']);
    Route::put('/cart/{productId}', [CartController::class, 'update']);
    Route::delete('/cart/{productId}', [CartController::class, 'destroy']);
    Route::delete('/cart', [CartController::class, 'clear']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store'])->middleware('throttle:orders');

    // Painel Farmacêutico / Admin (ANVISA RDC 44)
    Route::get('/admin/prescriptions', [PrescriptionReviewController::class, 'index']);
    Route::patch('/admin/prescriptions/{id}/review', [PrescriptionReviewController::class, 'review']);
    Route::get('/admin/prescriptions/{id}/file', [PrescriptionReviewController::class, 'download']);
});