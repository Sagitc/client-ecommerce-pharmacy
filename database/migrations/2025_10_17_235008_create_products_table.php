<?php

use App\Models\Category;
use App\Models\Manufacturer;
use App\Models\ProductImage;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->text('description');
            $table->float('cost');
            $table->float('price');
            $table->foreignIdFor(Manufacturer::class);
            $table->integer('stock');
            $table->integer('EAN')->unique();
            $table->string('MS')->nullable()->unique();
            $table->foreignIdFor(Category::class);
            $table->integer('sales_count')->default(0);
            $table->integer('views_count')->default(0);
            $table->boolean('liked')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
