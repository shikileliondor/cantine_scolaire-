import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, GraduationCap, Plus, Search, UserX } from 'lucide-react';
import type { FormEvent } from 'react';
import EmptyState from '@/components/app/EmptyState';
import { fullName, labelFromValue } from '@/components/app/formatters';
import PageHeader from '@/components/app/PageHeader';
import Pagination from '@/components/app/Pagination';
import { useTeamUrl } from '@/components/app/routes';

type Child = {
    id: number;
    first_name?: string | null;
    last_name?: string | null;
    matricule?: string | null;
    class_name?: string | null;
    parent_phone?: string | null;
    status?: string | null;
};

type PageLink = { url: string | null; label: string; active: boolean };
type Paginated<T> = { data: T[]; links?: PageLink[] };

interface ChildrenIndexProps {
    children?: Child[] | Paginated<Child>;
    filters?: { search?: string };
}

function rowsFrom(children: ChildrenIndexProps['children']): Child[] {
    return Array.isArray(children) ? children : (children?.data ?? []);
}

export default function ChildrenIndex({
    children,
    filters = {},
}: ChildrenIndexProps) {
    const teamUrl = useTeamUrl();
    const rows = rowsFrom(children);
    const links = !Array.isArray(children) ? children?.links : undefined;

    const stats = {
        total: rows.length,
        active: rows.filter((child) => child.status === 'active').length,
        inactive: rows.filter((child) => child.status === 'inactive').length,
        classes: new Set(
            rows
                .map((child) => child.class_name)
                .filter((className): className is string => Boolean(className)),
        ).size,
    };

    const search = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        router.get(
            teamUrl('children'),
            { search: form.get('search') },
            { preserveState: true, replace: true },
        );
    };

    const destroy = (child: Child) => {
        if (window.confirm(`Supprimer ${fullName(child)} ?`)) {
            router.delete(teamUrl(`children/${child.id}`));
        }
    };

    return (
        <>
            <Head title="Enfants" />
            <PageHeader
                title="Enfants"
                description="Liste des enfants inscrits à la cantine."
                actions={
                    <Link
                        href={teamUrl('children/create')}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                    >
                        <Plus className="size-4" /> Ajouter un enfant
                    </Link>
                }
            />

            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Enfants affichés
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-950">
                        {stats.total}
                    </p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-emerald-700">
                            Actifs
                        </p>
                        <CheckCircle2 className="size-5 text-emerald-600" />
                    </div>
                    <p className="mt-2 text-3xl font-bold text-emerald-900">
                        {stats.active}
                    </p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-amber-700">
                            Inactifs
                        </p>
                        <UserX className="size-5 text-amber-600" />
                    </div>
                    <p className="mt-2 text-3xl font-bold text-amber-900">
                        {stats.inactive}
                    </p>
                </div>
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-700">
                            Classes
                        </p>
                        <GraduationCap className="size-5 text-blue-600" />
                    </div>
                    <p className="mt-2 text-3xl font-bold text-blue-900">
                        {stats.classes}
                    </p>
                </div>
            </div>

            <form
                onSubmit={search}
                className="mb-5 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:max-w-2xl sm:flex-row"
            >
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                        name="search"
                        defaultValue={filters.search ?? ''}
                        placeholder="Rechercher par nom, matricule ou classe…"
                        className="w-full rounded-xl border border-slate-300 py-2 pr-3 pl-9 text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                        Rechercher
                    </button>
                    {filters.search ? (
                        <Link
                            href={teamUrl('children')}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50"
                        >
                            Réinitialiser
                        </Link>
                    ) : null}
                </div>
            </form>

            {rows.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50 text-left text-xs font-bold tracking-wide text-slate-500 uppercase">
                                <tr>
                                    <th className="px-5 py-3">Nom complet</th>
                                    <th className="px-5 py-3">Matricule</th>
                                    <th className="px-5 py-3">Classe</th>
                                    <th className="px-5 py-3">
                                        Contact parent
                                    </th>
                                    <th className="px-5 py-3">Statut</th>
                                    <th className="px-5 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rows.map((child) => (
                                    <tr key={child.id}>
                                        <td className="px-5 py-4 font-semibold text-slate-900">
                                            {fullName(child)}
                                        </td>
                                        <td className="px-5 py-4">
                                            {child.matricule || '—'}
                                        </td>
                                        <td className="px-5 py-4">
                                            {child.class_name || '—'}
                                        </td>
                                        <td className="px-5 py-4">
                                            {child.parent_phone || '—'}
                                        </td>
                                        <td className="px-5 py-4">
                                            {labelFromValue(child.status)}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Link
                                                href={teamUrl(
                                                    `children/${child.id}/edit`,
                                                )}
                                                className="mr-3 font-semibold text-blue-700 hover:text-blue-900"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => destroy(child)}
                                                className="font-semibold text-red-600 hover:text-red-800"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-5 pb-5">
                        <Pagination links={links} />
                    </div>
                </div>
            ) : (
                <EmptyState
                    title="Aucun enfant trouvé"
                    description="Ajoutez le premier enfant pour démarrer la gestion de la cantine."
                    actions={
                        <Link
                            href={teamUrl('children/create')}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                        >
                            <Plus className="size-4" /> Créer une fiche enfant
                        </Link>
                    }
                />
            )}
        </>
    );
}
