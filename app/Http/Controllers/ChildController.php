<?php

namespace App\Http\Controllers;

use App\Http\Requests\Children\StoreChildRequest;
use App\Http\Requests\Children\UpdateChildRequest;
use App\Models\Child;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChildController extends Controller
{
    /**
     * Display a paginated listing of children.
     */
    public function index(Request $request): Response
    {
        $children = Child::query()
            ->when($request->string('status')->toString() !== '', fn ($query) => $query->where('status', $request->string('status')->toString()))
            ->when($request->string('class_name')->toString() !== '', fn ($query) => $query->where('class_name', $request->string('class_name')->toString()))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Children/Index', [
            'children' => $children,
            'filters' => $request->only(['status', 'class_name']),
        ]);
    }

    /**
     * Show the form for creating a child.
     */
    public function create(): Response
    {
        return Inertia::render('Children/Create', [
            'statuses' => ['active', 'inactive'],
        ]);
    }

    /**
     * Store a newly created child.
     */
    public function store(StoreChildRequest $request): RedirectResponse
    {
        Child::create($request->validated());

        return redirect()
            ->route('children.index')
            ->with('success', __('Child created successfully.'));
    }

    /**
     * Show the form for editing a child.
     */
    public function edit(Child $child): Response
    {
        return Inertia::render('Children/Edit', [
            'child' => $child,
            'statuses' => ['active', 'inactive'],
        ]);
    }

    /**
     * Update the specified child.
     */
    public function update(UpdateChildRequest $request, Child $child): RedirectResponse
    {
        $child->update($request->validated());

        return redirect()
            ->route('children.index')
            ->with('success', __('Child updated successfully.'));
    }

    /**
     * Remove the specified child.
     */
    public function destroy(Child $child): RedirectResponse
    {
        $child->delete();

        return redirect()
            ->route('children.index')
            ->with('success', __('Child deleted successfully.'));
    }
}
