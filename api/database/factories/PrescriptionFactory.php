<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Prescription;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Prescription>
 */
class PrescriptionFactory extends Factory
{
    protected $model = Prescription::class;

    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'file_path' => 'prescriptions/test_file.pdf',
            'original_name' => 'receita_medica.pdf',
            'mime_type' => 'application/pdf',
            'status' => 'pending',
            'reviewed_by' => null,
            'rejection_reason' => null,
            'reviewed_at' => null,
        ];
    }

    public function approved(?User $reviewer = null): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'reviewed_by' => $reviewer?->id ?? User::factory()->create(['role' => 'pharmacist'])->id,
            'reviewed_at' => now(),
        ]);
    }

    public function rejected(string $reason = 'Receita rasurada ou ilegível', ?User $reviewer = null): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'rejection_reason' => $reason,
            'reviewed_by' => $reviewer?->id ?? User::factory()->create(['role' => 'pharmacist'])->id,
            'reviewed_at' => now(),
        ]);
    }
}
