<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function sources(Request $request)
    {
        $sources = $request->user()->applications()
            ->select('source', 
                DB::raw('count(*) as total_apps'),
                DB::raw('sum(case when status in ("Interviewing", "Accepted", "Rejected") then 1 else 0 end) as interviews')
            )
            ->groupBy('source')
            ->get()
            ->map(function ($item) {
                $item->interview_rate = $item->total_apps > 0 
                    ? round(($item->interviews / $item->total_apps) * 100, 1) 
                    : 0;
                return $item;
            });

        return response()->json($sources);
    }

    public function summary(Request $request)
    {
        $counts = $request->user()->applications()
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        return response()->json([
            'total_applied' => (int) ($counts['Applied'] ?? 0),
            'total_interviewing' => (int) ($counts['Interviewing'] ?? 0),
            'total_accepted' => (int) ($counts['Accepted'] ?? 0),
            'total_rejected' => (int) ($counts['Rejected'] ?? 0),
        ]);
    }

    public function velocity(Request $request)
    {
        $apps = $request->user()->applications()
            ->whereIn('status', ['Accepted', 'Rejected', 'Interviewing'])
            ->get(['source', 'created_at', 'updated_at']);

        $velocity = $apps->groupBy('source')->map(function ($group, $source) {
            $avgDays = $group->avg(function ($app) {
                return $app->created_at->diffInDays($app->updated_at);
            });

            return [
                'source' => $source,
                'avg_days' => round($avgDays, 1)
            ];
        })->values();

        return response()->json($velocity);
    }

    public function consistency(Request $request)
    {
        // Get last 12 weeks of applications
        $apps = $request->user()->applications()
            ->where('created_at', '>=', now()->subWeeks(12))
            ->get(['created_at']);

        // Group by week start date
        $consistency = $apps->groupBy(function ($app) {
            return $app->created_at->startOfWeek()->format('M d');
        })->map(function ($group, $week) {
            return [
                'week' => $week,
                'count' => $group->count()
            ];
        })->values();

        return response()->json($consistency);
    }
}
