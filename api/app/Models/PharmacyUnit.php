<?php
// api/app/Models/PharmacyUnit.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PharmacyUnit extends Model
{
    use HasFactory;

    protected $guarded = [];

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