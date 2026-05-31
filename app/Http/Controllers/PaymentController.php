<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentRequest;
use App\Models\Child;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    /**
     * Display a listing of payments.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('payments/index', [
            'payments' => Payment::with('child')
                ->when($request->filled('child_id'), fn ($query) => $query->where('child_id', $request->integer('child_id')))
                ->when($request->filled('date'), fn ($query) => $query->whereDate('payment_date', $request->date('date')))
                ->when($request->filled('type'), fn ($query) => $query->where('payment_type', $request->string('type')))
                ->when($request->filled('mode'), fn ($query) => $query->where('payment_method', $request->string('mode')))
                ->latest('payment_date')
                ->paginate(10)
                ->withQueryString(),
            'children' => Child::where('status', 'active')->orderBy('last_name')->orderBy('first_name')->get(['id', 'first_name', 'last_name']),
            'filters' => $request->only(['child_id', 'date', 'type', 'mode']),
        ]);
    }

    /**
     * Show the form for creating a payment.
     */
    public function create(): Response
    {
        return Inertia::render('payments/create', [
            'children' => Child::where('status', 'active')->orderBy('last_name')->orderBy('first_name')->get(['id', 'first_name', 'last_name']),
        ]);
    }

    /**
     * Store a newly created payment.
     */
    public function store(PaymentRequest $request): RedirectResponse
    {
        Payment::create($request->validated());

        Inertia::flash('success', 'Paiement ajouté avec succès.');

        return redirect()->route('payments.index', ['current_team' => request()->route('current_team')]);
    }

    /**
     * Show the form for editing a payment.
     */
    public function edit(Payment $payment): Response
    {
        return Inertia::render('payments/edit', [
            'payment' => $payment,
            'children' => Child::where('status', 'active')->orWhere('id', $payment->child_id)->orderBy('last_name')->orderBy('first_name')->get(['id', 'first_name', 'last_name']),
        ]);
    }

    /**
     * Update the specified payment.
     */
    public function update(PaymentRequest $request, Payment $payment): RedirectResponse
    {
        $payment->update($request->validated());

        Inertia::flash('success', 'Paiement modifié avec succès.');

        return redirect()->route('payments.index', ['current_team' => request()->route('current_team')]);
    }

    /**
     * Remove the specified payment.
     */
    public function destroy(Payment $payment): RedirectResponse
    {
        $payment->delete();

        Inertia::flash('success', 'Paiement supprimé avec succès.');

        return redirect()->route('payments.index', ['current_team' => request()->route('current_team')]);
    }
}
