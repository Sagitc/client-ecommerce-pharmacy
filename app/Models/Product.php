<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model {

    protected $fillable = [

        'label',
        'main_image',
        'MS',
        'SKU',
        
        'description',

        'stock',
        'EAN',
        'sales_count',
        'views_count',

        'cost',
        'price',

        'liked',

        'laboratory_id',
        'category_id',

    ];


    public function category(): BelongsTo   {

        return $this->belongsTo(Category::class);

    }

    public function laboratory(): BelongsTo {

        return $this->belongsTo(Laboratory::class);

    }

    public function images(): HasMany   {

        return $this->hasMany(ProductImage::class);

    }

    public function metadata(): HasMany {

        return $this->hasMany(ProductMetadata::class);

    }

    public function formula(): BelongsTo    {

        return $this->belongsTo(Formula::class);

    }

}
