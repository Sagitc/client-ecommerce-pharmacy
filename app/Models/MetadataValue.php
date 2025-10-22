<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MetadataValue extends Model   {

    protected $fillable = [ 'label', 'category_metadata_id' ];
    protected $keyType  = 'string';
    protected $table    = 'metadata_values';
    
    public $incrementing = false;
    public $timestamps   = false;


    public function categoryMetadata(): BelongsTo   {

        return $this->belongsTo(CategoryMetadata::class);

    }

}
