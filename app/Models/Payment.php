<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

#[Fillable([
    'child_id',
    'amount',
    'payment_date',
    'payment_type',
    'payment_method',
    'period_label',
    'reference',
    'notes',
])]
class Payment extends Model
{
    use SoftDeletes;

    /**
     * Get the child that owns the payment.
     *
     * @return BelongsTo<Child, $this>
     */
    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }

    /**
     * Store payment dates as date-only values.
     *
     * @return Attribute<string, string>
     */
    protected function paymentDate(): Attribute
    {
        return Attribute::make(
            set: fn (string $value): string => Carbon::parse($value)->toDateString(),
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'payment_date' => 'date',
        ];
    }
}
