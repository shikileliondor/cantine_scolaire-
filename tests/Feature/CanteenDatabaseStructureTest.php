<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\Child;
use App\Models\Payment;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CanteenDatabaseStructureTest extends TestCase
{
    use RefreshDatabase;

    public function test_child_has_payments_and_attendances_with_expected_casts_and_defaults(): void
    {
        $child = Child::create([
            'first_name' => 'Aya',
            'last_name' => 'Kouadio',
            'matricule' => 'CAN-001',
            'birth_date' => '2017-10-05',
            'class_name' => 'CE1',
        ]);

        $payment = $child->payments()->create([
            'amount' => 15000,
            'payment_date' => '2026-05-31',
            'payment_type' => 'monthly',
            'payment_method' => 'cash',
        ]);

        $attendance = $child->attendances()->create([
            'attendance_date' => '2026-05-31',
            'is_present' => true,
            'meal_served' => true,
        ]);

        $this->assertSame('active', $child->refresh()->status);
        $this->assertSame('15000.00', $payment->refresh()->amount);
        $this->assertTrue($payment->payment_date->isSameDay('2026-05-31'));
        $this->assertTrue($attendance->refresh()->is_present);
        $this->assertTrue($attendance->meal_served);
        $this->assertTrue($attendance->attendance_date->isSameDay('2026-05-31'));
        $this->assertTrue($child->payments->contains($payment));
        $this->assertTrue($child->attendances->contains($attendance));
        $this->assertTrue($payment->child->is($child));
        $this->assertTrue($attendance->child->is($child));
    }

    public function test_child_can_have_only_one_attendance_per_date(): void
    {
        $child = Child::create([
            'first_name' => 'Yao',
            'last_name' => 'Konan',
        ]);

        Attendance::create([
            'child_id' => $child->id,
            'attendance_date' => '2026-05-31',
        ]);

        $this->expectException(QueryException::class);

        Attendance::create([
            'child_id' => $child->id,
            'attendance_date' => '2026-05-31',
        ]);
    }

    public function test_attendance_defaults_to_not_present_and_no_meal_served(): void
    {
        $child = Child::create([
            'first_name' => 'Aminata',
            'last_name' => 'Traore',
        ]);

        $attendance = Attendance::create([
            'child_id' => $child->id,
            'attendance_date' => '2026-05-31',
        ])->refresh();

        $this->assertFalse($attendance->is_present);
        $this->assertFalse($attendance->meal_served);
    }

    public function test_payment_requires_existing_child(): void
    {
        $this->expectException(QueryException::class);

        Payment::create([
            'child_id' => 999,
            'amount' => 500,
            'payment_date' => '2026-05-31',
            'payment_type' => 'daily',
            'payment_method' => 'mobile_money',
        ]);
    }

    public function test_attendance_requires_existing_child(): void
    {
        $this->expectException(QueryException::class);

        Attendance::create([
            'child_id' => 999,
            'attendance_date' => '2026-05-31',
        ]);
    }
}
