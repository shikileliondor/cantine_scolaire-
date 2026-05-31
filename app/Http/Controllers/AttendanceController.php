<?php

namespace App\Http\Controllers;

use App\Http\Requests\AttendanceDailyRequest;
use App\Models\Attendance;
use App\Models\Child;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    /**
     * Display attendance history.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('attendances/index', [
            'attendances' => Attendance::with('child')
                ->when($request->filled('date'), fn ($query) => $query->whereDate('attendance_date', $request->date('date')))
                ->latest('attendance_date')
                ->paginate(10)
                ->withQueryString(),
            'filters' => $request->only('date'),
        ]);
    }

    /**
     * Show the daily attendance form.
     */
    public function daily(Request $request): Response
    {
        $date = $request->filled('date') ? $request->date('date')->toDateString() : Carbon::today()->toDateString();

        return Inertia::render('attendances/daily', [
            'children' => Child::where('status', 'active')->orderBy('last_name')->orderBy('first_name')->get(['id', 'first_name', 'last_name', 'class_name']),
            'attendanceDate' => $date,
            'attendances' => Attendance::whereDate('attendance_date', $date)->get(['child_id', 'is_present', 'meal_served', 'notes']),
        ]);
    }

    /**
     * Store the daily attendance records.
     */
    public function storeDaily(AttendanceDailyRequest $request): RedirectResponse
    {
        foreach ($request->validated('attendances') as $attendance) {
            Attendance::updateOrCreate(
                [
                    'child_id' => $attendance['child_id'],
                    'attendance_date' => $request->validated('attendance_date'),
                ],
                [
                    'is_present' => (bool) ($attendance['is_present'] ?? false),
                    'meal_served' => (bool) ($attendance['meal_served'] ?? false),
                    'notes' => $attendance['notes'] ?? null,
                ],
            );
        }

        Inertia::flash('success', 'Présences enregistrées avec succès.');

        return redirect()->route('attendances.daily', ['current_team' => request()->route('current_team'), 'date' => $request->validated('attendance_date')]);
    }
}
