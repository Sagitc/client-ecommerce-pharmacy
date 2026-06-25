<?php

use App\Models\Category;
use App\Models\Laboratory;
use App\Models\ProductImage;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration  {
    
    public function up(): void  {

        Schema::create('products', function (Blueprint $table) {

            $table->id();

            $table->string('label'     );
            $table->string('main_image')->default('http://127.0.0.1:8000/images/products/product_example.png');
            $table->string('MS'        )->nullable()->unique();
            $table->string('SKU'       )->unique();

            $table->text('description');
            
            $table->integer('stock'      );
            $table->integer('EAN'        )->unique();
            $table->integer('sales_count')->default(0);
            $table->integer('views_count')->default(0);
            $table->integer('total_rating')->default(0);

            $table->float('cost' );
            $table->float('price');

            $table->boolean('liked')->default(false);

            $table->foreignIdFor(Laboratory::class);
            $table->foreignIdFor(Category::class  );

            $table->timestamps();

        });

    }

    public function down(): void    {

        Schema::dropIfExists('products');

    }
};
