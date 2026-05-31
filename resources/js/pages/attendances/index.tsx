import { Head, Link, router } from '@inertiajs/react';
import EmptyState from '@/components/app/EmptyState';
import { formatDate, fullName } from '@/components/app/formatters';
import PageHeader from '@/components/app/PageHeader';
import Pagination from '@/components/app/Pagination';
import { useTeamUrl } from '@/components/app/routes';

type Child = {
    first_name?: string | null;
    last_name?: string | null;
    name?: string | null;
};
type Attendance = {
    id: number;
    attendance_date?: string | null;
    is_present?: boolean;
    meal_served?: boolean;
    notes?: string | null;
    child?: Child | null;
};
type PageLink = { url: string | null; label: string; active: boolean };
type Paginated<T> = { data: T[]; links?: PageLink[] };

interface Props {
    attendances?: Attendance[] | Paginated<Attendance>;
    filters?: { date?: string };
}

export default function AttendancesIndex({ attendances, filters = {} }: Props) {
    const teamUrl = useTeamUrl();
    const rows = Array.isArray(attendances)
        ? attendances
        : (attendances?.data ?? []);
    const links = !Array.isArray(attendances) ? attendances?.links : undefined;

    const filter = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        router.get(
            teamUrl('attendances'),
            { date: form.get('date') },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Historique des présences" />
            <PageHeader
                title="Historique des présences"
                description="Consultez les présences et les repas servis."
                actions={
                    <Link
                        href={teamUrl('attendances/daily')}
                        className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                    >
                        Présence du jour
                    </Link>
                }
            />
            <form onSubmit={filter} className="mb-5 flex max-w-md gap-2">
                <input
                    type="date"
                    name="date"
                    defaultValue={filters.date ?? ''}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
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
                                    <th className="px-5 py-3">Date</th>
                                    <th className="px-5 py-3">Présent</th>
                                    <th className="px-5 py-3">Repas servi</th>
                                    <th className="px-5 py-3">Observation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rows.map((attendance) => (
                                    <tr key={attendance.id}>
                                        <td className="px-5 py-4 font-semibold text-slate-900">
                                            {fullName(attendance.child)}
                                        </td>
                                        <td className="px-5 py-4">
                                            {formatDate(
                                                attendance.attendance_date,
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            {attendance.is_present
                                                ? 'Oui'
                                                : 'Non'}
                                        </td>
                                        <td className="px-5 py-4">
                                            {attendance.meal_served
                                                ? 'Oui'
                                                : 'Non'}
                                        </td>
                                        <td className="px-5 py-4 text-slate-600">
                                            {attendance.notes || '—'}
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
                    title="Aucune présence trouvée"
                    description="Les présences enregistrées apparaîtront ici."
                />
            )}
        </>
    );
}
