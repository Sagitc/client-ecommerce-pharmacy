<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subgroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'slug',
        'name',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function metadataOptions()
    {
        return $this->hasMany(SubgroupMetadata::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
