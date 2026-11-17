<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'shipping_method',
        'address_id',
        'pharmacy_unit_id',
        'coupon_id',
        'coupon_code',
        'subtotal',
        'shipping_cost',
        'discount',
        'total',
        'payment_method',
        'payment_status',
        'status',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'float',
        'shipping_cost' => 'float',
        'discount' => 'float',
        'total' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function pharmacyUnit()
    {
        return $this->belongsTo(PharmacyUnit::class);
    }

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }
}
