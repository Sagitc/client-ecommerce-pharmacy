<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'label',
        'description',
        'cost',
        'price',
        'manufacturer_id',
        'stock',
        'EAN',
        'MS',
        'category_id',
        'sales_count',
        'views_count',
        'liked',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function manufacturer(): BelongsTo
    {
        return $this->belongsTo(Manufacturer::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function metadata(): HasMany {
        return $this->hasMany(ProductMetadata::class);
    }
}
