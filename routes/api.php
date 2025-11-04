<?php

use App\Http\Controllers\BannerController;
use App\Http\Controllers\ProductController;
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