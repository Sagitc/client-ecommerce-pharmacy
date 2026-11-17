<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('products')) {
            Schema::table('products', function (Blueprint $table) {
                if (! Schema::hasColumn('products', 'subgroup')) {
                    $table->string('subgroup')->nullable()->after('category')->index();
                }
                if (! Schema::hasColumn('products', 'metadata')) {
                    $table->json('metadata')->nullable()->after('subgroup');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('products')) {
            Schema::table('products', function (Blueprint $table) {
                $columns = [];
                if (Schema::hasColumn('products', 'subgroup')) {
                    $columns[] = 'subgroup';
                }
                if (Schema::hasColumn('products', 'metadata')) {
                    $columns[] = 'metadata';
                }
                if (! empty($columns)) {
                    $table->dropColumn($columns);
                }
            });
        }
    }
};
