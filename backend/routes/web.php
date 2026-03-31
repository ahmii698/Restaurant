<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\HeroController;
use App\Http\Controllers\AboutController;  // Add this line

// Home page
Route::get('/', function () {
    return view('welcome');
});

// ============ API ROUTES ============

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

// Gallery routes
Route::get('/api/gallery', [GalleryController::class, 'index']);
Route::get('/api/gallery/{category}', [GalleryController::class, 'getByCategory']);

// Testimonials routes
Route::get('/api/testimonials', [TestimonialController::class, 'index']);
Route::get('/api/testimonials/active', [TestimonialController::class, 'getActive']);

// Hero routes
Route::get('/api/hero', [HeroController::class, 'getHeroContent']);

// ============ ABOUT ROUTES ============
Route::get('/api/about', [AboutController::class, 'getAboutContent']);