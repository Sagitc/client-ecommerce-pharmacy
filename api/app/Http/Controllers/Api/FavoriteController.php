<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class FavoriteController extends Controller
{
    private function ensureFavoritesTable(): void
    {
        if (! Schema::hasTable('favorites')) {
            Schema::create('favorites', function (\Illuminate\Database\Schema\Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->foreignId('product_id')->constrained()->cascadeOnDelete();
                $table->timestamps();
                $table->unique(['user_id', 'product_id']);
            });
        }
    }

    public function index(Request $request)
    {
        $this->ensureFavoritesTable();

        $products = $request->user()
            ->favoriteProducts()
            ->with('images')
            ->get();

        return response()->json([
            'ids' => $products->pluck('id')->values(),
            'products' => $products,
        ]);
    }

    public function toggle(Request $request, string $productId)
    {
        $this->ensureFavoritesTable();

        $product = Product::findOrFail($productId);
        $user = $request->user();

        $existing = $user->favorites()->where('product_id', $product->id)->first();

        if ($existing) {
            $existing->delete();
            $isFavorited = false;
        } else {
            $user->favorites()->create(['product_id' => $product->id]);
            $isFavorited = true;
        }

        return response()->json([
            'is_favorited' => $isFavorited,
            'product_id' => $product->id,
            'ids' => $user->favorites()->pluck('product_id')->values(),
        ]);
    }

    public function sync(Request $request)
    {
        $this->ensureFavoritesTable();
        $validated = $request->validate([
            'product_ids' => 'required|array|max:100',
            'product_ids.*' => 'integer',
        ]);

        $user = $request->user();
        $validProductIds = Product::whereIn('id', array_unique($validated['product_ids']))
            ->pluck('id');

        foreach ($validProductIds as $productId) {
            $user->favorites()->firstOrCreate(['product_id' => $productId]);
        }

        return response()->json([
            'ids' => $user->favorites()->pluck('product_id')->values(),
        ]);
    }
}
