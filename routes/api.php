<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CanteenApiController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login'])
    ->middleware(['web', 'guest', 'throttle:6,1'])
    ->name('api.login');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::get('children', [CanteenApiController::class, 'children'])->name('api.children.index');
        Route::post('children', [CanteenApiController::class, 'storeChild'])->name('api.children.store');
        Route::get('children/{child}', [CanteenApiController::class, 'showChild'])->name('api.children.show');
        Route::match(['put', 'patch'], 'children/{child}', [CanteenApiController::class, 'updateChild'])->name('api.children.update');
        Route::delete('children/{child}', [CanteenApiController::class, 'destroyChild'])->name('api.children.destroy');

        Route::get('payments', [CanteenApiController::class, 'payments'])->name('api.payments.index');
        Route::post('payments', [CanteenApiController::class, 'storePayment'])->name('api.payments.store');
        Route::get('payments/{payment}', [CanteenApiController::class, 'showPayment'])->name('api.payments.show');
        Route::match(['put', 'patch'], 'payments/{payment}', [CanteenApiController::class, 'updatePayment'])->name('api.payments.update');
        Route::delete('payments/{payment}', [CanteenApiController::class, 'destroyPayment'])->name('api.payments.destroy');

        Route::get('attendances', [CanteenApiController::class, 'attendances'])->name('api.attendances.index');
        Route::post('attendances/daily', [CanteenApiController::class, 'storeDailyAttendances'])->name('api.attendances.daily.store');
        Route::delete('attendances/{attendance}', [CanteenApiController::class, 'destroyAttendance'])->name('api.attendances.destroy');
    });
