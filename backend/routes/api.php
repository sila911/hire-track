<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\ApplicationStatsController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('applications/stats', ApplicationStatsController::class);
    Route::apiResource('applications', ApplicationController::class);
});
