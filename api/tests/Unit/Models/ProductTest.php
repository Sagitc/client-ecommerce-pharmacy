<?php

namespace Tests\Unit\Models;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_has_images_relation_ordered_by_sort_order(): void
    {
        $product = Product::factory()->create();

        $image2 = ProductImage::factory()->create([
            'product_id' => $product->id,
            'sort_order' => 2,
        ]);
        $image1 = ProductImage::factory()->create([
            'product_id' => $product->id,
            'sort_order' => 1,
        ]);

        $images = $product->images;
        $this->assertCount(2, $images);
        $this->assertEquals($image1->id, $images->first()->id);
        $this->assertEquals($image2->id, $images->last()->id);
    }

    public function test_product_attribute_casts(): void
    {
        $product = Product::factory()->create([
            'price' => '29.99',
            'promotion_price' => '19.99',
            'requires_prescription' => 1,
            'in_stock' => 1,
            'stock_quantity' => '45',
            'sales_count' => '10',
        ]);

        $this->assertIsFloat($product->price);
        $this->assertSame(29.99, $product->price);

        $this->assertIsFloat($product->promotion_price);
        $this->assertSame(19.99, $product->promotion_price);

        $this->assertIsBool($product->requires_prescription);
        $this->assertTrue($product->requires_prescription);

        $this->assertIsBool($product->in_stock);
        $this->assertTrue($product->in_stock);

        $this->assertIsInt($product->stock_quantity);
        $this->assertSame(45, $product->stock_quantity);

        $this->assertIsInt($product->sales_count);
        $this->assertSame(10, $product->sales_count);
    }

    public function test_product_defaults(): void
    {
        $product = Product::create([
            'label' => 'Dipirona 500mg',
            'fabricator' => 'EMS',
            'price' => 10.50,
            'category' => 'medicamentos',
        ]);

        $fresh = $product->fresh();

        $this->assertEquals('free', $fresh->stripe_type);
        $this->assertFalse($fresh->requires_prescription);
        $this->assertTrue($fresh->in_stock);
        $this->assertEquals(50, $fresh->stock_quantity);
        $this->assertEquals(0, $fresh->sales_count);
    }

    public function test_product_relates_to_category_subgroup_and_metadata_models_and_reflects_updates(): void
    {
        $product = Product::create([
            'label' => 'Dipirona Gotas 500mg/ml',
            'fabricator' => 'EMS',
            'price' => 10.50,
            'category' => 'laboratory',
            'subgroup' => 'Analgésicos e Antitérmicos',
            'metadata' => [
                'Forma Farmacêutica' => 'Gotas',
                'Dosagem' => '500mg/ml',
            ],
        ]);

        $this->assertNotNull($product->category_id);
        $this->assertNotNull($product->subgroup_id);
        $this->assertEquals('laboratory', $product->categoryRelation->slug);
        $this->assertEquals('Analgésicos e Antitérmicos', $product->subgroupRelation->name);
        $this->assertCount(2, $product->metadataItems);

        // Quando o Subgrupo ou um Metadado é renomeado no Model separado, o Produto reflete a mudança imediatamente
        $product->subgroupRelation->update(['name' => 'Dor e Febre']);
        $formaMeta = $product->metadataItems()->where('name', 'Forma Farmacêutica')->first();
        $formaMeta->update(['value' => 'Solução Oral (Gotas)']);

        $freshProduct = $product->fresh(['categoryRelation', 'subgroupRelation', 'metadataItems']);
        $this->assertEquals('Dor e Febre', $freshProduct->subgroup);
        $this->assertEquals('Solução Oral (Gotas)', $freshProduct->metadata['Forma Farmacêutica']);
    }
}
