<?php

namespace App\Http\Requests\Children;

use App\Models\Child;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateChildRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Child|null $child */
        $child = $this->route('child');

        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'matricule' => ['nullable', 'string', 'max:255', Rule::unique('children', 'matricule')->ignore($child)],
            'gender' => ['nullable', 'string', 'max:50'],
            'birth_date' => ['nullable', 'date', 'before_or_equal:today'],
            'class_name' => ['required', 'string', 'max:255'],
            'parent_name' => ['nullable', 'string', 'max:255'],
            'parent_phone' => ['nullable', 'string', 'max:30'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
