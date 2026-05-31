import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import EmptyState from '@/components/app/EmptyState';
import {
    formatCurrency,
    formatDate,
    fullName,
    labelFromValue,
} from '@/components/app/formatters';
import PageHeader from '@/components/app/PageHeader';
import Pagination from '@/components/app/Pagination';
import { useTeamUrl } from '@/components/app/routes';

type Child = {
    id?: number;
    first_name?: string | null;
    last_name?: string | null;
    name?: string | null;
};
type Payment = {
    id: number;
    amount?: number | string;
    payment_date?: string | null;
    payment_type?: string | null;
    payment_method?: string | null;
    reference?: string | null;
    child?: Child | null;
};
type PageLink = { url: string | null; label: string; active: boolean };
type Paginated<T> = { data: T[]; links?: PageLink[] };

interface Props {
    payments?: Payment[] | Paginated<Payment>;
    children?: Child[];
    filters?: {
        child_id?: string;
        date?: string;
        type?: string;
        mode?: string;
    };
}

export default function PaymentsIndex({
    payments,
    children = [],
    filters = {},
}: Props) {
    const teamUrl = useTeamUrl();
    const rows = Array.isArray(payments) ? payments : (payments?.data ?? []);
    const links = !Array.isArray(payments) ? payments?.links : undefined;

    const filter = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        router.get(teamUrl('payments'), Object.fromEntries(form), {
            preserveState: true,
            replace: true,
        });
    };

    const destroy = (payment: Payment) => {
        if (window.confirm('Supprimer ce paiement ?')) {
            router.delete(teamUrl(`payments/${payment.id}`));
        }
    };

    return (
        <>
            <Head title="Paiements" />
            <PageHeader
                title="Paiements"
                description="Historique et suivi des encaissements."
                actions={
                    <Link
                        href={teamUrl('payments/create')}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                    >
                        <Plus className="size-4" /> Ajouter un paiement
                    </Link>
                }
            />
            <form
                onSubmit={filter}
                className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-5"
            >
                <select
                    name="child_id"
                    defaultValue={filters.child_id ?? ''}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                >
                    <option value="">Tous les enfants</option>
                    {children.map((child) =>
                        child.id ? (
                            <option key={child.id} value={child.id}>
                                {fullName(child)}
                            </option>
                        ) : null,
                    )}
                </select>
                <input
                    type="date"
                    name="date"
                    defaultValue={filters.date ?? ''}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
                <select
                    name="type"
                    defaultValue={filters.type ?? ''}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                >
                    <option value="">Tous les types</option>
                    <option value="daily">Journalier</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="monthly">Mensuel</option>
                    <option value="custom">Personnalisé</option>
                </select>
                <select
                    name="mode"
                    defaultValue={filters.mode ?? ''}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                >
                    <option value="">Tous les modes</option>
                    <option value="cash">Espèces</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="bank_transfer">Virement</option>
                    <option value="other">Autre</option>
                </select>
                <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Filtrer
                </button>
            </form>
            {rows.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50 text-left text-xs font-bold tracking-wide text-slate-500 uppercase">
                                <tr>
                                    <th className="px-5 py-3">Enfant</th>
                                    <th className="px-5 py-3">Montant</th>
                                    <th className="px-5 py-3">Type</th>
                                    <th className="px-5 py-3">Mode</th>
                                    <th className="px-5 py-3">Date</th>
                                    <th className="px-5 py-3">Référence</th>
                                    <th className="px-5 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rows.map((payment) => (
                                    <tr key={payment.id}>
                                        <td className="px-5 py-4 font-semibold text-slate-900">
                                            {fullName(payment.child)}
                                        </td>
                                        <td className="px-5 py-4">
                                            {formatCurrency(payment.amount)}
                                        </td>
                                        <td className="px-5 py-4">
                                            {labelFromValue(
                                                payment.payment_type,
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            {labelFromValue(
                                                payment.payment_method,
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            {formatDate(payment.payment_date)}
                                        </td>
                                        <td className="px-5 py-4">
                                            {payment.reference || '—'}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Link
                                                href={teamUrl(
                                                    `payments/${payment.id}/edit`,
                                                )}
                                                className="mr-3 font-semibold text-blue-700 hover:text-blue-900"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => destroy(payment)}
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
                    title="Aucun paiement trouvé"
                    description="Enregistrez un premier paiement pour alimenter l'historique."
                />
            )}
        </>
    );
}
