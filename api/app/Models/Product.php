<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku',
        'ean',
        'label',
        'fabricator',
        'active_ingredient',
        'dosage',
        'description',
        'price',
        'promotion_price',
        'image',
        'category',
        'stripe_type',
        'requires_prescription',
        'in_stock',
        'stock_quantity',
        'sales_count',
    ];

    protected $casts = [
        'price' => 'float',
        'promotion_price' => 'float',
        'requires_prescription' => 'boolean',
        'in_stock' => 'boolean',
        'stock_quantity' => 'integer',
        'sales_count' => 'integer',
    ];

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

}
