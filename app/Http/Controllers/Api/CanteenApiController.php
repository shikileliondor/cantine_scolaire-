<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AttendanceDailyRequest;
use App\Http\Requests\ChildRequest;
use App\Http\Requests\PaymentRequest;
use App\Models\Attendance;
use App\Models\Child;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CanteenApiController extends Controller
{
    public function children(Request $request): JsonResponse
    {
        $search = $request->string('search')->toString();

        $children = Child::query()
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('matricule', 'like', "%{$search}%")
                        ->orWhere('class_name', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($request->integer('per_page', 10));

        return response()->json($children);
    }

    public function storeChild(ChildRequest $request): JsonResponse
    {
        $child = Child::create($request->validated());

        return response()->json($child, 201);
    }

    public function showChild(string $currentTeam, Child $child): JsonResponse
    {
        return response()->json($child);
    }

    public function updateChild(ChildRequest $request, string $currentTeam, Child $child): JsonResponse
    {
        $child->update($request->validated());

        return response()->json($child->fresh());
    }

    public function destroyChild(string $currentTeam, Child $child): JsonResponse
    {
        $child->delete();

        return response()->json(null, 204);
    }

    public function payments(Request $request): JsonResponse
    {
        $payments = Payment::with('child')
            ->when($request->filled('child_id'), fn ($query) => $query->where('child_id', $request->integer('child_id')))
            ->when($request->filled('date'), fn ($query) => $query->whereDate('payment_date', $request->date('date')))
            ->when($request->filled('type'), fn ($query) => $query->where('payment_type', $request->string('type')))
            ->when($request->filled('mode'), fn ($query) => $query->where('payment_method', $request->string('mode')))
            ->latest('payment_date')
            ->paginate($request->integer('per_page', 10));

        return response()->json($payments);
    }

    public function storePayment(PaymentRequest $request): JsonResponse
    {
        $payment = Payment::create($request->validated())->load('child');

        return response()->json($payment, 201);
    }

    public function showPayment(string $currentTeam, Payment $payment): JsonResponse
    {
        return response()->json($payment->load('child'));
    }

    public function updatePayment(PaymentRequest $request, string $currentTeam, Payment $payment): JsonResponse
    {
        $payment->update($request->validated());

        return response()->json($payment->fresh()->load('child'));
    }

    public function destroyPayment(string $currentTeam, Payment $payment): JsonResponse
    {
        $payment->delete();

        return response()->json(null, 204);
    }

    public function attendances(Request $request): JsonResponse
    {
        $attendances = Attendance::with('child')
            ->when($request->filled('date'), fn ($query) => $query->whereDate('attendance_date', $request->date('date')))
            ->latest('attendance_date')
            ->paginate($request->integer('per_page', 10));

        return response()->json($attendances);
    }

    public function storeDailyAttendances(AttendanceDailyRequest $request): JsonResponse
    {
        $attendanceDate = $request->date('attendance_date')->toDateString();

        $records = collect($request->validated('attendances'))->map(function (array $attendance) use ($attendanceDate): Attendance {
            return Attendance::updateOrCreate(
                [
                    'child_id' => $attendance['child_id'],
                    'attendance_date' => $attendanceDate,
                ],
                [
                    'is_present' => (bool) ($attendance['is_present'] ?? false),
                    'meal_served' => (bool) ($attendance['meal_served'] ?? false),
                    'notes' => $attendance['notes'] ?? null,
                ],
            );
        });

        return response()->json([
            'data' => $records->load('child')->values(),
        ], 201);
    }

    public function destroyAttendance(string $currentTeam, Attendance $attendance): JsonResponse
    {
        $attendance->delete();

        return response()->json(null, 204);
    }
}
