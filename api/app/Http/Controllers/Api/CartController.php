<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class CartController extends Controller
{
    private function ensureCartItemsTable(): void
    {
        if (! Schema::hasTable('cart_items')) {
            Schema::create('cart_items', function (\Illuminate\Database\Schema\Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->foreignId('product_id')->constrained()->cascadeOnDelete();
                $table->unsignedInteger('quantity')->default(1);
                $table->timestamps();
                $table->unique(['user_id', 'product_id']);
            });
        }
    }

    private function formatUserCart(User $user): array
    {
        $this->ensureCartItemsTable();

        return $user->cartItems()
            ->with('product')
            ->get()
            ->filter(fn ($item) => $item->product !== null)
            ->map(function ($item) {
                $product = $item->product;

                return [
                    'id' => $product->id,
                    'product_id' => $product->id,
                    'label' => $product->label,
                    'fabricator' => $product->fabricator,
                    'image' => $product->image,
                    'price' => (float) $product->price,
                    'promotionPrice' => $product->promotion_price !== null ? (float) $product->promotion_price : null,
                    'promotion_price' => $product->promotion_price !== null ? (float) $product->promotion_price : null,
                    'requiresPrescription' => (bool) $product->requires_prescription,
                    'requires_prescription' => (bool) $product->requires_prescription,
                    'quantity' => (int) $item->quantity,
                ];
            })
            ->values()
            ->all();
    }

    public function index(Request $request)
    {
        return response()->json($this->formatUserCart($request->user()));
    }

    public function store(Request $request)
    {
        $this->ensureCartItemsTable();
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'nullable|integer|min:1|max:100',
        ]);

        $user = $request->user();
        $product = Product::findOrFail($validated['product_id']);
        $qtyToAdd = $validated['quantity'] ?? 1;

        $existing = $user->cartItems()->where('product_id', $product->id)->first();

        if ($existing) {
            $existing->update([
                'quantity' => min(100, $existing->quantity + $qtyToAdd),
            ]);
        } else {
            $user->cartItems()->create([
                'product_id' => $product->id,
                'quantity' => $qtyToAdd,
            ]);
        }

        return response()->json($this->formatUserCart($user));
    }

    public function update(Request $request, string $productId)
    {
        $this->ensureCartItemsTable();
        $validated = $request->validate([
            'quantity' => 'required|integer|min:0|max:100',
        ]);

        $user = $request->user();
        $existing = $user->cartItems()->where('product_id', $productId)->first();

        if ($validated['quantity'] <= 0) {
            if ($existing) {
                $existing->delete();
            }
        } elseif ($existing) {
            $existing->update(['quantity' => $validated['quantity']]);
        } else {
            $product = Product::findOrFail($productId);
            $user->cartItems()->create([
                'product_id' => $product->id,
                'quantity' => $validated['quantity'],
            ]);
        }

        return response()->json($this->formatUserCart($user));
    }

    public function destroy(Request $request, string $productId)
    {
        $this->ensureCartItemsTable();
        $user = $request->user();
        $user->cartItems()->where('product_id', $productId)->delete();

        return response()->json($this->formatUserCart($user));
    }

    public function clear(Request $request)
    {
        $user = $request->user();
        if (Schema::hasTable('cart_items')) {
            $user->cartItems()->delete();
        }

        return response()->json([]);
    }

    public function sync(Request $request)
    {
        $this->ensureCartItemsTable();
        $validated = $request->validate([
            'items' => 'required|array|max:100',
            'items.*.product_id' => 'required|integer',
            'items.*.quantity' => 'required|integer|min:1|max:100',
        ]);

        $user = $request->user();
        $requestedIds = collect($validated['items'])->pluck('product_id')->unique()->all();
        $validProductIds = Product::whereIn('id', $requestedIds)->pluck('id')->flip();

        foreach ($validated['items'] as $item) {
            $productId = (int) $item['product_id'];
            if (! $validProductIds->has($productId)) {
                continue;
            }

            $qty = (int) $item['quantity'];
            $existing = $user->cartItems()->where('product_id', $productId)->first();

            if ($existing) {
                $existing->update([
                    'quantity' => min(100, $existing->quantity + $qty),
                ]);
            } else {
                $user->cartItems()->create([
                    'product_id' => $productId,
                    'quantity' => $qty,
                ]);
            }
        }

        return response()->json($this->formatUserCart($user));
    }
}
