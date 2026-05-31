<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChildRequest;
use App\Models\Child;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChildController extends Controller
{
    /**
     * Display a listing of children.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        return Inertia::render('children/index', [
            'children' => Child::query()
                ->when($search !== '', function ($query) use ($search): void {
                    $query->where(function ($query) use ($search): void {
                        $query->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('matricule', 'like', "%{$search}%")
                            ->orWhere('class_name', 'like', "%{$search}%");
                    });
                })
                ->latest()
                ->paginate(10)
                ->withQueryString(),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a child.
     */
    public function create(): Response
    {
        return Inertia::render('children/create');
    }

    /**
     * Store a newly created child.
     */
    public function store(ChildRequest $request): RedirectResponse
    {
        Child::create($request->validated());

        Inertia::flash('success', 'Enfant ajouté avec succès.');

        return redirect()->route('children.index', ['current_team' => request()->route('current_team')]);
    }

    /**
     * Show the form for editing a child.
     */
    public function edit(Child $child): Response
    {
        return Inertia::render('children/edit', [
            'child' => $child,
        ]);
    }

    /**
     * Update the specified child.
     */
    public function update(ChildRequest $request, Child $child): RedirectResponse
    {
        $child->update($request->validated());

        Inertia::flash('success', 'Enfant modifié avec succès.');

        return redirect()->route('children.index', ['current_team' => request()->route('current_team')]);
    }

    /**
     * Remove the specified child.
     */
    public function destroy(Child $child): RedirectResponse
    {
        $child->delete();

        Inertia::flash('success', 'Enfant supprimé avec succès.');

        return redirect()->route('children.index', ['current_team' => request()->route('current_team')]);
    }
}
