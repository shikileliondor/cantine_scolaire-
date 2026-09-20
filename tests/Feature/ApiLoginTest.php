<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ApiLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_through_api_with_pin_only(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('1234'),
        ]);

        $this->postJson(route('api.login'), [
            'pin' => '1234',
        ])
            ->assertOk()
            ->assertJsonPath('message', 'Authenticated.')
            ->assertJsonPath('user.email', 'test@example.com')
            ->assertJsonPath('current_team.id', $user->currentTeam->id);

        $this->assertAuthenticatedAs($user);
    }

    public function test_user_cannot_login_with_invalid_password(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('1234'),
        ]);

        $this->postJson(route('api.login'), [
            'pin' => '9999',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('pin');

        $this->assertGuest();
    }
}
