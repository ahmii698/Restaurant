<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\NewsletterController;

// Test route - yeh check karne ke liye
Route::get('/test', function() {
    return response()->json(['message' => 'API is working!']);
});

// Menu Routes
Route::get('/menu', [MenuController::class, 'index']);
Route::get('/menu/{category}', [MenuController::class, 'getByCategory']);

// Reservation Routes
Route::post('/reservation', [ReservationController::class, 'store']);
Route::get('/reservations', [ReservationController::class, 'index']);

// Contact Routes
Route::post('/contact', [ContactController::class, 'store']);

// Newsletter Routes
Route::post('/newsletter', [NewsletterController::class, 'store']);