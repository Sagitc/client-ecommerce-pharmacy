<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/search', function () {
    return view('pages/search');
})->name('search');

Route::get('/product', function () {
    return view('pages/product');
})->name('product');

Route::get('/profile', function () {
    return view('pages/profile');
})->name('profile');

Route::post('/login', [UserController::class, 'login'])->name('login');

Route::middleware('auth')->group(function () {

    Route::post('/logout', [UserController::class, 'logout'])->name('logout');

});