<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CategoryMetadata extends Model    {

    protected $keyType   = 'string';
    protected $table     = 'category_metadata';
    protected $fillable  = [ 'id', 'label', 'category_id' ];
    
    public $incrementing = false;
    public $timestamps   = false;


    public function category(): BelongsTo {

        return $this->belongsTo(Category::class);

    }

    public function metadataValues(): HasMany {

        return $this->hasMany(MetadataValue::class);

    }

    public function products(): BelongsToMany {

        return $this->belongsToMany(Product::class, 'product_metadata', 'category_metadata_id', 'product_id');

    }
}
