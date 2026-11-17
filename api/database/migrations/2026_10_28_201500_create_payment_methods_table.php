<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Inativado temporariamente: métodos de pagamento salvos no banco de dados
        // não são utilizados enquanto o checkout opera via gateway do Mercado Pago.
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
