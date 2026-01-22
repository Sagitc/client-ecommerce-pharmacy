<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserAvatarController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/search', function () {
    return view('pages/search');
})->name('search');

Route::get('/profile', function () {
    return view('pages/profile');
})->name('profile');

Route::get('/product/{id}', [ProductController::class, 'product_view'])->name('product');


Route::post('/login', [UserController::class, 'login'])->name('login');
Route::post('/register', [UserController::class, 'register'])->name('register');

Route::middleware('auth')->group(function () {

    Route::get('/user/get', [UserController::class, 'getUser']);
    Route::post('/user/password-change', [UserController::class, 'updatePassword'])->name('updatePassword');
    Route::post('/user/phone-change', [UserController::class, 'updatePhone'])->name('updatePhone');
    Route::post('/user/email-change', [UserController::class, 'updateEmail'])->name('updateEmail');
    Route::get('/user/favorites', [UserController::class, 'getUserFavorites']);
    Route::get('/user/addresses', [UserController::class, 'getUserAddresses']);

    Route::post('/user/favorites/add', [UserController::class, 'addUserFavorite']);
    Route::post('/user/favorites/remove', [UserController::class, 'removeUserFavorite']);

    Route::post('/user/addresses/add', [AddressController::class, 'addAddress'])->name('addAddress');
    Route::post('/user/addresses/remove', [AddressController::class, 'removeAddress']);
    Route::post('/user/addresses/update', [AddressController::class, 'updateAddress']);
    Route::post('/user/addresses/set-default', [AddressController::class, 'setDefaultAddress']);
    Route::get('/user/addresses', [AddressController::class, 'getAddresses']);

    Route::post('/avatar/upload', [UserAvatarController::class, 'upload'])->name('uploadAvatar');
    Route::post('/avatar/delete', [UserAvatarController::class, 'delete'])->name('deleteAvatar');

    Route::get('/cart/get', [CartController::class, 'getCart']);
    Route::post('/cart/add', [CartController::class, 'addItemToCart']);
    Route::post('/cart/remove', [CartController::class, 'removeFromCart']);
    Route::post('/cart/update-quantity', [CartController::class, 'updateItemQuantity']);

    Route::post('/orders', [OrderController::class, 'store'])->name('createOrder');
    Route::get('/orders', [OrderController::class, 'index'])->name('getOrders');
    Route::get('/orders/{id}', [OrderController::class, 'show'])->name('getOrder');
    Route::patch('/orders/{id}/cancel', [OrderController::class, 'cancel'])->name('cancelOrder');

    Route::get('/admin/orders', [OrderController::class, 'adminIndex'])->name('adminGetOrders');
    Route::patch('/admin/orders/{id}/status', [OrderController::class, 'updateStatus'])->name('updateOrderStatus');

    Route::post('/logout', [UserController::class, 'logout'])->name('logout');
});
