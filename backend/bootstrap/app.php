<?php

use Illuminate\Database\QueryException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (QueryException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Database connection failed. Please ensure your database server is running.',
                    'error' => 'DATABASE_OFFLINE',
                ], 503);
            }
        });

        $exceptions->render(function (PDOException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Unable to connect to the database. Please check your configuration.',
                    'error' => 'DB_CONNECTION_ERROR',
                ], 503);
            }
        });
    })->create();
