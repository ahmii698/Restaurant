<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\Admin\HeroStatController;
use App\Http\Controllers\Admin\PasswordResetController;  // ← YEH ADD KARO

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

// ============ FORGOT PASSWORD ROUTES ============  ← YEH ADD KARO
Route::post('/admin/forgot-password/send-otp', [PasswordResetController::class, 'sendOtp']);
Route::post('/admin/forgot-password/verify-otp', [PasswordResetController::class, 'verifyOtp']);
Route::post('/admin/forgot-password/reset', [PasswordResetController::class, 'resetPassword']);

// ============ STATS ROUTES ============
Route::prefix('admin')->group(function () {
    Route::apiResource('hero-stats', HeroStatController::class);
    Route::post('hero-stats/update-order', [HeroStatController::class, 'updateOrder']);
});