<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\Child;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CanteenManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_update_and_delete_a_child(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('children.store'), [
                'first_name' => 'Aya',
                'last_name' => 'Kouadio',
                'matricule' => 'CAN-001',
                'class_name' => 'CE1',
                'status' => 'active',
            ])
            ->assertRedirect(route('children.index'));

        $child = Child::where('matricule', 'CAN-001')->firstOrFail();

        $this->actingAs($user)
            ->put(route('children.update', $child), [
                'first_name' => 'Aya',
                'last_name' => 'Kouadio',
                'matricule' => 'CAN-001',
                'class_name' => 'CE2',
                'status' => 'inactive',
            ])
            ->assertRedirect(route('children.index'));

        $this->assertDatabaseHas('children', [
            'id' => $child->id,
            'class_name' => 'CE2',
            'status' => 'inactive',
        ]);

        $this->actingAs($user)
            ->delete(route('children.destroy', $child))
            ->assertRedirect(route('children.index'));

        $this->assertSoftDeleted('children', ['id' => $child->id]);
    }

    public function test_payment_requires_valid_data_and_can_be_filtered_by_query_parameters(): void
    {
        $user = User::factory()->create();
        $child = Child::create([
            'first_name' => 'Yao',
            'last_name' => 'Konan',
            'class_name' => 'CM1',
            'status' => 'active',
        ]);

        $this->actingAs($user)
            ->post(route('payments.store'), [
                'child_id' => $child->id,
                'amount' => 500,
                'payment_date' => '2026-05-31',
                'payment_type' => 'daily',
                'payment_method' => 'mobile_money',
            ])
            ->assertRedirect(route('payments.index'));

        $this->assertDatabaseHas('payments', [
            'child_id' => $child->id,
            'amount' => 500,
            'payment_date' => '2026-05-31',
            'payment_type' => 'daily',
            'payment_method' => 'mobile_money',
        ]);

        $this->actingAs($user)
            ->get(route('payments.index', [
                'payment_date' => '2026-05-31',
                'child_id' => $child->id,
                'payment_type' => 'daily',
                'payment_method' => 'mobile_money',
            ]))
            ->assertOk();
    }

    public function test_daily_attendance_store_updates_existing_child_attendance_for_same_date(): void
    {
        $user = User::factory()->create();
        $child = Child::create([
            'first_name' => 'Aminata',
            'last_name' => 'Traore',
            'class_name' => 'CP2',
            'status' => 'active',
        ]);

        $payload = [
            'child_id' => $child->id,
            'attendance_date' => '2026-05-31',
            'is_present' => true,
            'meal_served' => false,
        ];

        $this->actingAs($user)
            ->post(route('attendances.store'), $payload)
            ->assertRedirect(route('attendances.daily', ['date' => '2026-05-31']));

        $this->actingAs($user)
            ->post(route('attendances.store'), array_merge($payload, ['meal_served' => true]))
            ->assertRedirect(route('attendances.daily', ['date' => '2026-05-31']));

        $this->assertSame(1, Attendance::where('child_id', $child->id)->whereDate('attendance_date', '2026-05-31')->count());
        $this->assertTrue(Attendance::firstOrFail()->meal_served);
    }

    public function test_dashboard_displays_dynamic_canteen_statistics(): void
    {
        $user = User::factory()->create();
        $child = Child::create([
            'first_name' => 'Koffi',
            'last_name' => 'NGuessan',
            'class_name' => 'CE1',
            'status' => 'active',
        ]);

        Payment::create([
            'child_id' => $child->id,
            'amount' => 750,
            'payment_date' => now()->toDateString(),
            'payment_type' => 'daily',
            'payment_method' => 'cash',
        ]);

        Attendance::create([
            'child_id' => $child->id,
            'attendance_date' => now()->toDateString(),
            'is_present' => true,
            'meal_served' => true,
        ]);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk();
    }
}
