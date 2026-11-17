<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (! Schema::hasColumn('users', 'birth_date')) {
                    $table->date('birth_date')->nullable()->after('phone');
                }
                if (! Schema::hasColumn('users', 'gender')) {
                    $table->string('gender', 20)->nullable()->after('birth_date');
                }
            });
        }

        if (! Schema::hasTable('favorites')) {
            Schema::create('favorites', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->foreignId('product_id')->constrained()->cascadeOnDelete();
                $table->timestamps();

                $table->unique(['user_id', 'product_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};
