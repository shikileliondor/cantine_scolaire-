<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AttendanceDailyRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'attendance_date' => ['required', 'date'],
            'attendances' => ['required', 'array'],
            'attendances.*.child_id' => ['required', 'exists:children,id'],
            'attendances.*.is_present' => ['boolean'],
            'attendances.*.meal_served' => ['boolean'],
            'attendances.*.notes' => ['nullable', 'string'],
        ];
    }
}
