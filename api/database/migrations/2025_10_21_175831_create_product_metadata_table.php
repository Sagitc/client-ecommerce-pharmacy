<?php

use App\Models\CategoryMetadata;
use App\Models\MetadataValue;
use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration  {
    
    public function up(): void  {

        Schema::create('product_metadata', function (Blueprint $table) {

            $table->id();

            $table->foreignIdFor(Product::class         );
            $table->foreignIdFor(CategoryMetadata::class);
            $table->foreignIdFor(MetadataValue::class   );

        });

    }

    public function down(): void    {

        Schema::dropIfExists('product_metadata');

    }

};
