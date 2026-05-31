<?php

namespace App\Http\Requests\Attendances;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAttendanceRequest extends FormRequest
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
        return [
            'child_id' => ['required', 'integer', Rule::exists('children', 'id')->whereNull('deleted_at')],
            'attendance_date' => ['required', 'date'],
            'is_present' => ['required', 'boolean'],
            'meal_served' => ['required', 'boolean'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
