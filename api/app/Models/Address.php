<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    protected $guarded = [];

    public $fillable = [
        'user_id',
        'receiver_name',
        'receiver_phone',
        'street',
        'number',
        'complement',
        'district',
        'zipcode',
        'is_default'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
