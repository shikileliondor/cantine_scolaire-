<?php

namespace App\Http\Controllers;

use App\Http\Requests\Attendances\StoreAttendanceRequest;
use App\Http\Requests\Attendances\UpdateAttendanceRequest;
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
     * Display a paginated listing of attendances.
     */
    public function index(Request $request): Response
    {
        $attendances = Attendance::query()
            ->with('child')
            ->when($request->date('attendance_date'), fn ($query, $attendanceDate) => $query->whereDate('attendance_date', $attendanceDate))
            ->when($request->integer('child_id') > 0, fn ($query) => $query->where('child_id', $request->integer('child_id')))
            ->latest('attendance_date')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Attendances/Index', [
            'attendances' => $attendances,
            'filters' => $request->only(['attendance_date', 'child_id']),
        ]);
    }

    /**
     * Display the daily attendance page for a selected date.
     */
    public function daily(Request $request): Response
    {
        $attendanceDate = $this->requestedDate($request);

        $children = Child::query()
            ->where('status', 'active')
            ->with(['attendances' => fn ($query) => $query->whereDate('attendance_date', $attendanceDate)])
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name', 'matricule', 'class_name']);

        return Inertia::render('Attendances/Daily', [
            'date' => $attendanceDate,
            'children' => $children,
        ]);
    }

    /**
     * Show the form for creating an attendance.
     */
    public function create(): Response
    {
        return Inertia::render('Attendances/Daily', [
            'date' => now()->toDateString(),
            'children' => Child::query()
                ->where('status', 'active')
                ->orderBy('last_name')
                ->orderBy('first_name')
                ->get(['id', 'first_name', 'last_name', 'matricule', 'class_name']),
        ]);
    }

    /**
     * Store or update a daily attendance record.
     */
    public function store(StoreAttendanceRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $attendance = Attendance::withTrashed()->updateOrCreate(
            [
                'child_id' => $validated['child_id'],
                'attendance_date' => $validated['attendance_date'],
            ],
            [
                'is_present' => $validated['is_present'],
                'meal_served' => $validated['meal_served'],
                'notes' => $validated['notes'] ?? null,
            ],
        );

        if ($attendance->trashed()) {
            $attendance->restore();
        }

        return redirect()
            ->route('attendances.daily', ['date' => $validated['attendance_date']])
            ->with('success', __('Attendance saved successfully.'));
    }

    /**
     * Show the form for editing an attendance.
     */
    public function edit(Attendance $attendance): Response
    {
        return Inertia::render('Attendances/Daily', [
            'date' => $attendance->attendance_date->toDateString(),
            'attendance' => $attendance->load('child'),
            'children' => Child::query()
                ->where('status', 'active')
                ->orderBy('last_name')
                ->orderBy('first_name')
                ->get(['id', 'first_name', 'last_name', 'matricule', 'class_name']),
        ]);
    }

    /**
     * Update the specified attendance.
     */
    public function update(UpdateAttendanceRequest $request, Attendance $attendance): RedirectResponse
    {
        $attendance->update($request->validated());

        return redirect()
            ->route('attendances.daily', ['date' => $attendance->attendance_date->toDateString()])
            ->with('success', __('Attendance updated successfully.'));
    }

    /**
     * Remove the specified attendance.
     */
    public function destroy(Attendance $attendance): RedirectResponse
    {
        $attendanceDate = $attendance->attendance_date->toDateString();

        $attendance->delete();

        return redirect()
            ->route('attendances.daily', ['date' => $attendanceDate])
            ->with('success', __('Attendance deleted successfully.'));
    }

    /**
     * Get the requested attendance date, defaulting to today.
     */
    private function requestedDate(Request $request): string
    {
        if ($request->date('date')) {
            return Carbon::parse($request->date('date'))->toDateString();
        }

        return now()->toDateString();
    }
}
