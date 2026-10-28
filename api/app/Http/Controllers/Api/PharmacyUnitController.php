<?php
// api/app/Http/Controllers/Api/PharmacyUnitController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PharmacyUnit;

class PharmacyUnitController extends Controller
{
    public function index()
    {
        return response()->json(
            PharmacyUnit::where('is_active', true)->get()
        );
    }
}