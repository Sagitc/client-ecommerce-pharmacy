<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('pages/home');
})->name('home');

Route::get('/search', function () {
    return view('pages/search');
});

Route::get('/product', function () {
    return view('pages/product');
})->name('product');

Route::get('/perfil', function () {
    return view('pages/perfil');
})->name('perfil');