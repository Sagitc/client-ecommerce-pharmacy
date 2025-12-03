<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\CategoryMetadata;
use App\Models\MetadataValue;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class ProductController extends Controller
{

    public function getAllProducts(Request $request)
    {

        $validator =  Validator::make($request->query(), [

            'limit'      => ['sometimes', 'numeric'],
            'orderBy'    => ['sometimes', 'in:views,selling,price'],
            'laboratory' => ['sometimes', 'string'],
            'metadata'   => ['sometimes', 'string']

        ]);

        if ($validator->fails()) {

            return \response()->json([

                'error'    => $validator->errors()->first(),
                'products' => []

            ], 400);
        }

        if ($request->filled('metadata')) {

            $rawMetadata = $request->query('metadata');
            $metadata = json_decode($rawMetadata, true);

            if (\json_last_error() !== JSON_ERROR_NONE) {

                return \response()->json([

                    'error'    => 'Invalid metadata format',
                    'products' => []

                ], 400);
            }

            foreach ($metadata as $key => &$value) {

                $metadataLabelsValidos = CategoryMetadata::pluck('id')->toArray();

                if (!in_array($key, $metadataLabelsValidos)) {

                    return \response()->json([

                        'error'    => "Metadata key '{$key}' does not exist.",
                        'products' => []

                    ], 400);
                }

                $newValue = MetadataValue::where('label', $value)->value('id');
                $value = $newValue;
            }
        }

        $limit   = $request->query('limit', 20);
        $orderBy = 'id';

        $query = Product::query();

        if ($request->query('orderBy')) {

            switch ($request->query('orderBy')) {

                case 'views':

                    $orderBy = 'views_count';
                    break;

                case 'selling':

                    $orderBy = 'sales_count';
                    break;

                case 'price':

                    $orderBy = 'price';
                    break;

                default:

                    $orderBy = 'id';
                    break;
            }
        }

        if ($request->query('laboratory')) {

            $laboratory = $request->query('laboratory');

            $laboratory_label = \strtoupper(substr($laboratory, 0, 1)) . strtolower(substr($laboratory, 1));

            $query->whereHas('laboratory', function ($q) use ($laboratory_label) {

                $q->where('label', $laboratory_label);
            });
        }

        $query->orderBy($orderBy, 'desc');
        $query->with('category', 'laboratory');

        $metadata = [];

        if ($request->filled('metadata')) {

            $rawMetadata = $request->query('metadata');
            $metadata = json_decode($rawMetadata, true);

            if (\json_last_error() !== JSON_ERROR_NONE) {

                return \response()->json([

                    'error'    => 'Invalid metadata format',
                    'products' => []

                ], 400);
            }

            foreach ($metadata as $key => &$value) {

                $metadataLabelsValidos = \App\Models\CategoryMetadata::pluck('id')->toArray();

                if (!in_array($key, $metadataLabelsValidos)) {

                    return \response()->json([

                        'error'    => "Metadata key '{$key}' does not exist.",
                        'products' => []

                    ], 400);
                }

                $newValue = MetadataValue::where('label', $value)->value('id');
                $value = $newValue;
            }
        }

        $query->with('metadata');

        foreach ($metadata as $key => $value) {

            $query->whereHas('metadata', function ($q) use ($key, $value) {

                $q->where('category_metadata_id', $key)
                    ->where('metadata_value_id',  $value);
            });
        }

        $query->limit($limit);

        $products = $query->get();

        return \response()->json([

            'error' => null,

            'products' => $products->map(function ($product) {

                return [

                    'id' => $product->id,

                    'label' => $product->label,
                    'SKU'  => $product->SKU,

                    'stock'       => $product->stock,
                    'EAN'         => $product->EAN,
                    'views_count' => $product->views_count,
                    'sales_count' => $product->sales_count,

                    'cost'  => $product->cost,
                    'price' => $product->price,

                    'category'   => $product->category ? $product->category->name : null,
                    'laboratory' => $product->laboratory ? $product->laboratory->label : null,

                    'image' => asset($product->images->first()->image_path ?? null),

                    'liked' => $product->liked,

                ];
            }),

        ]);
    }

    public function getProductById(Request $request, $id)
    {

        if (!is_numeric($id)) {

            return response()->json([

                'error'    => 'Invalid product ID.',
                'product'  => null,
                'category' => null,

            ], 400);
        }

        $product = Product::with(['category', 'images'])->find($id);

        if (!$product) {

            return response()->json([

                'error'   => 'Product not found.',
                'product' => null,

            ], 404);
        }

        $images = $product->images->map(function (ProductImage $image) {

            return asset($image->image_path);
            
        })->toArray();

        if (empty($images)) {

            $images = [asset('images/products/default_generic.jpg')];
        }

        return response()->json([

            'error'   => null,

            'product' => [

                'id'          => $product->id,
                'label'       => $product->label,
                'SKU'         => $product->SKU,
                'description' => $product->description,
                'stock'       => $product->stock,
                'EAN'         => $product->EAN,
                'views_count' => $product->views_count,
                'sales_count' => $product->sales_count,
                'cost'        => $product->cost,
                'price'       => $product->price,
                'liked'       => $product->liked,
                'images'      => $images,
                'laboratory'  => $product->laboratory->label ?? null,

            ],

            'category' => $product->category ? [

                'id'   => $product->category->id,
                'name' => $product->category->name,

            ] : null,

        ]);
    }

    public function getRelatedProductsById(Request $request, $id)
    {

        $validator = Validator::make($request->query(), [

            'limit'   => ['sometimes', 'numeric'],
            'orderBy' => ['sometimes', 'in:selling'],

        ]);

        if ($validator->fails()) {

            return response()->json([

                'error'    => $validator->errors()->first(),
                'products' => []

            ], 400);
        }

        if (!is_numeric($id)) {

            return response()->json([

                'error'    => 'Invalid product ID.',
                'products' => []

            ], 400);
        }

        $limit = $request->query('limit', 5);

        $product = Product::find($id);

        $orderBy = $request->query('orderBy', null);

        if (!$product) {

            return response()->json([

                'error'    => 'Product not found.',
                'products' => []

            ], 404);
        }

        $relatedProducts =  Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->when($orderBy === 'selling', function ($query) {
                return $query->orderBy('sales_count', 'desc');
            })
            ->limit($limit)
            ->get();

        $formattedProducts = $relatedProducts->map(function ($product) {
            return [
                'id'       => $product->id,
                'label'    => $product->label,
                'SKU'      => $product->SKU,
                'price'    => $product->price,
                'image'    => asset($product->images->first()->image_path ?? 'images/products/default_generic.jpg'),
                'category' => $product->category()->pluck('slug')->first(),
            ];
        });

        return response()->json([

            'error'    => null,
            'products' => $formattedProducts

        ]);
    }

    public function getProductsByCategorySlug(Request $request, $slug)
    {

        $validator = Validator::make($request->query(), [

            'limit'   => ['sometimes', 'numeric'],
            'orderBy' => ['sometimes', 'in:views,selling,price'],

        ]);

        if ($validator->fails()) {

            return response()->json([

                'error'    => $validator->errors()->first(),
                'products' => []

            ], 400);
        }

        $slugs_allowed = [
            'medicamento',
            'higiene-e-cuidados-pessoais',
            'mamae-e-bebe',
            'dermacosmeticos-e-beleza',
            'saude-e-bem-estar'
        ];

        if (!in_array($slug, $slugs_allowed)) {

            return response()->json([

                'error'    => 'Invalid category slug.',
                'products' => []

            ], 400);
        }

        $limit = $request->query('limit', 10);

        switch ($request->query('orderBy')) {

            case 'views':

                $orderBy = 'views_count';
                break;

            case 'selling':

                $orderBy = 'sales_count';
                break;

            case 'price':

                $orderBy = 'price';
                break;

            default:

                $orderBy = 'sales_count';
                break;
        }

        $category = Category::where('slug', $slug)->first();

        if (!$category) {

            return response()->json([

                'error'    => 'Category not found.',
                'products' => []

            ], 404);
        }

        $query = Product::query();

        $query->where('category_id', $category->id);
        $query->orderBy($orderBy, 'desc');
        $query->with('category');
        $query->limit($limit);

        $products = $query->get();

        $formattedProducts = $products->map(function ($product) use ($category) {
            return [
                'id'       => $product->id,
                'label'    => $product->label,
                'SKU'      => $product->SKU,
                'price'    => $product->price,
                'image'    => asset($product->images->first()->image_path ?? 'images/products/product_example.png'),
                'category' => $category->slug,
            ];
        });

        return response()->json([

            'error'    => null,
            'products' => $formattedProducts

        ]);
    }

    public function getProductsBySearch(Request $request)
    {

        $validator = Validator::make($request->query(), [

            'product_name' => ['required', 'string'],
            'limit'        => ['sometimes', 'numeric'],
            'orderBy'      => ['sometimes', 'in:views,selling,price_low,price_high'],

        ]);

        if ($validator->fails()) {

            return response()->json([

                'error'    => $validator->errors()->first(),
                'products' => []

            ], 400);
        }

        $product_name = $request->query('product_name');
        $limit = $request->query('limit', 10);

        switch ($request->query('orderBy')) {

            case 'views':

                $orderBy = 'views_count';
                break;

            case 'selling':

                $orderBy = 'sales_count';
                break;

            case 'price':

                $orderBy = 'price';
                break;
            
            case 'price_low':

                $orderBy = 'price';
                $orderDirection = 'asc';
                break;

            case 'price_high':

                $orderBy = 'price';
                $orderDirection = 'desc';
                break;

            default:

                $orderBy = 'sales_count';
                break;
        }

        $products = Product::where('label', 'like', '%' . $product_name . '%')->orderBy($orderBy, $orderDirection ?? 'desc')->limit($limit)->get();

        $formattedProducts = $products->map(function ($product) {
            return [
                'id'       => $product->id,
                'label'    => $product->label,
                'SKU'      => $product->SKU,
                'price'    => $product->price,
                'image'    => asset($product->images->first()->image_path ?? 'images/products/product_example.png'),
                'category' => $product->category()->pluck('slug')->first(),
            ];
        });

        return response()->json([

            'error'    => null,
            'products' => $formattedProducts

        ]);
    }

    public function product_view($id)
    {

        $fakeRequest = new Request();
        $response = $this->getProductById($fakeRequest, $id);

        $data = method_exists($response, 'getData')
            ? ($response->getData(true))
            : (json_decode($response->getContent(), true) ?: []);

        $product = $data['product'] ?? null;

        return view('pages/product', [
            'product_id' => $id,
            'product'    => $product,
        ]);
    }
}
