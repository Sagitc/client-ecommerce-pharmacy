<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
    ];

    public static function defaultLabels(): array
    {
        return [
            'suplement' => 'Vitaminas e suplementos',
            'sunscreen' => 'Protetores solares',
            'laboratory' => 'Medicamentos e Laboratório',
            'contraceptive' => 'Anticoncepcionais',
            'infantile' => 'Infantil e Bebê',
            'dermocosmetics' => 'Dermocosméticos',
            'diabetes' => 'Diabetes',
            'hygiene' => 'Higiene pessoal',
            'hair-care' => 'Produtos capilares',
            'winter-care' => 'Cuidados no inverno',
            'medicamentos' => 'Medicamentos',
        ];
    }

    public static function labelForSlug(string $slug): string
    {
        return self::defaultLabels()[$slug] ?? ucfirst(str_replace('-', ' ', $slug));
    }

    public function subgroups()
    {
        return $this->hasMany(Subgroup::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
