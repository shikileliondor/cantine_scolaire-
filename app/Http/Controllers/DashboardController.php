<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Child;
use App\Models\Payment;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the canteen dashboard.
     */
    public function __invoke(): Response
    {
        $today = now()->toDateString();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_children' => Child::count(),
                'active_children' => Child::where('status', 'active')->count(),
                'today_attendances' => Attendance::whereDate('attendance_date', $today)->count(),
                'today_present_children' => Attendance::whereDate('attendance_date', $today)->where('is_present', true)->count(),
                'today_meals_served' => Attendance::whereDate('attendance_date', $today)->where('meal_served', true)->count(),
                'today_revenue' => Payment::whereDate('payment_date', $today)->sum('amount'),
                'month_revenue' => Payment::whereBetween('payment_date', [now()->startOfMonth()->toDateString(), now()->endOfMonth()->toDateString()])->sum('amount'),
            ],
            'latest_payments' => Payment::with('child')
                ->latest('payment_date')
                ->latest()
                ->limit(5)
                ->get(),
            'latest_attendances' => Attendance::with('child')
                ->latest('attendance_date')
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }
}
