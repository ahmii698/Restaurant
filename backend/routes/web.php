<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\HeroController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\ImageUploadController;  // Add this line

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

// About routes
Route::get('/api/about', [AboutController::class, 'getAboutContent']);

// ============ ADMIN AUTH ROUTES ============
Route::post('/api/admin/login', [AdminAuthController::class, 'login']);
Route::post('/api/admin/logout', [AdminAuthController::class, 'logout']);
Route::get('/api/admin/verify', [AdminAuthController::class, 'verify']);

// ============ ADMIN MANAGEMENT ROUTES ============

// Dashboard Stats
Route::get('/api/admin/dashboard', [AdminController::class, 'dashboard']);

// Reservations Management
Route::get('/api/admin/reservations', [AdminController::class, 'getReservations']);
Route::put('/api/admin/reservations/{id}', [AdminController::class, 'updateReservation']);
Route::delete('/api/admin/reservations/{id}', [AdminController::class, 'deleteReservation']);

// Menu Items Management
Route::get('/api/admin/menu', [AdminController::class, 'getMenu']);
Route::post('/api/admin/menu', [AdminController::class, 'storeMenu']);
Route::put('/api/admin/menu/{id}', [AdminController::class, 'updateMenu']);
Route::delete('/api/admin/menu/{id}', [AdminController::class, 'deleteMenu']);

// Gallery Management
Route::get('/api/admin/gallery', [AdminController::class, 'getGallery']);
Route::post('/api/admin/gallery', [AdminController::class, 'storeGallery']);
Route::put('/api/admin/gallery/{id}', [AdminController::class, 'updateGallery']);
Route::delete('/api/admin/gallery/{id}', [AdminController::class, 'deleteGallery']);

// Testimonials Management
Route::get('/api/admin/testimonials', [AdminController::class, 'getTestimonials']);
Route::post('/api/admin/testimonials', [AdminController::class, 'storeTestimonial']);
Route::put('/api/admin/testimonials/{id}', [AdminController::class, 'updateTestimonial']);
Route::delete('/api/admin/testimonials/{id}', [AdminController::class, 'deleteTestimonial']);

// Hero Section Management
Route::get('/api/admin/hero', [AdminController::class, 'getHero']);
Route::put('/api/admin/hero/{id}', [AdminController::class, 'updateHero']);

// ============ HERO STATS MANAGEMENT ============
Route::get('/api/admin/hero-stats', [AdminController::class, 'getHeroStats']);
Route::post('/api/admin/hero-stats', [AdminController::class, 'storeHeroStat']);
Route::put('/api/admin/hero-stats/{id}', [AdminController::class, 'updateHeroStat']);
Route::delete('/api/admin/hero-stats/{id}', [AdminController::class, 'deleteHeroStat']);

// About Section Management
Route::get('/api/admin/about', [AdminController::class, 'getAbout']);
Route::put('/api/admin/about/{id}', [AdminController::class, 'updateAbout']);
Route::post('/api/admin/about/features', [AdminController::class, 'storeFeature']);
Route::put('/api/admin/about/features/{id}', [AdminController::class, 'updateFeature']);
Route::delete('/api/admin/about/features/{id}', [AdminController::class, 'deleteFeature']);

// ============ IMAGE UPLOAD ROUTE ============
Route::post('/api/admin/upload-image', [ImageUploadController::class, 'upload']);