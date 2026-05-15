<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->applications;
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'company' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'status' => 'nullable|in:Applied,Interviewing,Accepted,Rejected',
            'applied_at' => 'required|date',
            'logo_url' => 'nullable|string|url|max:2048',
        ]);

        $data['status'] = $data['status'] ?? 'Applied';

        return $request->user()->applications()->create($data);
    }

    public function show(Request $request, Application $application)
    {
        if ($request->user()->id !== $application->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $application;
    }

    public function update(Request $request, Application $application)
    {
        // Only the owner can update
        if ($request->user()->id !== $application->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'company' => 'sometimes|string|max:255',
            'role' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:Applied,Interviewing,Accepted,Rejected',
            'applied_at' => 'sometimes|date',
            'logo_url' => 'nullable|string|url|max:2048',
        ]);

        $application->update($data);

        return $application->fresh();
    }

    public function destroy(Request $request, Application $application)
    {
        if ($request->user()->id !== $application->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $application->delete();

        return response()->noContent();
    }
}
