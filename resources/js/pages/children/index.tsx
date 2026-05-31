import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
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

    const search = (event: React.FormEvent<HTMLFormElement>) => {
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

            <form onSubmit={search} className="mb-5 flex max-w-md gap-2">
                <input
                    name="search"
                    defaultValue={filters.search ?? ''}
                    placeholder="Rechercher un enfant…"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
                <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Rechercher
                </button>
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
                />
            )}
        </>
    );
}
