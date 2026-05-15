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
            'company' => 'required|string',
            'role' => 'required|string',
            'status' => 'required|in:Applied,Interviewing,Accepted,Rejected',
            'applied_at' => 'required|date',
        ]);

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

        $application->update($request->only('status', 'company', 'role'));

        return $application;
    }

    public function destroy(Application $application)
    {
        $application->delete();

        return response()->noContent();
    }
}
