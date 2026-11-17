<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('categories')) {
            Schema::create('categories', function (Blueprint $table) {
                $table->id();
                $table->string('slug')->unique();
                $table->string('name');
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('subgroups')) {
            Schema::create('subgroups', function (Blueprint $table) {
                $table->id();
                $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
                $table->string('slug');
                $table->string('name');
                $table->timestamps();

                $table->unique(['category_id', 'slug']);
            });
        }

        if (! Schema::hasTable('subgroup_metadata')) {
            Schema::create('subgroup_metadata', function (Blueprint $table) {
                $table->id();
                $table->foreignId('subgroup_id')->constrained('subgroups')->cascadeOnDelete();
                $table->string('name');
                $table->string('value');
                $table->timestamps();

                $table->unique(['subgroup_id', 'name', 'value']);
            });
        }

        if (! Schema::hasTable('product_metadata')) {
            Schema::create('product_metadata', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
                $table->foreignId('subgroup_metadata_id')->constrained('subgroup_metadata')->cascadeOnDelete();
                $table->timestamps();

                $table->unique(['product_id', 'subgroup_metadata_id']);
            });
        }

        if (Schema::hasTable('products')) {
            Schema::table('products', function (Blueprint $table) {
                if (! Schema::hasColumn('products', 'category_id')) {
                    $table->foreignId('category_id')->nullable()->after('category')->constrained('categories')->nullOnDelete();
                }
                if (! Schema::hasColumn('products', 'subgroup_id')) {
                    $table->foreignId('subgroup_id')->nullable()->after('subgroup')->constrained('subgroups')->nullOnDelete();
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('products')) {
            Schema::table('products', function (Blueprint $table) {
                if (Schema::hasColumn('products', 'subgroup_id')) {
                    $table->dropConstrainedForeignId('subgroup_id');
                }
                if (Schema::hasColumn('products', 'category_id')) {
                    $table->dropConstrainedForeignId('category_id');
                }
            });
        }

        Schema::dropIfExists('product_metadata');
        Schema::dropIfExists('subgroup_metadata');
        Schema::dropIfExists('subgroups');
        Schema::dropIfExists('categories');
    }
};
