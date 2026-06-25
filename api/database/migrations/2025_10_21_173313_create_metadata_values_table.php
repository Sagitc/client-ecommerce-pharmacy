<?php

use App\Models\CategoryMetadata;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration  {
    
    public function up(): void  {

        Schema::create('metadata_values', function (Blueprint $table) {

            $table->id();

            $table->string('label');
            
            $table->foreignIdFor(CategoryMetadata::class);

        });

    }

    public function down(): void    {

        Schema::dropIfExists('metadata_values');
        
    }
};
