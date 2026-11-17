<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubgroupMetadata extends Model
{
    use HasFactory;

    protected $table = 'subgroup_metadata';

    protected $fillable = [
        'subgroup_id',
        'name',
        'value',
    ];

    public function subgroup()
    {
        return $this->belongsTo(Subgroup::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_metadata')->withTimestamps();
    }
}
