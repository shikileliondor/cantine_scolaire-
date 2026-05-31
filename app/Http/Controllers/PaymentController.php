<?php

namespace App\Http\Controllers;

use App\Http\Requests\Payments\StorePaymentRequest;
use App\Http\Requests\Payments\UpdatePaymentRequest;
use App\Models\Child;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    /**
     * Display a paginated listing of payments.
     */
    public function index(Request $request): Response
    {
        $payments = Payment::query()
            ->with('child')
            ->when($request->date('payment_date'), fn ($query, $paymentDate) => $query->whereDate('payment_date', $paymentDate))
            ->when($request->integer('child_id') > 0, fn ($query) => $query->where('child_id', $request->integer('child_id')))
            ->when($request->string('payment_type')->toString() !== '', fn ($query) => $query->where('payment_type', $request->string('payment_type')->toString()))
            ->when($request->string('payment_method')->toString() !== '', fn ($query) => $query->where('payment_method', $request->string('payment_method')->toString()))
            ->latest('payment_date')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Payments/Index', [
            'payments' => $payments,
            'filters' => $request->only(['payment_date', 'child_id', 'payment_type', 'payment_method']),
            'paymentTypes' => ['daily', 'weekly', 'monthly', 'custom'],
            'paymentMethods' => ['cash', 'mobile_money', 'bank_transfer', 'other'],
        ]);
    }

    /**
     * Show the form for creating a payment.
     */
    public function create(): Response
    {
        return Inertia::render('Payments/Create', [
            'children' => $this->childrenForSelect(),
            'paymentTypes' => ['daily', 'weekly', 'monthly', 'custom'],
            'paymentMethods' => ['cash', 'mobile_money', 'bank_transfer', 'other'],
        ]);
    }

    /**
     * Store a newly created payment.
     */
    public function store(StorePaymentRequest $request): RedirectResponse
    {
        Payment::create($request->validated());

        return redirect()
            ->route('payments.index')
            ->with('success', __('Payment created successfully.'));
    }

    /**
     * Show the form for editing a payment.
     */
    public function edit(Payment $payment): Response
    {
        return Inertia::render('Payments/Edit', [
            'payment' => $payment->load('child'),
            'children' => $this->childrenForSelect(),
            'paymentTypes' => ['daily', 'weekly', 'monthly', 'custom'],
            'paymentMethods' => ['cash', 'mobile_money', 'bank_transfer', 'other'],
        ]);
    }

    /**
     * Update the specified payment.
     */
    public function update(UpdatePaymentRequest $request, Payment $payment): RedirectResponse
    {
        $payment->update($request->validated());

        return redirect()
            ->route('payments.index')
            ->with('success', __('Payment updated successfully.'));
    }

    /**
     * Remove the specified payment.
     */
    public function destroy(Payment $payment): RedirectResponse
    {
        $payment->delete();

        return redirect()
            ->route('payments.index')
            ->with('success', __('Payment deleted successfully.'));
    }

    /**
     * Get active children used by payment forms.
     */
    private function childrenForSelect(): Collection
    {
        return Child::query()
            ->where('status', 'active')
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name', 'matricule', 'class_name']);
    }
}
