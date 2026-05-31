<?php

namespace App\Http\Requests\Attendances;

use App\Models\Attendance;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAttendanceRequest extends FormRequest
{
    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if (! $this->filled('attendance_date')) {
            $this->merge(['attendance_date' => now()->toDateString()]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Attendance|null $attendance */
        $attendance = $this->route('attendance');

        return [
            'child_id' => ['required', 'integer', Rule::exists('children', 'id')->whereNull('deleted_at')],
            'attendance_date' => [
                'required',
                'date',
                Rule::unique('attendances', 'attendance_date')
                    ->where(fn ($query) => $query->where('child_id', $this->integer('child_id')))
                    ->ignore($attendance),
            ],
            'is_present' => ['required', 'boolean'],
            'meal_served' => ['required', 'boolean'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
