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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique(); // Ex: CAM-2026-0001
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            
            // Logística Híbrida (Entrega vs Retirada)
            $table->enum('shipping_method', ['delivery', 'pickup']);
            $table->foreignId('address_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('pharmacy_unit_id')->nullable()->constrained()->nullOnDelete();
            
            // Valores Financeiros
            $table->decimal('subtotal', 10, 2);
            $table->decimal('shipping_cost', 8, 2)->default(0);
            $table->decimal('discount', 8, 2)->default(0);
            $table->decimal('total', 10, 2);
            
            // Pagamento e Status do Fluxo
            $table->enum('payment_method', ['pix', 'credit_card', 'debit_card', 'cash_on_delivery']);
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->enum('status', [
                'pending',
                'awaiting_prescription_review', // Travado aguardando farmacêutico
                'processing',
                'ready_for_pickup',
                'out_for_delivery',
                'completed',
                'cancelled'
            ])->default('pending');
            
            $table->text('notes')->nullable(); // Ex: Troco para R$ 50
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
