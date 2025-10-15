<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('pages/home');
})->name('home');

Route::get('/search', function () {
    return view('pages/search');
})->name('search');

Route::get('/product', function () {
    return view('pages/product');
})->name('product');

Route::get('/profile', function () {
    return view('pages/profile');
})->name('profile');