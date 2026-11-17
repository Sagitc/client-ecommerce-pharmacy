<?php

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
            $table->string('sku')->unique()->nullable();
            $table->string('ean', 14)->unique()->nullable();
            $table->string('label');
            $table->string('fabricator');
            $table->string('dosage')->nullable();
            $table->string('active_ingredient')->nullable();
            $table->text('description')->nullable();

            $table->decimal('price', 8, 2);
            $table->decimal('promotion_price', 8, 2)->nullable();

            $table->string('image')->nullable();
            $table->string('category')->index();
            $table->string('subgroup')->nullable()->index();
            $table->json('metadata')->nullable();

            $table->enum('stripe_type', ['free', 'red', 'red_retained'])->default('free');
            $table->boolean('requires_prescription')->default(false);
            $table->boolean('in_stock')->default(true);
            $table->unsignedInteger('stock_quantity')->default(50);
            $table->unsignedInteger('sales_count')->default(0);

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
