<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ChildController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('dashboard', function (Request $request): RedirectResponse {
    $user = $request->user();
    $team = $user?->currentTeam ?? $user?->personalTeam();

    abort_if(! $team, 403);

    return redirect()->route('dashboard', ['current_team' => $team->slug]);
})->middleware(['auth', 'verified']);

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
        Route::resource('children', ChildController::class)->except(['show']);
        Route::resource('payments', PaymentController::class)->except(['show']);
        Route::get('attendances', [AttendanceController::class, 'index'])->name('attendances.index');
        Route::get('attendances/daily', [AttendanceController::class, 'daily'])->name('attendances.daily');
        Route::post('attendances/daily', [AttendanceController::class, 'storeDaily'])->name('attendances.daily.store');
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

require __DIR__.'/settings.php';
