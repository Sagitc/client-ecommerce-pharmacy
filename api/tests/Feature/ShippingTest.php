<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ShippingTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    public function test_shipping_requires_cep(): void
    {
        $response = $this->postJson('/api/shipping/calculate', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['cep']);
    }

    public function test_shipping_fails_with_invalid_cep_length(): void
    {
        $response = $this->postJson('/api/shipping/calculate', [
            'cep' => '1234',
        ]);

        $response->assertStatus(422)
                 ->assertJson([
                     'available' => false,
                     'message' => 'CEP inválido.',
                 ]);
    }

    public function test_shipping_success_for_short_distance_under_2km(): void
    {
        Http::fake([
            'https://maps.googleapis.com/*' => Http::response([
                'status' => 'OK',
                'destination_addresses' => ['Rua Teste, 100 - Anchieta, Rio de Janeiro'],
                'rows' => [
                    [
                        'elements' => [
                            [
                                'status' => 'OK',
                                'distance' => ['value' => 1500], // 1.5 km
                                'duration' => ['value' => 300],  // 5 min
                            ],
                        ],
                    ],
                    [
                        'elements' => [
                            [
                                'status' => 'OK',
                                'distance' => ['value' => 8000],
                                'duration' => ['value' => 1200],
                            ],
                        ],
                    ],
                    [
                        'elements' => [
                            [
                                'status' => 'OK',
                                'distance' => ['value' => 12000],
                                'duration' => ['value' => 1800],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->postJson('/api/shipping/calculate', [
            'cep' => '21625-001',
        ]);

        $response->assertOk()
                 ->assertJson([
                     'available' => true,
                     'price' => 6.90,
                     'distanceKm' => 1.5,
                     'estimatedMinutes' => 30, // 25 + ceil(300 / 60) = 25 + 5 = 30
                     'originUnitName' => 'Couto 1 (Anchieta)',
                     'customerAddress' => 'Rua Teste, 100 - Anchieta, Rio de Janeiro',
                 ]);
    }

    public function test_shipping_success_for_distance_over_2km_and_under_15km(): void
    {
        Http::fake([
            'https://maps.googleapis.com/*' => Http::response([
                'status' => 'OK',
                'destination_addresses' => ['Av. Brasil, 500 - Rio de Janeiro'],
                'rows' => [
                    [
                        'elements' => [
                            [
                                'status' => 'OK',
                                'distance' => ['value' => 10000], // 10 km
                                'duration' => ['value' => 900],   // 15 min
                            ],
                        ],
                    ],
                    [
                        'elements' => [
                            [
                                'status' => 'OK',
                                'distance' => ['value' => 14000],
                                'duration' => ['value' => 1500],
                            ],
                        ],
                    ],
                    [
                        'elements' => [
                            [
                                'status' => 'OK',
                                'distance' => ['value' => 20000],
                                'duration' => ['value' => 2000],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->postJson('/api/shipping/calculate', [
            'cep' => '21000-000',
        ]);

        // Base 5.00 + (10 * 1.50) = 20.00
        // Duration: 25 + ceil(900 / 60) = 40 min
        $response->assertOk()
                 ->assertJson([
                     'available' => true,
                     'price' => 20.00,
                     'distanceKm' => 10.0,
                     'estimatedMinutes' => 40,
                     'originUnitName' => 'Couto 1 (Anchieta)',
                 ]);
    }

    public function test_shipping_fails_when_distance_exceeds_15km(): void
    {
        Http::fake([
            'https://maps.googleapis.com/*' => Http::response([
                'status' => 'OK',
                'destination_addresses' => ['Barra da Tijuca, Rio de Janeiro'],
                'rows' => [
                    [
                        'elements' => [
                            [
                                'status' => 'OK',
                                'distance' => ['value' => 25000], // 25 km
                                'duration' => ['value' => 2400],
                            ],
                        ],
                    ],
                    [
                        'elements' => [
                            [
                                'status' => 'OK',
                                'distance' => ['value' => 28000],
                                'duration' => ['value' => 2700],
                            ],
                        ],
                    ],
                    [
                        'elements' => [
                            [
                                'status' => 'OK',
                                'distance' => ['value' => 35000],
                                'duration' => ['value' => 3200],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->postJson('/api/shipping/calculate', [
            'cep' => '22600-000',
        ]);

        $response->assertStatus(400)
                 ->assertJson([
                     'available' => false,
                 ])
                 ->assertJsonFragment([
                     'message' => 'Este endereço fica a 25 km da nossa unidade mais próxima (limite de entrega: 15 km).',
                 ]);
    }

    public function test_shipping_fails_when_google_maps_service_is_down(): void
    {
        Http::fake([
            'https://maps.googleapis.com/*' => Http::response(null, 500),
        ]);

        $response = $this->postJson('/api/shipping/calculate', [
            'cep' => '21625-001',
        ]);

        $response->assertStatus(400)
                 ->assertJson([
                     'available' => false,
                     'message' => 'Serviço de cálculo de rotas temporariamente indisponível.',
                 ]);
    }

    public function test_shipping_fails_when_google_maps_returns_error_status(): void
    {
        Http::fake([
            'https://maps.googleapis.com/*' => Http::response([
                'status' => 'REQUEST_DENIED',
                'error_message' => 'Invalid API key',
            ], 200),
        ]);

        $response = $this->postJson('/api/shipping/calculate', [
            'cep' => '21625-001',
        ]);

        $response->assertStatus(400)
                 ->assertJson([
                     'available' => false,
                     'message' => 'Não foi possível traçar uma rota para o CEP informado.',
                 ]);
    }

    public function test_shipping_fails_when_all_elements_are_not_ok(): void
    {
        Http::fake([
            'https://maps.googleapis.com/*' => Http::response([
                'status' => 'OK',
                'rows' => [
                    [
                        'elements' => [
                            ['status' => 'ZERO_RESULTS'],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->postJson('/api/shipping/calculate', [
            'cep' => '99999-999',
        ]);

        $response->assertStatus(400)
                 ->assertJson([
                     'available' => false,
                     'message' => 'Endereço fora da nossa área de cobertura.',
                 ]);
    }

    public function test_shipping_result_is_cached(): void
    {
        Http::fake([
            'https://maps.googleapis.com/*' => Http::response([
                'status' => 'OK',
                'destination_addresses' => ['Rua Teste, 100'],
                'rows' => [
                    [
                        'elements' => [
                            [
                                'status' => 'OK',
                                'distance' => ['value' => 1000],
                                'duration' => ['value' => 180],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        // Primeira chamada busca no Google
        $firstResponse = $this->postJson('/api/shipping/calculate', ['cep' => '21625-001']);
        $firstResponse->assertOk();

        // Segunda chamada deve usar o Cache sem chamar o Google novamente
        Http::fake([
            'https://maps.googleapis.com/*' => Http::response(null, 500),
        ]);

        $secondResponse = $this->postJson('/api/shipping/calculate', ['cep' => '21625-001']);
        $secondResponse->assertOk()
                       ->assertJson(['available' => true, 'price' => 6.90]);
    }
}
