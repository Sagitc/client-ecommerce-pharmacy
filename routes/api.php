<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/ping', function () {
    return response()->json(['pong' => true]);
});

Route::get('/products',                 [ProductController::class, 'getAllProducts']);
Route::get('/product/{id}',             [ProductController::class, 'getProductById']);
Route::get('/product/{id}/related',     [ProductController::class, 'getRelatedProductsById']);
Route::get('/products/category/{slug}', [ProductController::class, 'getProductsByCategorySlug']);

Route::get('/search', [ProductController::class, 'getProductsBySearch']);

// Route::get('/categories', [CategoryController::class, 'getAllCategories']);
// Route::get('/categories/{slug}/metadata', [CategoryController::class, 'getCategoryMetadataBySlug']);

Route::post('/cart/mount', [CartController::class, 'mount']);
Route::post('/cart/add',   [CartController::class, 'add']);
Route::post('/cart/removeItem', [CartController::class, 'removeItem']);
Route::post('/cart/removeCart', [CartController::class, 'removeCart']);


// Route::get('/cart/shipping', [CartController::class, 'getShipping']);

// Route::post('/user/login', [UserController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    // Route::post('user/addresses', [UserController::class, 'createAddress']);
    // Route::get('user/addresses', [UserController::class, 'getAddresses']);
    // Route::post('cart/finish', [CartController::class, 'finish']);

    Route::get('/user/get', [UserController::class, 'getUser']);
    Route::get('/cart/get', [CartController::class, 'getCart']);
});
