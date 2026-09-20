<?php

namespace Tests\Feature;

use App\Models\Child;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CanteenApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_and_list_children_through_api(): void
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;

        $this->actingAs($user)
            ->postJson(route('api.children.store', ['current_team' => $team->slug]), [
                'first_name' => 'Aya',
                'last_name' => 'Kouadio',
                'matricule' => 'API-001',
                'class_name' => 'CE1',
                'status' => 'active',
            ])
            ->assertCreated()
            ->assertJsonPath('first_name', 'Aya');

        $this->assertDatabaseHas('children', [
            'matricule' => 'API-001',
        ]);

        $this->actingAs($user)
            ->getJson(route('api.children.index', ['current_team' => $team->slug]))
            ->assertOk()
            ->assertJsonPath('data.0.matricule', Child::firstOrFail()->matricule);
    }
}
