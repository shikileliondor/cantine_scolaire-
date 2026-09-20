<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Authenticate a user and start a web session for API calls.
     *
     * @throws ValidationException
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pin' => ['required', 'digits:4'],
        ]);

        $user = User::query()
            ->get()
            ->first(fn (User $user): bool => Hash::check($validated['pin'], $user->password));

        if (! $user) {
            throw ValidationException::withMessages([
                'pin' => __('auth.failed'),
            ]);
        }

        Auth::login($user, $request->boolean('remember'));

        $request->session()->regenerate();

        $currentTeam = $user?->currentTeam ?? $user?->personalTeam();

        return response()->json([
            'message' => 'Authenticated.',
            'user' => $user,
            'current_team' => $currentTeam ? $user->toUserTeam($currentTeam) : null,
            'teams' => $user?->toUserTeams(includeCurrent: true),
        ]);
    }
}
