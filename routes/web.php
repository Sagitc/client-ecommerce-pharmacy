<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
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
    Route::post('/logout', [UserController::class, 'logout'])->name('logout');

});