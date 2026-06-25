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
        'total_rating',

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

    public function rates(): HasMany    {

        return $this->hasMany(ProductRate::class);

    }

    public function orderProducts(): HasMany {
        return $this->hasMany(OrderProducts::class);
    }

    public function categoryMetadatas() {
        return $this->belongsToMany(
            CategoryMetadata::class, 
            'product_metadata', 
            'product_id', 
            'category_metadata_id'
        );
    }

    public function metadataValues() {
        return $this->belongsToMany(MetadataValue::class, 'product_metadatas', 'product_id', 'metadata_value_id');
    }
}


