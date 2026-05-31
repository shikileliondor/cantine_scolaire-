<?php

namespace Tests\Feature;

use App\Enums\TeamRole;
use App\Models\Attendance;
use App\Models\Child;
use App\Models\Payment;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\CanteenTestSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CanteenTestSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_seeds_deterministic_canteen_test_data(): void
    {
        $this->seed(CanteenTestSeeder::class);

        $user = User::where('email', 'test@example.com')->firstOrFail();
        $team = Team::where('slug', 'cantine-test')->firstOrFail();

        $this->assertTrue($user->isCurrentTeam($team));
        $this->assertSame(TeamRole::Owner, $user->teamRole($team));
        $this->assertSame(4, Child::count());
        $this->assertSame(3, Payment::count());
        $this->assertSame(3, Attendance::count());

        $this->assertDatabaseHas('children', [
            'matricule' => 'CAN-001',
            'first_name' => 'Aya',
            'class_name' => 'CE1',
            'status' => 'active',
        ]);

        $this->assertDatabaseHas('payments', [
            'reference' => 'TEST-PAY-2026-001',
            'amount' => 15000,
            'payment_type' => 'monthly',
            'payment_method' => 'mobile_money',
        ]);

        $this->assertDatabaseHas('attendances', [
            'attendance_date' => '2026-05-31',
            'is_present' => 1,
            'meal_served' => 1,
        ]);
    }

    public function test_it_can_be_run_multiple_times_without_duplicate_records(): void
    {
        $this->seed(CanteenTestSeeder::class);
        $this->seed(CanteenTestSeeder::class);

        $this->assertSame(1, User::where('email', 'test@example.com')->count());
        $this->assertSame(1, Team::where('slug', 'cantine-test')->count());
        $this->assertSame(4, Child::count());
        $this->assertSame(3, Payment::count());
        $this->assertSame(3, Attendance::count());
    }
}
