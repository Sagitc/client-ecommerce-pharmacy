<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pharmacy_units', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->boolean('is_ecommerce_hub')->default(false);
            $table->boolean('allows_pickup')->default(true);
            $table->string('pickup_ready_time')->default('Pronto em até 1 hora');
            
            // Dados Fiscais
            $table->string('razao_social');
            $table->string('cnpj', 20);
            $table->string('state_registration', 30)->nullable();
            
            // Endereço e Contato
            $table->string('cep', 10);
            $table->string('address');
            $table->string('neighborhood');
            $table->string('hours');
            $table->string('phone', 30)->nullable();
            $table->string('whatsapp', 30)->nullable();
            $table->text('maps_url')->nullable();
            
            // Coordenadas (Haversine / Google Maps)
            $table->decimal('lat', 10, 7);
            $table->decimal('lng', 10, 7);
            
            // Dados Regulatórios (ANVISA / CRF) e Serviços em JSON
            $table->json('legal')->nullable();
            $table->json('services')->nullable();
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pharmacy_units');
    }
};