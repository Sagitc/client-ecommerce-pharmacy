<?php

namespace App\Services;

use App\Models\Product;

class ProductService
{
	public function __construct()
	{
		// Inject dependencies here if needed (e.g., repositories, other services)
	}

	/**
	 * Example method to fetch a product by its ID.
	 */
	public function findById(int $id): ?Product
	{
		return Product::find($id);
	}
}

