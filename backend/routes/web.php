<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\NewsletterController;

// Home page
Route::get('/', function () {
    return view('welcome');
});

// ============ API ROUTES (Added here because api.php not loading) ============

// Test route
Route::get('/api/test', function() {
    return response()->json([
        'message' => 'API is working!',
        'status' => 'success',
        'timestamp' => now()
    ]);
});

// Menu routes
Route::get('/api/menu', [MenuController::class, 'index']);
Route::get('/api/menu/{category}', [MenuController::class, 'getByCategory']);

// Reservation routes
Route::post('/api/reservation', [ReservationController::class, 'store']);
Route::get('/api/reservations', [ReservationController::class, 'index']);

// Contact route
Route::post('/api/contact', [ContactController::class, 'store']);

// Newsletter route
Route::post('/api/newsletter', [NewsletterController::class, 'store']);