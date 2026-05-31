<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Child;
use App\Models\Payment;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the canteen dashboard.
     */
    public function __invoke(): Response
    {
        $today = Carbon::today();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_children' => Child::count(),
                'active_children' => Child::where('status', 'active')->count(),
                'present_today' => Attendance::whereDate('attendance_date', $today)->where('is_present', true)->count(),
                'meals_served_today' => Attendance::whereDate('attendance_date', $today)->where('meal_served', true)->count(),
                'revenue_today' => Payment::whereDate('payment_date', $today)->sum('amount'),
                'revenue_month' => Payment::whereBetween('payment_date', [$today->copy()->startOfMonth(), $today->copy()->endOfMonth()])->sum('amount'),
            ],
            'latestPayments' => Payment::with('child')->latest('payment_date')->limit(5)->get(),
            'latestAttendances' => Attendance::with('child')->latest('attendance_date')->limit(5)->get(),
        ]);
    }
}
