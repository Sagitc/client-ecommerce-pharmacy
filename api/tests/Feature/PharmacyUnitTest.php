<?php

namespace Tests\Feature;

use App\Models\PharmacyUnit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PharmacyUnitTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_only_active_pharmacy_units(): void
    {
        $activeUnit = PharmacyUnit::factory()->create([
            'name' => 'Unidade Ativa',
            'is_active' => true,
        ]);

        $inactiveUnit = PharmacyUnit::factory()->inactive()->create([
            'name' => 'Unidade Inativa',
        ]);

        $response = $this->getJson('/api/pharmacy-units');

        $response->assertOk()
                 ->assertJsonCount(1)
                 ->assertJsonPath('0.id', $activeUnit->id)
                 ->assertJsonPath('0.name', 'Unidade Ativa')
                 ->assertJsonStructure([
                     '*' => [
                         'id',
                         'slug',
                         'name',
                         'cep',
                         'address',
                         'lat',
                         'lng',
                         'is_active',
                     ],
                 ]);
    }
}
