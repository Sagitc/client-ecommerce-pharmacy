<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_products_with_images(): void
    {
        $product = Product::factory()->create();
        ProductImage::factory()->create(['product_id' => $product->id]);

        $response = $this->getJson('/api/products');

        $response->assertOk()
                 ->assertJsonCount(1)
                 ->assertJsonStructure([
                     '*' => [
                         'id',
                         'label',
                         'sku',
                         'price',
                         'category',
                         'images' => [
                             '*' => ['id', 'url', 'sort_order'],
                         ],
                     ],
                 ]);
    }

    public function test_filter_products_by_most_sold(): void
    {
        $lowSales = Product::factory()->create(['sales_count' => 5, 'label' => 'Pouco Vendido']);
        $highSales = Product::factory()->create(['sales_count' => 150, 'label' => 'Mais Vendido']);
        $midSales = Product::factory()->create(['sales_count' => 50, 'label' => 'Médio Vendido']);

        $response = $this->getJson('/api/products?filter=most-sell');

        $response->assertOk();
        $data = $response->json();

        $this->assertEquals($highSales->id, $data[0]['id']);
        $this->assertEquals($midSales->id, $data[1]['id']);
        $this->assertEquals($lowSales->id, $data[2]['id']);
    }

    public function test_filter_products_by_news_or_release(): void
    {
        $oldProduct = Product::factory()->create([
            'label' => 'Antigo',
            'created_at' => now()->subDays(10),
        ]);
        $newProduct = Product::factory()->create([
            'label' => 'Novo',
            'created_at' => now(),
        ]);

        $responseNews = $this->getJson('/api/products?filter=news');
        $responseNews->assertOk();
        $this->assertEquals($newProduct->id, $responseNews->json('0.id'));

        $responseRelease = $this->getJson('/api/products?filter=release');
        $responseRelease->assertOk();
        $this->assertEquals($newProduct->id, $responseRelease->json('0.id'));
    }

    public function test_filter_products_by_category(): void
    {
        Product::factory()->create(['category' => 'medicamentos']);
        Product::factory()->create(['category' => 'higiene']);

        $response = $this->getJson('/api/products?filter=medicamentos');

        $response->assertOk()
                 ->assertJsonCount(1)
                 ->assertJsonPath('0.category', 'medicamentos');
    }

    public function test_search_products_by_label(): void
    {
        Product::factory()->create(['label' => 'Dipirona Gotas 500mg']);
        Product::factory()->create(['label' => 'Shampoo Anticaspa']);

        $response = $this->getJson('/api/products?q=Dipirona');

        $response->assertOk()
                 ->assertJsonCount(1)
                 ->assertJsonPath('0.label', 'Dipirona Gotas 500mg');
    }

    public function test_search_products_by_active_ingredient(): void
    {
        Product::factory()->create([
            'label' => 'Tylenol 750mg',
            'active_ingredient' => 'Paracetamol',
        ]);
        Product::factory()->create([
            'label' => 'Novalgina',
            'active_ingredient' => 'Dipirona Monoidratada',
        ]);

        $response = $this->getJson('/api/products?q=Paracetamol');

        $response->assertOk()
                 ->assertJsonCount(1)
                 ->assertJsonPath('0.active_ingredient', 'Paracetamol');
    }

    public function test_search_products_by_fabricator(): void
    {
        Product::factory()->create([
            'label' => 'Vitamina C',
            'fabricator' => 'Eurofarma',
        ]);
        Product::factory()->create([
            'label' => 'Vitamina D',
            'fabricator' => 'Medley',
        ]);

        $response = $this->getJson('/api/products?q=Eurofarma');

        $response->assertOk()
                 ->assertJsonCount(1)
                 ->assertJsonPath('0.fabricator', 'Eurofarma');
    }

    public function test_products_limit_parameter(): void
    {
        Product::factory()->count(10)->create();

        $response = $this->getJson('/api/products?limit=3');

        $response->assertOk()
                 ->assertJsonCount(3);
    }

    public function test_show_product_by_id(): void
    {
        $product = Product::factory()->create(['label' => 'Protetor Solar']);
        ProductImage::factory()->create(['product_id' => $product->id]);

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertOk()
                 ->assertJsonPath('id', $product->id)
                 ->assertJsonPath('label', 'Protetor Solar')
                 ->assertJsonStructure(['id', 'label', 'images']);
    }

    public function test_show_nonexistent_product_returns_404(): void
    {
        $response = $this->getJson('/api/products/999999');

        $response->assertStatus(404);
    }
}
