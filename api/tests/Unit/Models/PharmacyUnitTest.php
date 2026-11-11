<?php

namespace Tests\Unit\Models;

use App\Models\PharmacyUnit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PharmacyUnitTest extends TestCase
{
    use RefreshDatabase;

    public function test_pharmacy_unit_casts(): void
    {
        $unit = PharmacyUnit::factory()->create([
            'is_ecommerce_hub' => 1,
            'allows_pickup' => 1,
            'is_active' => 1,
            'lat' => '-22.8282963',
            'lng' => '-43.4006912',
            'legal' => ['crf' => '12345'],
            'services' => ['Aplicação de Injeção'],
        ]);

        $this->assertIsBool($unit->is_ecommerce_hub);
        $this->assertTrue($unit->is_ecommerce_hub);

        $this->assertIsBool($unit->allows_pickup);
        $this->assertTrue($unit->allows_pickup);

        $this->assertIsBool($unit->is_active);
        $this->assertTrue($unit->is_active);

        $this->assertIsFloat($unit->lat);
        $this->assertSame(-22.8282963, $unit->lat);

        $this->assertIsFloat($unit->lng);
        $this->assertSame(-43.4006912, $unit->lng);

        $this->assertIsArray($unit->legal);
        $this->assertEquals(['crf' => '12345'], $unit->legal);

        $this->assertIsArray($unit->services);
        $this->assertEquals(['Aplicação de Injeção'], $unit->services);
    }
}
