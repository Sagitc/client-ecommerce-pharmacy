<?php
// api/app/Http/Controllers/Api/PrescriptionReviewController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use App\Services\SecuritySanitizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PrescriptionReviewController extends Controller
{
    private function authorizePharmacist(Request $request): void
    {
        if (! in_array($request->user()->role, ['pharmacist', 'admin'])) {
            abort(403, 'Acesso restrito a farmacêuticos e administradores.');
        }
    }

    public function index(Request $request)
    {
        $this->authorizePharmacist($request);

        $query = Prescription::with([
            'order.user:id,name,email,cpf,phone',
            'order.items.product:id,label,sku,stripe_type,requires_prescription',
            'reviewer:id,name',
        ])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return response()->json($query->get());
    }

    public function review(Request $request, string $id)
    {
        $this->authorizePharmacist($request);

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'rejection_reason' => 'required_if:status,rejected|nullable|string|max:500',
        ]);

        $prescription = Prescription::with('order.prescriptions')->findOrFail($id);

        $prescription->update([
            'status' => $validated['status'],
            'rejection_reason' => $validated['status'] === 'rejected' ? SecuritySanitizer::clean($validated['rejection_reason']) : null,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        // Sincroniza o status do pedido conforme resultado da auditoria
        $order = $prescription->order;
        if ($validated['status'] === 'rejected') {
            $order->update(['status' => 'cancelled']);
        } else {
            $hasPendingOrRejected = $order->prescriptions()
                ->where('status', '!=', 'approved')
                ->exists();

            if (! $hasPendingOrRejected && $order->status === 'awaiting_prescription_review') {
                $order->update(['status' => 'processing']);
            }
        }

        return response()->json(
            $prescription->fresh(['order.user', 'order.items.product', 'reviewer'])
        );
    }

    public function download(Request $request, string $id)
    {
        $this->authorizePharmacist($request);

        $prescription = Prescription::findOrFail($id);

        // Prevenção contra Directory Traversal
        if (str_contains($prescription->file_path, '..') || ! str_starts_with($prescription->file_path, 'prescriptions/')) {
            abort(403, 'Acesso a caminho de arquivo não autorizado.');
        }

        if (! Storage::disk('local')->exists($prescription->file_path)) {
            abort(404, 'Arquivo de receita não encontrado no servidor.');
        }

        return Storage::disk('local')->download(
            $prescription->file_path,
            $prescription->original_name
        );
    }
}