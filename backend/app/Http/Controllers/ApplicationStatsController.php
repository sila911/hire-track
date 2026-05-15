<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApplicationStatsController extends Controller
{
    private const STATUSES = ['Applied', 'Interviewing', 'Accepted', 'Rejected'];

    /**
     * Aggregated application metrics for the authenticated user.
     */
    public function __invoke(Request $request)
    {
        $rows = $request->user()->applications()
            ->select('status', DB::raw('count(*) as c'))
            ->groupBy('status')
            ->pluck('c', 'status');

        $byStatus = [];
        foreach (self::STATUSES as $status) {
            $byStatus[$status] = (int) ($rows[$status] ?? 0);
        }

        $total = array_sum($byStatus);
        $interviewing = $byStatus['Interviewing'];
        $accepted = $byStatus['Accepted'];

        $interviewRate = $total > 0 ? round($interviewing / $total, 4) : 0.0;
        $successRate = $total > 0 ? round($accepted / $total, 4) : 0.0;

        return response()->json([
            'total' => $total,
            'interview_rate' => $interviewRate,
            'success_rate' => $successRate,
            'by_status' => $byStatus,
        ]);
    }
}
