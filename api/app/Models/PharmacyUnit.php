<?php
// api/app/Models/PharmacyUnit.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PharmacyUnit extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'is_ecommerce_hub',
        'allows_pickup',
        'pickup_ready_time',
        'razao_social',
        'cnpj',
        'state_registration',
        'cep',
        'address',
        'neighborhood',
        'hours',
        'phone',
        'whatsapp',
        'maps_url',
        'lat',
        'lng',
        'legal',
        'services',
        'is_active',
    ];

    protected $casts = [
        'is_ecommerce_hub' => 'boolean',
        'allows_pickup' => 'boolean',
        'is_active' => 'boolean',
        'lat' => 'float',
        'lng' => 'float',
        'legal' => 'array',
        'services' => 'array',
    ];
}