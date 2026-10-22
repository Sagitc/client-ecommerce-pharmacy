<?php
// app/Http/Controllers/Api/ShippingController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class ShippingController extends Controller
{
    // Unidades habilitadas para despacho de motoboy
    private array $hubs = [
        [
            'name' => 'Couto 1 (Anchieta)',
            'coords' => '-22.8282963,-43.4006912',
        ],
        [
            'name' => 'Catumbi',
            'coords' => '-22.9180027,-43.1985032',
        ],
        [
            'name' => 'Jaime (Suruí - Magé)',
            'coords' => '-22.6622381,-43.1288145',
        ],
    ];

    public function calculate(Request $request)
    {
        $request->validate([
            'cep' => 'required|string',
        ]);

        $cleanCep = preg_replace('/\D/', '', $request->cep);

        if (strlen($cleanCep) !== 8) {
            return response()->json([
                'available' => false,
                'message' => 'CEP inválido.',
            ], 422);
        }

        // Cacheia o resultado deste CEP por 7 dias para economizar chamadas na API do Google
        $quote = Cache::remember("shipping_cep_{$cleanCep}", now()->addDays(7), function () use ($cleanCep) {
            return $this->fetchBestRouteFromGoogle($cleanCep);
        });

        if (!$quote['available']) {
            return response()->json($quote, 400);
        }

        return response()->json($quote);
    }

    private function fetchBestRouteFromGoogle(string $cep): array
    {
        $apiKey = config('services.google.maps_key');
        
        // Concatena todas as lojas de origem separadas por pipe "|" para consultar em 1 única requisição
        $origins = implode('|', array_column($this->hubs, 'coords'));
        $destination = "{$cep}, Rio de Janeiro, Brasil";

        $response = Http::get('https://maps.googleapis.com/maps/api/distancematrix/json', [
            'origins' => $origins,
            'destinations' => $destination,
            'mode' => 'driving',
            'language' => 'pt-BR',
            'key' => $apiKey,
        ]);

        if (!$response->successful()) {
            return [
                'available' => false,
                'message' => 'Serviço de cálculo de rotas temporariamente indisponível.',
            ];
        }

        $data = $response->json();

        if (($data['status'] ?? '') !== 'OK') {
            return [
                'available' => false,
                'message' => 'Não foi possível traçar uma rota para o CEP informado.',
            ];
        }

        $bestHubIndex = null;
        $shortestDistanceMeters = PHP_INT_MAX;
        $durationSeconds = 0;

        // Analisa qual das unidades da Drogarias Camargo tem o menor trajeto de rua até o cliente
        foreach ($data['rows'] as $index => $row) {
            $element = $row['elements'][0] ?? null;
            if ($element && ($element['status'] ?? '') === 'OK') {
                $distanceMeters = $element['distance']['value'];
                if ($distanceMeters < $shortestDistanceMeters) {
                    $shortestDistanceMeters = $distanceMeters;
                    $durationSeconds = $element['duration']['value'];
                    $bestHubIndex = $index;
                }
            }
        }

        if ($bestHubIndex === null) {
            return [
                'available' => false,
                'message' => 'Endereço fora da nossa área de cobertura.',
            ];
        }

        $distanceKm = round($shortestDistanceMeters / 1000, 1);

        // Regra de Negócio: Raio máximo de atuação do motoboy (ex: 15 km da loja mais próxima)
        $maxRadiusKm = 15.0;
        if ($distanceKm > $maxRadiusKm) {
            return [
                'available' => false,
                'message' => "Este endereço fica a {$distanceKm} km da nossa unidade mais próxima (limite de entrega: {$maxRadiusKm} km).",
            ];
        }

        // Regra de Precificação escalonada da entrega
        $baseFee = 5.00;       // Taxa fixa de saída
        $ratePerKm = 1.50;     // Valor por km até 3km Free/Fixo ou progressivo
        
        if ($distanceKm <= 2.0) {
            $price = 6.90; // Taxa mínima para vizinhança (até 2km)
        } else {
            $price = round($baseFee + ($distanceKm * $ratePerKm), 2);
        }

        // Tempo estimado = 25 min de separação na farmácia + tempo de trânsito do Google
        $estimatedMinutes = 25 + ceil($durationSeconds / 60);

        return [
            'available' => true,
            'price' => $price,
            'distanceKm' => $distanceKm,
            'estimatedMinutes' => $estimatedMinutes,
            'originUnitName' => $this->hubs[$bestHubIndex]['name'],
            'customerAddress' => $data['destination_addresses'][0] ?? "CEP {$cep}",
        ];
    }
}