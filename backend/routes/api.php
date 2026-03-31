<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\GalleryController;

// ============ TEST ROUTE ============
Route::get('/test', function() {
    return response()->json([
        'message' => 'API is working!',
        'status' => 'success',
        'timestamp' => now()
    ]);
});

// ============ MENU ROUTES ============
Route::get('/menu', [MenuController::class, 'index']);
Route::get('/menu/{category}', [MenuController::class, 'getByCategory']);

// ============ RESERVATION ROUTES ============
Route::post('/reservation', [ReservationController::class, 'store']);
Route::get('/reservations', [ReservationController::class, 'index']);

// ============ CONTACT ROUTES ============
Route::post('/contact', [ContactController::class, 'store']);

// ============ NEWSLETTER ROUTES ============
Route::post('/newsletter', [NewsletterController::class, 'store']);

// ============ GALLERY ROUTES ============
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/gallery/{category}', [GalleryController::class, 'getByCategory']);