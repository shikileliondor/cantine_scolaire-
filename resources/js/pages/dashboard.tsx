import { Head, Link } from '@inertiajs/react';
import {
    Banknote,
    CalendarCheck,
    CheckCircle2,
    Utensils,
    Users,
} from 'lucide-react';
import EmptyState from '@/components/app/EmptyState';
import {
    formatCurrency,
    formatDate,
    fullName,
    labelFromValue,
} from '@/components/app/formatters';
import PageHeader from '@/components/app/PageHeader';
import { useTeamUrl } from '@/components/app/routes';
import StatCard from '@/components/app/StatCard';

type Child = {
    first_name?: string | null;
    last_name?: string | null;
    class_name?: string | null;
};

type Payment = {
    id: number;
    amount: string | number;
    payment_type?: string | null;
    payment_method?: string | null;
    payment_date?: string | null;
    child?: Child | null;
};

type Attendance = {
    id: number;
    attendance_date?: string | null;
    is_present?: boolean;
    meal_served?: boolean;
    notes?: string | null;
    child?: Child | null;
};

type DashboardStats = {
    total_children?: number;
    active_children?: number;
    present_today?: number;
    meals_served_today?: number;
    revenue_today?: number | string;
    revenue_month?: number | string;
};

interface DashboardProps {
    stats?: DashboardStats;
    latestPayments?: Payment[];
    latestAttendances?: Attendance[];
}

export default function Dashboard({
    stats = {},
    latestPayments = [],
    latestAttendances = [],
}: DashboardProps) {
    const teamUrl = useTeamUrl();

    return (
        <>
            <Head title="Tableau de bord" />
            <PageHeader
                title="Tableau de bord"
                description="Bienvenue dans le système de gestion de la cantine scolaire."
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total enfants"
                    value={stats.total_children ?? 0}
                    description="Tous les enfants inscrits"
                    icon={Users}
                    tone="blue"
                />
                <StatCard
                    title="Enfants actifs"
                    value={stats.active_children ?? 0}
                    description="Enfants avec statut actif"
                    icon={CheckCircle2}
                    tone="green"
                />
                <StatCard
                    title="Présents aujourd'hui"
                    value={stats.present_today ?? 0}
                    description="Enfants présents"
                    icon={CalendarCheck}
                    tone="purple"
                />
                <StatCard
                    title="Repas servis aujourd'hui"
                    value={stats.meals_served_today ?? 0}
                    description="Repas effectivement servis"
                    icon={Utensils}
                    tone="orange"
                />
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <StatCard
                    title="Encaissement aujourd'hui"
                    value={formatCurrency(stats.revenue_today)}
                    description="Total des paiements du jour"
                    icon={Banknote}
                    tone="blue"
                />
                <StatCard
                    title="Encaissement du mois"
                    value={formatCurrency(stats.revenue_month)}
                    description="Total des paiements du mois"
                    icon={Banknote}
                    tone="green"
                />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-950">
                            Derniers paiements
                        </h2>
                        <Link
                            href={teamUrl('payments')}
                            className="text-sm font-semibold text-blue-700 hover:text-blue-800"
                        >
                            Voir tout
                        </Link>
                    </div>
                    {latestPayments.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-sm">
                                <thead className="bg-slate-50 text-left text-xs font-bold tracking-wide text-slate-500 uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Enfant</th>
                                        <th className="px-4 py-3">Montant</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Mode</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {latestPayments.map((payment) => (
                                        <tr key={payment.id}>
                                            <td className="px-4 py-3 font-medium text-slate-900">
                                                {fullName(payment.child)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {formatCurrency(payment.amount)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {labelFromValue(
                                                    payment.payment_type,
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {formatDate(
                                                    payment.payment_date,
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {labelFromValue(
                                                    payment.payment_method,
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <EmptyState
                            title="Aucun paiement récent"
                            description="Les derniers paiements apparaîtront ici."
                        />
                    )}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-950">
                            Dernières présences
                        </h2>
                        <Link
                            href={teamUrl('attendances')}
                            className="text-sm font-semibold text-blue-700 hover:text-blue-800"
                        >
                            Voir tout
                        </Link>
                    </div>
                    {latestAttendances.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-sm">
                                <thead className="bg-slate-50 text-left text-xs font-bold tracking-wide text-slate-500 uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Enfant</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Présent</th>
                                        <th className="px-4 py-3">
                                            Repas servi
                                        </th>
                                        <th className="px-4 py-3">
                                            Observation
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {latestAttendances.map((attendance) => (
                                        <tr key={attendance.id}>
                                            <td className="px-4 py-3 font-medium text-slate-900">
                                                {fullName(attendance.child)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {formatDate(
                                                    attendance.attendance_date,
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {attendance.is_present
                                                    ? 'Oui'
                                                    : 'Non'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {attendance.meal_served
                                                    ? 'Oui'
                                                    : 'Non'}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">
                                                {attendance.notes || '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <EmptyState
                            title="Aucune présence récente"
                            description="Les dernières présences enregistrées apparaîtront ici."
                        />
                    )}
                </section>
            </div>
        </>
    );
}
