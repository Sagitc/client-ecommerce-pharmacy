<?php

namespace Tests\Unit\Models;

use App\Models\Order;
use App\Models\Prescription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PrescriptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_prescription_relations_and_casts(): void
    {
        $order = Order::factory()->create();
        $pharmacist = User::factory()->create(['role' => 'pharmacist']);

        $prescription = Prescription::factory()->create([
            'order_id' => $order->id,
            'status' => 'approved',
            'reviewed_by' => $pharmacist->id,
            'reviewed_at' => '2026-11-11 12:00:00',
        ]);

        $this->assertInstanceOf(Order::class, $prescription->order);
        $this->assertEquals($order->id, $prescription->order->id);

        $this->assertInstanceOf(User::class, $prescription->reviewer);
        $this->assertEquals($pharmacist->id, $prescription->reviewer->id);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $prescription->reviewed_at);
        $this->assertEquals('2026-11-11 12:00:00', $prescription->reviewed_at->format('Y-m-d H:i:s'));
    }
}
