<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\PharmacyUnit;
use App\Models\Prescription;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PrescriptionReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_prescription_admin_endpoints(): void
    {
        $this->getJson('/api/admin/prescriptions')->assertStatus(401);
        $this->patchJson('/api/admin/prescriptions/1/review', [])->assertStatus(401);
        $this->getJson('/api/admin/prescriptions/1/file')->assertStatus(401);
    }

    public function test_customer_cannot_access_prescription_admin_endpoints(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        Sanctum::actingAs($customer);

        $this->getJson('/api/admin/prescriptions')->assertForbidden();
        $this->patchJson('/api/admin/prescriptions/1/review', ['status' => 'approved'])->assertForbidden();
        $this->getJson('/api/admin/prescriptions/1/file')->assertForbidden();
    }

    public function test_pharmacist_can_list_prescriptions_with_relations(): void
    {
        $pharmacist = User::factory()->create(['role' => 'pharmacist']);
        $order = Order::factory()->create();
        $prescription = Prescription::factory()->create([
            'order_id' => $order->id,
            'status' => 'pending',
        ]);

        Sanctum::actingAs($pharmacist);

        $response = $this->getJson('/api/admin/prescriptions');

        $response->assertOk()
                 ->assertJsonCount(1)
                 ->assertJsonPath('0.id', $prescription->id)
                 ->assertJsonStructure([
                     '*' => [
                         'id',
                         'order_id',
                         'file_path',
                         'original_name',
                         'status',
                         'order' => [
                             'id',
                             'user',
                             'items',
                         ],
                     ],
                 ]);
    }

    public function test_admin_can_list_and_filter_prescriptions_by_status(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Prescription::factory()->create(['status' => 'pending']);
        Prescription::factory()->approved()->create();

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/prescriptions?status=pending');

        $response->assertOk()
                 ->assertJsonCount(1)
                 ->assertJsonPath('0.status', 'pending');
    }

    public function test_pharmacist_can_approve_prescription_and_order_transitions_to_processing(): void
    {
        $pharmacist = User::factory()->create(['role' => 'pharmacist']);
        $order = Order::factory()->awaitingPrescription()->create();
        $prescription = Prescription::factory()->create([
            'order_id' => $order->id,
            'status' => 'pending',
        ]);

        Sanctum::actingAs($pharmacist);

        $response = $this->patchJson("/api/admin/prescriptions/{$prescription->id}/review", [
            'status' => 'approved',
        ]);

        $response->assertOk()
                 ->assertJsonPath('status', 'approved')
                 ->assertJsonPath('reviewed_by', $pharmacist->id);

        $this->assertDatabaseHas('prescriptions', [
            'id' => $prescription->id,
            'status' => 'approved',
            'reviewed_by' => $pharmacist->id,
        ]);

        $this->assertEquals('processing', $order->fresh()->status);
    }

    public function test_order_remains_awaiting_review_if_another_prescription_is_still_pending(): void
    {
        $pharmacist = User::factory()->create(['role' => 'pharmacist']);
        $order = Order::factory()->awaitingPrescription()->create();

        $prescription1 = Prescription::factory()->create([
            'order_id' => $order->id,
            'status' => 'pending',
        ]);
        $prescription2 = Prescription::factory()->create([
            'order_id' => $order->id,
            'status' => 'pending',
        ]);

        Sanctum::actingAs($pharmacist);

        // Aprova apenas a primeira receita
        $this->patchJson("/api/admin/prescriptions/{$prescription1->id}/review", [
            'status' => 'approved',
        ])->assertOk();

        // Como prescription2 ainda está pending, o pedido continua awaiting_prescription_review
        $this->assertEquals('awaiting_prescription_review', $order->fresh()->status);

        // Aprova a segunda receita
        $this->patchJson("/api/admin/prescriptions/{$prescription2->id}/review", [
            'status' => 'approved',
        ])->assertOk();

        // Agora todas foram aprovadas, o pedido deve ir para processing
        $this->assertEquals('processing', $order->fresh()->status);
    }

    public function test_rejecting_prescription_requires_rejection_reason(): void
    {
        $pharmacist = User::factory()->create(['role' => 'pharmacist']);
        $prescription = Prescription::factory()->create(['status' => 'pending']);

        Sanctum::actingAs($pharmacist);

        $response = $this->patchJson("/api/admin/prescriptions/{$prescription->id}/review", [
            'status' => 'rejected',
            // sem rejection_reason
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['rejection_reason']);
    }

    public function test_rejecting_prescription_cancels_order(): void
    {
        $pharmacist = User::factory()->create(['role' => 'pharmacist']);
        $order = Order::factory()->awaitingPrescription()->create();
        $prescription = Prescription::factory()->create([
            'order_id' => $order->id,
            'status' => 'pending',
        ]);

        Sanctum::actingAs($pharmacist);

        $response = $this->patchJson("/api/admin/prescriptions/{$prescription->id}/review", [
            'status' => 'rejected',
            'rejection_reason' => 'Receita médica com data de validade vencida.',
        ]);

        $response->assertOk()
                 ->assertJsonPath('status', 'rejected')
                 ->assertJsonPath('rejection_reason', 'Receita médica com data de validade vencida.');

        $this->assertDatabaseHas('prescriptions', [
            'id' => $prescription->id,
            'status' => 'rejected',
            'rejection_reason' => 'Receita médica com data de validade vencida.',
        ]);

        $this->assertEquals('cancelled', $order->fresh()->status);
    }

    public function test_pharmacist_can_download_prescription_file(): void
    {
        Storage::fake('local');

        $pharmacist = User::factory()->create(['role' => 'pharmacist']);
        $filePath = 'prescriptions/test_prescription.pdf';
        Storage::disk('local')->put($filePath, 'conteudo simulado do arquivo pdf');

        $prescription = Prescription::factory()->create([
            'file_path' => $filePath,
            'original_name' => 'receita_original.pdf',
        ]);

        Sanctum::actingAs($pharmacist);

        $response = $this->getJson("/api/admin/prescriptions/{$prescription->id}/file");

        $response->assertOk();
        $this->assertTrue(
            str_contains($response->headers->get('content-disposition') ?? '', 'receita_original.pdf')
        );
    }

    public function test_download_prescription_returns_404_when_file_not_found(): void
    {
        Storage::fake('local');

        $pharmacist = User::factory()->create(['role' => 'pharmacist']);
        $prescription = Prescription::factory()->create([
            'file_path' => 'prescriptions/inexistente.pdf',
        ]);

        Sanctum::actingAs($pharmacist);

        $response = $this->getJson("/api/admin/prescriptions/{$prescription->id}/file");

        $response->assertStatus(404);
    }
}
