<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Laboratory extends Model  {

    protected $fillable = [ 'label', 'company_name', 'CNPJ' ];
    
    public $timestamps  = false;


    public function products(): HasMany {

        return $this->hasMany(Product::class);

    }

}
