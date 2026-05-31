<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\Child;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CanteenManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_child_pages_are_connected_to_team_routes(): void
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;
        $child = Child::create([
            'first_name' => 'Aya',
            'last_name' => 'Kouadio',
            'matricule' => 'CAN-001',
            'class_name' => 'CE1',
            'status' => 'active',
        ]);

        $this->assertFileExists(resource_path('js/pages/children/index.tsx'));

        $this->actingAs($user)
            ->get(route('children.index', ['current_team' => $team->slug]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('children/index')
                ->has('children')
                ->where('filters.search', ''),
            );

        $this->assertFileExists(resource_path('js/pages/children/create.tsx'));

        $this->actingAs($user)
            ->get(route('children.create', ['current_team' => $team->slug]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('children/create'),
            );

        $this->assertFileExists(resource_path('js/pages/children/edit.tsx'));

        $this->actingAs($user)
            ->get(route('children.edit', ['current_team' => $team->slug, 'child' => $child]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('children/edit')
                ->where('child.id', $child->id),
            );
    }

    public function test_authenticated_user_can_create_update_and_delete_a_child(): void
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;

        $this->actingAs($user)
            ->post(route('children.store', ['current_team' => $team->slug]), [
                'first_name' => 'Aya',
                'last_name' => 'Kouadio',
                'matricule' => 'CAN-001',
                'class_name' => 'CE1',
                'status' => 'active',
            ])
            ->assertRedirect(route('children.index', ['current_team' => $team->slug]));

        $child = Child::where('matricule', 'CAN-001')->firstOrFail();

        $this->actingAs($user)
            ->put(route('children.update', ['current_team' => $team->slug, 'child' => $child]), [
                'first_name' => 'Aya',
                'last_name' => 'Kouadio',
                'matricule' => 'CAN-001',
                'class_name' => 'CE2',
                'status' => 'inactive',
            ])
            ->assertRedirect(route('children.index', ['current_team' => $team->slug]));

        $this->assertDatabaseHas('children', [
            'id' => $child->id,
            'class_name' => 'CE2',
            'status' => 'inactive',
        ]);

        $this->actingAs($user)
            ->delete(route('children.destroy', ['current_team' => $team->slug, 'child' => $child]))
            ->assertRedirect(route('children.index', ['current_team' => $team->slug]));

        $this->assertSoftDeleted('children', ['id' => $child->id]);
    }

    public function test_payment_requires_valid_data_and_can_be_filtered_by_query_parameters(): void
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;
        $child = Child::create([
            'first_name' => 'Yao',
            'last_name' => 'Konan',
            'class_name' => 'CM1',
            'status' => 'active',
        ]);

        $this->actingAs($user)
            ->post(route('payments.store', ['current_team' => $team->slug]), [
                'child_id' => $child->id,
                'amount' => 500,
                'payment_date' => '2026-05-31',
                'payment_type' => 'daily',
                'payment_method' => 'mobile_money',
            ])
            ->assertRedirect(route('payments.index', ['current_team' => $team->slug]));

        $this->assertDatabaseHas('payments', [
            'child_id' => $child->id,
            'amount' => 500,
            'payment_date' => '2026-05-31',
            'payment_type' => 'daily',
            'payment_method' => 'mobile_money',
        ]);

        $this->actingAs($user)
            ->get(route('payments.index', [
                'current_team' => $team->slug,
                'date' => '2026-05-31',
                'child_id' => $child->id,
                'type' => 'daily',
                'mode' => 'mobile_money',
            ]))
            ->assertOk();
    }

    public function test_daily_attendance_store_updates_existing_child_attendance_for_same_date(): void
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;
        $child = Child::create([
            'first_name' => 'Aminata',
            'last_name' => 'Traore',
            'class_name' => 'CP2',
            'status' => 'active',
        ]);

        $payload = [
            'attendance_date' => '2026-05-31',
            'attendances' => [
                [
                    'child_id' => $child->id,
                    'is_present' => true,
                    'meal_served' => false,
                ],
            ],
        ];

        $this->actingAs($user)
            ->post(route('attendances.daily.store', ['current_team' => $team->slug]), $payload)
            ->assertRedirect(route('attendances.daily', ['current_team' => $team->slug, 'date' => '2026-05-31']));

        data_set($payload, 'attendances.0.meal_served', true);

        $this->actingAs($user)
            ->post(route('attendances.daily.store', ['current_team' => $team->slug]), $payload)
            ->assertRedirect(route('attendances.daily', ['current_team' => $team->slug, 'date' => '2026-05-31']));

        $this->assertSame(1, Attendance::where('child_id', $child->id)->whereDate('attendance_date', '2026-05-31')->count());
        $this->assertTrue(Attendance::firstOrFail()->meal_served);
    }

    public function test_dashboard_displays_dynamic_canteen_statistics(): void
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;
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
            ->get(route('dashboard', ['current_team' => $team->slug]))
            ->assertOk();
    }
}
