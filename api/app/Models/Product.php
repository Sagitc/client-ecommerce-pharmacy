<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku',
        'ean',
        'label',
        'fabricator',
        'active_ingredient',
        'dosage',
        'description',
        'price',
        'promotion_price',
        'image',
        'category',
        'category_id',
        'subgroup',
        'subgroup_id',
        'metadata',
        'stripe_type',
        'requires_prescription',
        'in_stock',
        'stock_quantity',
        'sales_count',
    ];

    protected $casts = [
        'price' => 'float',
        'promotion_price' => 'float',
        'metadata' => 'array',
        'requires_prescription' => 'boolean',
        'in_stock' => 'boolean',
        'stock_quantity' => 'integer',
        'sales_count' => 'integer',
    ];

    protected static function booted(): void
    {
        static::saving(function (Product $product) {
            if (! Schema::hasTable('categories') || ! Schema::hasTable('subgroups')) {
                return;
            }

            // 1. Vincula Category automáticamente pelo slug em $product->attributes['category']
            $rawCategorySlug = $product->attributes['category'] ?? null;
            if (! empty($rawCategorySlug) && ($product->isDirty('category') || empty($product->category_id))) {
                $slug = trim((string) $rawCategorySlug);
                $categoryModel = Category::firstOrCreate(
                    ['slug' => $slug],
                    ['name' => Category::labelForSlug($slug)]
                );
                if (Schema::hasColumn('products', 'category_id')) {
                    $product->category_id = $categoryModel->id;
                }
            } elseif (! empty($product->category_id) && empty($rawCategorySlug)) {
                $categoryModel = Category::find($product->category_id);
                if ($categoryModel) {
                    $product->attributes['category'] = $categoryModel->slug;
                }
            }

            // 2. Vincula Subgroup automaticamente pelo nome em $product->attributes['subgroup']
            $rawSubgroupName = $product->attributes['subgroup'] ?? null;
            $categoryId = $product->category_id;
            if (! empty($rawSubgroupName) && ! empty($categoryId) && ($product->isDirty('subgroup') || empty($product->subgroup_id))) {
                $subName = trim((string) $rawSubgroupName);
                $subSlug = Str::slug($subName) ?: Str::lower($subName);
                $subgroupModel = Subgroup::firstOrCreate(
                    ['category_id' => $categoryId, 'slug' => $subSlug],
                    ['name' => $subName]
                );
                if (Schema::hasColumn('products', 'subgroup_id')) {
                    $product->subgroup_id = $subgroupModel->id;
                }
            } elseif (! empty($product->subgroup_id) && empty($rawSubgroupName)) {
                $subgroupModel = Subgroup::find($product->subgroup_id);
                if ($subgroupModel) {
                    $product->attributes['subgroup'] = $subgroupModel->name;
                }
            }
        });

        static::saved(function (Product $product) {
            if (! Schema::hasTable('subgroup_metadata') || ! Schema::hasTable('product_metadata')) {
                return;
            }

            $rawMeta = $product->attributes['metadata'] ?? null;
            if ($rawMeta === null || empty($product->subgroup_id)) {
                return;
            }

            $decoded = is_string($rawMeta) ? json_decode($rawMeta, true) : $rawMeta;
            if (! is_array($decoded)) {
                return;
            }

            $product->syncRelationalMetadata($decoded);
        });
    }

    public function syncRelationalMetadata(array $metadataMap): void
    {
        if (empty($this->subgroup_id) || ! Schema::hasTable('subgroup_metadata') || ! Schema::hasTable('product_metadata')) {
            return;
        }

        $metadataIds = [];

        foreach ($metadataMap as $key => $rawValue) {
            $name = trim((string) $key);
            if ($name === '') {
                continue;
            }

            $values = is_array($rawValue) ? $rawValue : [$rawValue];
            foreach ($values as $val) {
                $valStr = trim((string) $val);
                if ($valStr === '') {
                    continue;
                }

                $option = SubgroupMetadata::firstOrCreate([
                    'subgroup_id' => $this->subgroup_id,
                    'name' => $name,
                    'value' => $valStr,
                ]);

                $metadataIds[] = $option->id;
            }
        }

        $this->metadataItems()->sync(array_values(array_unique($metadataIds)));
        $this->unsetRelation('metadataItems');
    }

    public function categoryRelation()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function subgroupRelation()
    {
        return $this->belongsTo(Subgroup::class, 'subgroup_id');
    }

    public function metadataItems()
    {
        return $this->belongsToMany(SubgroupMetadata::class, 'product_metadata')->withTimestamps();
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function getCategoryAttribute(?string $value): string
    {
        if ($this->relationLoaded('categoryRelation') && $this->getRelation('categoryRelation')) {
            return $this->getRelation('categoryRelation')->slug;
        }
        if (! empty($this->attributes['category_id']) && Schema::hasTable('categories')) {
            $cat = Category::find($this->attributes['category_id']);
            if ($cat) {
                return $cat->slug;
            }
        }
        return (string) $value;
    }

    public function getSubgroupAttribute(?string $value): ?string
    {
        if ($this->relationLoaded('subgroupRelation') && $this->getRelation('subgroupRelation')) {
            return $this->getRelation('subgroupRelation')->name;
        }
        if (! empty($this->attributes['subgroup_id']) && Schema::hasTable('subgroups')) {
            $sub = Subgroup::find($this->attributes['subgroup_id']);
            if ($sub) {
                return $sub->name;
            }
        }
        return $value;
    }

    public function getMetadataAttribute($value): ?array
    {
        if ($this->relationLoaded('metadataItems')) {
            $items = $this->getRelation('metadataItems');
            if ($items && $items->isNotEmpty()) {
                return $this->formatMetadataCollection($items);
            }
        } elseif (! empty($this->id) && Schema::hasTable('product_metadata')) {
            $items = $this->metadataItems()->get();
            if ($items->isNotEmpty()) {
                return $this->formatMetadataCollection($items);
            }
        }

        if (is_array($value)) {
            return $value;
        }
        if (is_string($value) && $value !== '') {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : null;
        }

        return null;
    }

    private function formatMetadataCollection($items): array
    {
        $grouped = [];
        foreach ($items as $item) {
            $key = $item->name;
            $val = $item->value;
            if (! array_key_exists($key, $grouped)) {
                $grouped[$key] = $val;
            } else {
                if (! is_array($grouped[$key])) {
                    $grouped[$key] = [$grouped[$key]];
                }
                if (! in_array($val, $grouped[$key], true)) {
                    $grouped[$key][] = $val;
                }
            }
        }
        return $grouped;
    }

    public static function defaultCatalogProducts(): array
    {
        return [
            [
                'sku' => 'CAM-0001',
                'ean' => '7896523206127',
                'label' => 'Vitamina C Cimed Redoxitos 1g - 10 Comprimidos Efervescentes',
                'fabricator' => 'Cimed',
                'active_ingredient' => 'Ácido Ascórbico',
                'dosage' => '1g',
                'description' => 'Suplemento vitamínico antioxidante auxiliar do sistema imunológico.',
                'price' => 16.90,
                'promotion_price' => 11.90,
                'image' => '/images/products/vitamina-c.png',
                'category' => 'suplement',
                'subgroup' => 'Imunidade e Energia',
                'metadata' => [
                    'Forma Farmacêutica' => 'Comprimido Efervescente',
                    'Sabor' => 'Laranja',
                    'Público' => 'Adulto',
                ],
                'stripe_type' => 'free',
                'requires_prescription' => false,
                'stock_quantity' => 120,
                'sales_count' => 340,
            ],
            [
                'sku' => 'CAM-0002',
                'ean' => '3337875709330',
                'label' => 'Protetor Solar Facial La Roche-Posay Anthelios Airlicium FPS 70 40g',
                'fabricator' => 'La Roche-Posay',
                'active_ingredient' => 'XL-Protect + Airlicium',
                'dosage' => '40g',
                'description' => 'Alta proteção solar com controle inteligente da oleosidade e umidade por 12h.',
                'price' => 99.90,
                'promotion_price' => 79.90,
                'image' => '/images/products/anthelios.png',
                'category' => 'sunscreen',
                'subgroup' => 'Proteção Facial',
                'metadata' => [
                    'FPS' => 'FPS 70',
                    'Tipo de Pele' => 'Oleosa a Mista',
                    'Textura' => 'Gel-Creme Toque Seco',
                ],
                'stripe_type' => 'free',
                'requires_prescription' => false,
                'stock_quantity' => 45,
                'sales_count' => 280,
            ],
            [
                'sku' => 'CAM-0003',
                'ean' => '7891317464219',
                'label' => 'Amoxicilina 500mg Genérico Eurofarma - 21 Cápsulas',
                'fabricator' => 'Eurofarma',
                'active_ingredient' => 'Amoxicilina Tri-hidratada',
                'dosage' => '500mg',
                'description' => 'Antibiótico penicilânico indicado para infecções bacterianas. Venda sob retenção de receita médica (RDC 20/2011).',
                'price' => 38.50,
                'promotion_price' => 26.90,
                'image' => '/images/products/amoxicilina.png',
                'category' => 'laboratory',
                'subgroup' => 'Antibióticos',
                'metadata' => [
                    'Forma Farmacêutica' => 'Cápsula',
                    'Classificação' => 'Genérico',
                    'Dosagem' => '500mg',
                ],
                'stripe_type' => 'red_retained',
                'requires_prescription' => true,
                'stock_quantity' => 60,
                'sales_count' => 195,
            ],
            [
                'sku' => 'CAM-0004',
                'ean' => '7896004714158',
                'label' => 'Azitromicina Di-hidratada 500mg EMS - 5 Comprimidos',
                'fabricator' => 'EMS',
                'active_ingredient' => 'Azitromicina',
                'dosage' => '500mg',
                'description' => 'Antibiótico indicado em infecções do trato respiratório. Exige retenção de receita médica.',
                'price' => 29.90,
                'promotion_price' => 18.50,
                'image' => '/images/products/azitromicina.png',
                'category' => 'laboratory',
                'subgroup' => 'Antibióticos',
                'metadata' => [
                    'Forma Farmacêutica' => 'Comprimido Revestido',
                    'Classificação' => 'Genérico',
                    'Dosagem' => '500mg',
                ],
                'stripe_type' => 'red_retained',
                'requires_prescription' => true,
                'stock_quantity' => 85,
                'sales_count' => 210,
            ],
            [
                'sku' => 'CAM-0005',
                'ean' => '7891058003421',
                'label' => 'Anticoncepcional Yasmin 3mg + 0,03mg Bayer - 21 Comprimidos',
                'fabricator' => 'Bayer',
                'active_ingredient' => 'Drospirenona + Etinilestradiol',
                'dosage' => '3mg + 0,03mg',
                'description' => 'Contraceptivo oral combinado de baixa dosagem.',
                'price' => 84.90,
                'promotion_price' => 69.90,
                'image' => '/images/products/yasmin.png',
                'category' => 'contraceptive',
                'subgroup' => 'Uso Diário',
                'metadata' => [
                    'Forma Farmacêutica' => 'Comprimido',
                    'Classificação' => 'Referência',
                    'Ciclo' => '21 dias',
                ],
                'stripe_type' => 'red',
                'requires_prescription' => false,
                'stock_quantity' => 40,
                'sales_count' => 150,
            ],
            [
                'sku' => 'CAM-0006',
                'ean' => '7891010567890',
                'label' => 'Fralda Pampers Confort Sec Tamanho G - 70 Unidades',
                'fabricator' => 'P&G',
                'active_ingredient' => null,
                'dosage' => 'Tam G (9-12,5kg)',
                'description' => 'Canais de ar para uma pele arejada e sequinha por até 12 horas.',
                'price' => 119.90,
                'promotion_price' => 94.90,
                'image' => '/images/products/pampers.png',
                'category' => 'infantile',
                'subgroup' => 'Fraldas e Troca',
                'metadata' => [
                    'Tamanho' => 'G',
                    'Peso Recomendado' => '9kg a 12,5kg',
                    'Quantidade' => '70 unidades',
                ],
                'stripe_type' => 'free',
                'requires_prescription' => false,
                'stock_quantity' => 30,
                'sales_count' => 310,
            ],
            [
                'sku' => 'CAM-0007',
                'ean' => '3337875597388',
                'label' => 'Gel de Limpeza Facial CeraVe Pele Normal a Oleosa 354ml',
                'fabricator' => 'CeraVe',
                'active_ingredient' => '3 Ceramidas Essenciais + Ácido Hialurônico',
                'dosage' => '354ml',
                'description' => 'Limpa profundamente e remove a oleosidade sem alterar a barreira protetora da pele.',
                'price' => 89.90,
                'promotion_price' => 74.90,
                'image' => '/images/products/cerave.png',
                'category' => 'dermocosmetics',
                'subgroup' => 'Limpeza Facial',
                'metadata' => [
                    'Tipo de Pele' => 'Normal a Oleosa',
                    'Textura' => 'Gel Espumante',
                    'Volume' => '354ml',
                ],
                'stripe_type' => 'free',
                'requires_prescription' => false,
                'stock_quantity' => 55,
                'sales_count' => 265,
            ],
            [
                'sku' => 'CAM-0008',
                'ean' => '7891106912341',
                'label' => 'Tiras Reagentes Accu-Chek Active - 50 Unidades',
                'fabricator' => 'Roche',
                'active_ingredient' => null,
                'dosage' => '50 tiras',
                'description' => 'Tiras para determinação quantitativa de glicemia capilar.',
                'price' => 109.00,
                'promotion_price' => 88.90,
                'image' => '/images/products/accu-chek.png',
                'category' => 'diabetes',
                'subgroup' => 'Monitoramento de Glicemia',
                'metadata' => [
                    'Compatibilidade' => 'Linha Accu-Chek Active',
                    'Quantidade' => '50 unidades',
                    'Tipo de Amostra' => 'Sangue Capilar',
                ],
                'stripe_type' => 'free',
                'requires_prescription' => false,
                'stock_quantity' => 40,
                'sales_count' => 175,
            ],
            [
                'sku' => 'CAM-0009',
                'ean' => '7896004701011',
                'label' => 'Dipirona Monoidratada 500mg Genérico Medley - 10 Comprimidos',
                'fabricator' => 'Medley',
                'active_ingredient' => 'Dipirona Monoidratada',
                'dosage' => '500mg',
                'description' => 'Analgésico e antitérmico indicado para alívio de dores e febre.',
                'price' => 8.90,
                'promotion_price' => 5.90,
                'image' => '/images/products/dipirona-cpr.png',
                'category' => 'laboratory',
                'subgroup' => 'Analgésicos e Antitérmicos',
                'metadata' => [
                    'Forma Farmacêutica' => 'Comprimido',
                    'Classificação' => 'Genérico',
                    'Dosagem' => '500mg',
                    'Público' => 'Adulto',
                ],
                'stripe_type' => 'free',
                'requires_prescription' => false,
                'stock_quantity' => 200,
                'sales_count' => 520,
            ],
            [
                'sku' => 'CAM-0010',
                'ean' => '7896004701028',
                'label' => 'Dipirona Monoidratada Gotas 500mg/ml EMS - 20ml',
                'fabricator' => 'EMS',
                'active_ingredient' => 'Dipirona Monoidratada',
                'dosage' => '500mg/ml',
                'description' => 'Solução oral em gotas com ação analgésica e antitérmica rápida.',
                'price' => 10.50,
                'promotion_price' => 7.50,
                'image' => '/images/products/dipirona-gotas.png',
                'category' => 'laboratory',
                'subgroup' => 'Analgésicos e Antitérmicos',
                'metadata' => [
                    'Forma Farmacêutica' => 'Gotas',
                    'Classificação' => 'Genérico',
                    'Dosagem' => '500mg/ml',
                    'Público' => 'Adulto e Pediátrico',
                ],
                'stripe_type' => 'free',
                'requires_prescription' => false,
                'stock_quantity' => 150,
                'sales_count' => 410,
            ],
            [
                'sku' => 'CAM-0011',
                'ean' => '7891058011228',
                'label' => 'Novalgina Dipirona 1g Sanofi - 10 Comprimidos Efervescentes',
                'fabricator' => 'Sanofi',
                'active_ingredient' => 'Dipirona Monoidratada',
                'dosage' => '1g',
                'description' => 'Analgésico e antitérmico de dupla concentração para dores intensas e febre.',
                'price' => 24.90,
                'promotion_price' => 19.90,
                'image' => '/images/products/novalgina-1g.png',
                'category' => 'laboratory',
                'subgroup' => 'Analgésicos e Antitérmicos',
                'metadata' => [
                    'Forma Farmacêutica' => 'Comprimido Efervescente',
                    'Classificação' => 'Referência',
                    'Dosagem' => '1g',
                    'Público' => 'Adulto',
                ],
                'stripe_type' => 'free',
                'requires_prescription' => false,
                'stock_quantity' => 90,
                'sales_count' => 290,
            ],
            [
                'sku' => 'CAM-0012',
                'ean' => '7896714205519',
                'label' => 'Dipirona Sódica Xarope Infantil 50mg/ml Germed - 100ml',
                'fabricator' => 'Germed',
                'active_ingredient' => 'Dipirona Sódica',
                'dosage' => '50mg/ml',
                'description' => 'Solução oral infantil sabor framboesa com copo dosador para alívio de febre e dor.',
                'price' => 18.90,
                'promotion_price' => 14.50,
                'image' => '/images/products/dipirona-xarope.png',
                'category' => 'infantile',
                'subgroup' => 'Analgésicos e Antitérmicos',
                'metadata' => [
                    'Forma Farmacêutica' => 'Xarope',
                    'Classificação' => 'Similar',
                    'Dosagem' => '50mg/ml',
                    'Público' => 'Pediátrico',
                ],
                'stripe_type' => 'free',
                'requires_prescription' => false,
                'stock_quantity' => 75,
                'sales_count' => 185,
            ],
        ];
    }

    public static function ensureCatalogTaxonomyReady(): void
    {
        try {
            if (! Schema::hasTable('products')) {
                return;
            }

            if (! Schema::hasTable('categories')) {
                Schema::create('categories', function (Blueprint $table) {
                    $table->id();
                    $table->string('slug')->unique();
                    $table->string('name');
                    $table->timestamps();
                });
            }

            if (! Schema::hasTable('subgroups')) {
                Schema::create('subgroups', function (Blueprint $table) {
                    $table->id();
                    $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
                    $table->string('slug');
                    $table->string('name');
                    $table->timestamps();
                    $table->unique(['category_id', 'slug']);
                });
            }

            if (! Schema::hasTable('subgroup_metadata')) {
                Schema::create('subgroup_metadata', function (Blueprint $table) {
                    $table->id();
                    $table->foreignId('subgroup_id')->constrained('subgroups')->cascadeOnDelete();
                    $table->string('name');
                    $table->string('value');
                    $table->timestamps();
                    $table->unique(['subgroup_id', 'name', 'value']);
                });
            }

            if (! Schema::hasTable('product_metadata')) {
                Schema::create('product_metadata', function (Blueprint $table) {
                    $table->id();
                    $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
                    $table->foreignId('subgroup_metadata_id')->constrained('subgroup_metadata')->cascadeOnDelete();
                    $table->timestamps();
                    $table->unique(['product_id', 'subgroup_metadata_id']);
                });
            }

            $needsSubgroup = ! Schema::hasColumn('products', 'subgroup');
            $needsMetadata = ! Schema::hasColumn('products', 'metadata');
            $needsCategoryId = ! Schema::hasColumn('products', 'category_id');
            $needsSubgroupId = ! Schema::hasColumn('products', 'subgroup_id');

            if ($needsSubgroup || $needsMetadata || $needsCategoryId || $needsSubgroupId) {
                Schema::table('products', function (Blueprint $table) use ($needsSubgroup, $needsMetadata, $needsCategoryId, $needsSubgroupId) {
                    if ($needsSubgroup) {
                        $table->string('subgroup')->nullable()->index();
                    }
                    if ($needsMetadata) {
                        $table->json('metadata')->nullable();
                    }
                    if ($needsCategoryId) {
                        $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
                    }
                    if ($needsSubgroupId) {
                        $table->foreignId('subgroup_id')->nullable()->constrained('subgroups')->nullOnDelete();
                    }
                });
            }

            if (app()->environment('testing')) {
                return;
            }

            $hasUnlinkedTaxonomy = self::whereIn('sku', ['CAM-0001', 'CAM-0009'])
                ->whereNull('subgroup_id')
                ->exists();
            $missingDipirona = ! self::where('sku', 'CAM-0009')->exists();

            if (($hasUnlinkedTaxonomy || $missingDipirona) && self::count() > 0) {
                foreach (self::defaultCatalogProducts() as $item) {
                    self::updateOrCreate(['sku' => $item['sku']], $item);
                }
            }
        } catch (\Throwable) {
            // Ignora falha silenciosamente caso o banco não permita DDL no momento
        }
    }
}
