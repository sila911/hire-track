<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\ApplicationStatsController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/auth/google', [AuthController::class, 'handleGoogleLogin']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function () {
        return auth()->user();
    });
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/user/password', [AuthController::class, 'updatePassword']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('applications/stats', ApplicationStatsController::class);
    Route::get('analytics/summary', [AnalyticsController::class, 'summary']);
    Route::get('analytics/sources', [AnalyticsController::class, 'sources']);
    Route::get('analytics/velocity', [AnalyticsController::class, 'velocity']);
    Route::get('analytics/consistency', [AnalyticsController::class, 'consistency']);
    Route::apiResource('applications', ApplicationController::class);
});
