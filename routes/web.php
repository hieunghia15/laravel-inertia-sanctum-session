<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware('guest')->group(function () {
    Route::inertia('/register', 'register')->name('register');
    Route::inertia('/login', 'login')->name('login');
});

Route::middleware('auth')->group(function () {
    Route::inertia('/dashboard', 'dashboard')->name('dashboard');
    Route::get('/logout', function () {
        return redirect()->route('home');
    });
});
