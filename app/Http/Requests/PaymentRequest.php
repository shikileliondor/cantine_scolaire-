<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaymentRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'child_id' => ['required', 'exists:children,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'payment_date' => ['required', 'date'],
            'payment_type' => ['required', Rule::in(['daily', 'weekly', 'monthly', 'custom'])],
            'payment_method' => ['required', Rule::in(['cash', 'mobile_money', 'bank_transfer', 'other'])],
            'period_label' => ['nullable', 'string', 'max:255'],
            'reference' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
