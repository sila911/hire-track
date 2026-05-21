<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }

    public function updatePassword(Request $request)
    {
        $data = $request->validate([
            'current_password' => ['required', 'string', 'current_password'],
            'password' => ['required', 'string', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($data['password']),
        ]);

        return response()->json(['message' => 'Password updated successfully.']);
    }

    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'profile_image_url' => ['nullable', 'string', 'url', 'max:2048'],
        ]);

        $request->user()->update($data);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $request->user(),
        ]);
    }
    public function handleGoogleLogin(Request $request)
    {
        $request->validate(['token' => 'required']);

        try {
            // Fetch user info using Google's token verification endpoint
            // This is more reliable for ID Tokens (JWT) than Socialite's userFromToken
            $response = \Http::get("https://oauth2.googleapis.com/tokeninfo?id_token={$request->token}");

            if (!$response->successful()) {
                \Log::error('Google Token Validation Failed: ' . $response->body());
                return response()->json(['error' => 'Invalid or expired Google token'], 401);
            }

            $googleData = $response->json();

            if (!isset($googleData['email'])) {
                \Log::error('Google response missing email: ' . json_encode($googleData));
                return response()->json(['error' => 'Could not retrieve email from Google'], 401);
            }

            // Find existing user or generate a new profile entry automatically
            $user = User::firstOrCreate(
                ['email' => $googleData['email']],
                [
                    'name' => $googleData['name'] ?? explode('@', $googleData['email'])[0],
                    'password' => Hash::make(Str::random(24)), // Generate secure placeholder string
                ]
            );

            // Update profile image if available and not already set
            if (!$user->profile_image_url && isset($googleData['picture'])) {
                $user->update(['profile_image_url' => $googleData['picture']]);
            }

            // Issue a standard Laravel Sanctum access token
            $authToken = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'token' => $authToken,
                'user' => $user
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Google Auth failure: ' . $e->getMessage());
            
            $message = 'Authentication failed. Please try again later.';
            if ($e instanceof \Illuminate\Database\QueryException || $e instanceof \PDOException) {
                $message = 'Database service is currently unavailable. Please contact support if the issue persists.';
            }

            return response()->json(['error' => $message], 500);
        }
    }
}
