<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'child_id',
    'attendance_date',
    'is_present',
    'meal_served',
    'notes',
])]
class Attendance extends Model
{
    use SoftDeletes;

    /**
     * Get the child that owns the attendance record.
     *
     * @return BelongsTo<Child, $this>
     */
    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'attendance_date' => 'date',
            'is_present' => 'boolean',
            'meal_served' => 'boolean',
        ];
    }
}
