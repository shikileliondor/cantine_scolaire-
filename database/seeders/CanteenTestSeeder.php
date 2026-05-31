<?php

namespace Database\Seeders;

use App\Enums\TeamRole;
use App\Models\Attendance;
use App\Models\Child;
use App\Models\Payment;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class CanteenTestSeeder extends Seeder
{
    /**
     * Seed the canteen with deterministic test data.
     */
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => Carbon::parse('2026-05-31 08:00:00'),
            ],
        );

        $team = Team::updateOrCreate(
            ['slug' => 'cantine-test'],
            [
                'name' => 'Cantine Test',
                'is_personal' => false,
            ],
        );

        $team->members()->syncWithoutDetaching([
            $user->id => ['role' => TeamRole::Owner->value],
        ]);

        $user->switchTeam($team);

        foreach ($this->children() as $childAttributes) {
            Child::updateOrCreate(
                ['matricule' => $childAttributes['matricule']],
                $childAttributes,
            );
        }

        foreach ($this->payments() as $paymentAttributes) {
            $child = Child::where('matricule', $paymentAttributes['child_matricule'])->firstOrFail();

            Payment::updateOrCreate(
                ['reference' => $paymentAttributes['reference']],
                [
                    'child_id' => $child->id,
                    'amount' => $paymentAttributes['amount'],
                    'payment_date' => $paymentAttributes['payment_date'],
                    'payment_type' => $paymentAttributes['payment_type'],
                    'payment_method' => $paymentAttributes['payment_method'],
                    'period_label' => $paymentAttributes['period_label'],
                    'notes' => $paymentAttributes['notes'],
                ],
            );
        }

        foreach ($this->attendances() as $attendanceAttributes) {
            $child = Child::where('matricule', $attendanceAttributes['child_matricule'])->firstOrFail();

            Attendance::updateOrCreate(
                [
                    'child_id' => $child->id,
                    'attendance_date' => $attendanceAttributes['attendance_date'],
                ],
                [
                    'is_present' => $attendanceAttributes['is_present'],
                    'meal_served' => $attendanceAttributes['meal_served'],
                    'notes' => $attendanceAttributes['notes'],
                ],
            );
        }
    }

    /**
     * @return array<int, array{first_name: string, last_name: string, matricule: string, gender: string, birth_date: string, class_name: string, parent_name: string, parent_phone: string, status: string, notes: string|null}>
     */
    private function children(): array
    {
        return [
            [
                'first_name' => 'Aya',
                'last_name' => 'Kouadio',
                'matricule' => 'CAN-001',
                'gender' => 'female',
                'birth_date' => '2018-04-12',
                'class_name' => 'CE1',
                'parent_name' => 'Marie Kouadio',
                'parent_phone' => '+225 07 01 02 03 04',
                'status' => 'active',
                'notes' => 'Allergie arachides.',
            ],
            [
                'first_name' => 'Yao',
                'last_name' => 'Konan',
                'matricule' => 'CAN-002',
                'gender' => 'male',
                'birth_date' => '2016-09-20',
                'class_name' => 'CM1',
                'parent_name' => 'Koffi Konan',
                'parent_phone' => '+225 05 11 22 33 44',
                'status' => 'active',
                'notes' => null,
            ],
            [
                'first_name' => 'Aminata',
                'last_name' => 'Traore',
                'matricule' => 'CAN-003',
                'gender' => 'female',
                'birth_date' => '2019-01-08',
                'class_name' => 'CP2',
                'parent_name' => 'Fatou Traore',
                'parent_phone' => '+225 01 98 76 54 32',
                'status' => 'active',
                'notes' => null,
            ],
            [
                'first_name' => 'Koffi',
                'last_name' => 'NGuessan',
                'matricule' => 'CAN-004',
                'gender' => 'male',
                'birth_date' => '2017-11-15',
                'class_name' => 'CE2',
                'parent_name' => 'Akissi NGuessan',
                'parent_phone' => '+225 07 45 67 89 10',
                'status' => 'inactive',
                'notes' => 'Dossier en attente de réactivation.',
            ],
        ];
    }

    /**
     * @return array<int, array{child_matricule: string, amount: int, payment_date: string, payment_type: string, payment_method: string, period_label: string, reference: string, notes: string|null}>
     */
    private function payments(): array
    {
        return [
            [
                'child_matricule' => 'CAN-001',
                'amount' => 15000,
                'payment_date' => '2026-05-01',
                'payment_type' => 'monthly',
                'payment_method' => 'mobile_money',
                'period_label' => 'Mai 2026',
                'reference' => 'TEST-PAY-2026-001',
                'notes' => 'Paiement mensuel complet.',
            ],
            [
                'child_matricule' => 'CAN-002',
                'amount' => 500,
                'payment_date' => '2026-05-31',
                'payment_type' => 'daily',
                'payment_method' => 'cash',
                'period_label' => '31 mai 2026',
                'reference' => 'TEST-PAY-2026-002',
                'notes' => null,
            ],
            [
                'child_matricule' => 'CAN-003',
                'amount' => 3000,
                'payment_date' => '2026-05-25',
                'payment_type' => 'weekly',
                'payment_method' => 'bank_transfer',
                'period_label' => 'Semaine du 25 mai 2026',
                'reference' => 'TEST-PAY-2026-003',
                'notes' => 'Virement confirmé.',
            ],
        ];
    }

    /**
     * @return array<int, array{child_matricule: string, attendance_date: string, is_present: bool, meal_served: bool, notes: string|null}>
     */
    private function attendances(): array
    {
        return [
            [
                'child_matricule' => 'CAN-001',
                'attendance_date' => '2026-05-31',
                'is_present' => true,
                'meal_served' => true,
                'notes' => null,
            ],
            [
                'child_matricule' => 'CAN-002',
                'attendance_date' => '2026-05-31',
                'is_present' => true,
                'meal_served' => true,
                'notes' => null,
            ],
            [
                'child_matricule' => 'CAN-003',
                'attendance_date' => '2026-05-31',
                'is_present' => false,
                'meal_served' => false,
                'notes' => 'Absence signalée par le parent.',
            ],
        ];
    }
}
