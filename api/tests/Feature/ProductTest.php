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

    public function test_search_returns_only_matching_products_with_category_subgroup_and_metadata(): void
    {
        Product::factory()->create([
            'label' => 'Dipirona Monoidratada 500mg Medley - 10 Comprimidos',
            'active_ingredient' => 'Dipirona Monoidratada',
            'fabricator' => 'Medley',
            'category' => 'laboratory',
            'subgroup' => 'Analgésicos e Antitérmicos',
            'metadata' => [
                'Forma Farmacêutica' => 'Comprimido',
                'Dosagem' => '500mg',
            ],
            'price' => 8.90,
        ]);

        Product::factory()->create([
            'label' => 'Dipirona Sódica Xarope Infantil 50mg/ml',
            'active_ingredient' => 'Dipirona Sódica',
            'fabricator' => 'Germed',
            'category' => 'infantile',
            'subgroup' => 'Analgésicos e Antitérmicos',
            'metadata' => [
                'Forma Farmacêutica' => 'Xarope',
                'Dosagem' => '50mg/ml',
            ],
            'price' => 18.90,
        ]);

        // Produto não relacionado que NÃO deve aparecer ao pesquisar "dipirona"
        Product::factory()->create([
            'label' => 'Protetor Solar Facial FPS 70',
            'active_ingredient' => 'XL-Protect',
            'fabricator' => 'La Roche-Posay',
            'category' => 'sunscreen',
            'subgroup' => 'Proteção Facial',
            'metadata' => [
                'FPS' => 'FPS 70',
            ],
            'price' => 89.90,
        ]);

        $response = $this->getJson('/api/products?q=dipirona');

        $response->assertOk()
                 ->assertJsonCount(2);

        $returnedLabels = collect($response->json())->pluck('label')->all();
        $this->assertContains('Dipirona Monoidratada 500mg Medley - 10 Comprimidos', $returnedLabels);
        $this->assertContains('Dipirona Sódica Xarope Infantil 50mg/ml', $returnedLabels);
        $this->assertNotContains('Protetor Solar Facial FPS 70', $returnedLabels);

        // Verifica filtro combinado de busca + categoria + subgrupo + ordenação de preço
        $filtered = $this->getJson('/api/products?q=dipirona&category=laboratory&subgroup=' . urlencode('Analgésicos e Antitérmicos') . '&order=price_asc');
        $filtered->assertOk()
                 ->assertJsonCount(1)
                 ->assertJsonPath('0.category', 'laboratory')
                 ->assertJsonPath('0.subgroup', 'Analgésicos e Antitérmicos')
                 ->assertJsonPath('0.metadata.Forma Farmacêutica', 'Comprimido');

        // Renomear o Subgrupo diretamente no Model Subgroup atualiza o retorno da API para todos os produtos vinculados
        $subgroup = \App\Models\Subgroup::where('name', 'Analgésicos e Antitérmicos')->first();
        $this->assertNotNull($subgroup);
        $subgroup->update(['name' => 'Alívio de Dor e Febre']);

        $afterRename = $this->getJson('/api/products?q=dipirona&subgroup=' . urlencode('Alívio de Dor e Febre'));
        $afterRename->assertOk()
                    ->assertJsonPath('0.subgroup', 'Alívio de Dor e Febre');

        // Endpoint de árvore de categorias -> subgrupos -> metadados
        $categoriesTree = $this->getJson('/api/categories');
        $categoriesTree->assertOk()
                       ->assertJsonStructure([
                           '*' => [
                               'id',
                               'slug',
                               'name',
                               'subgroups' => [
                                   '*' => [
                                       'id',
                                       'name',
                                       'metadata_options',
                                   ],
                               ],
                           ],
                       ]);
    }
}
