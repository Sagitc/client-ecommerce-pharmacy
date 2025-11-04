<?php

use App\Http\Controllers\BannerController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/ping', function () {
    return response()->json(['pong' => true]);
});

Route::get('/banners',      [BannerController::class,  'getAllBanners' ]);

Route::get('/products',     [ProductController::class, 'getAllProducts']);
Route::get('/product/{id}', [ProductController::class, 'getProductById']);
Route::get('/product/{id}/related', [ProductController::class, 'getRelatedProductsById']);

Route::get('/categories', [CategoryController::class, 'getAllCategories']);
Route::get('/categories/{slug}/metadata', [CategoryController::class, 'getCategoryMetadataBySlug']);

Route::post('/cart/mount', [CartController::class, 'mount']);
Route::get('/cart/shipping', [CartController::class, 'getShipping']);

Route::post('/user/login', [UserController::class, 'login']);
Route::post('/user/register', [UserController::class, 'register']);
