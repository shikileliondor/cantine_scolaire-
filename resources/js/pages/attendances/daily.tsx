import { Head, router, useForm } from '@inertiajs/react';
import EmptyState from '@/components/app/EmptyState';
import { fullName } from '@/components/app/formatters';
import PageHeader from '@/components/app/PageHeader';
import { useTeamUrl } from '@/components/app/routes';

type Child = {
    id: number;
    first_name?: string | null;
    last_name?: string | null;
    class_name?: string | null;
};
type ExistingAttendance = {
    child_id: number;
    is_present?: boolean;
    meal_served?: boolean;
    notes?: string | null;
};
type AttendanceRow = {
    child_id: number;
    is_present: boolean;
    meal_served: boolean;
    notes: string;
};
type FormData = { attendance_date: string; attendances: AttendanceRow[] };

interface Props {
    children?: Child[];
    attendanceDate?: string;
    attendances?: ExistingAttendance[];
}

export default function DailyAttendance({
    children = [],
    attendanceDate = new Date().toISOString().slice(0, 10),
    attendances = [],
}: Props) {
    const teamUrl = useTeamUrl();
    const existingByChild = new Map(
        attendances.map((attendance) => [attendance.child_id, attendance]),
    );
    const { data, setData, post, processing, errors } = useForm<FormData>({
        attendance_date: attendanceDate,
        attendances: children.map((child) => {
            const existing = existingByChild.get(child.id);

            return {
                child_id: child.id,
                is_present: Boolean(existing?.is_present),
                meal_served: Boolean(existing?.meal_served),
                notes: existing?.notes ?? '',
            };
        }),
    });

    const changeDate = (value: string) => {
        setData('attendance_date', value);
        router.get(
            teamUrl('attendances/daily'),
            { date: value },
            { preserveState: false, replace: true },
        );
    };

    const updateRow = (
        childId: number,
        key: keyof AttendanceRow,
        value: boolean | string,
    ) => {
        setData(
            'attendances',
            data.attendances.map((row) =>
                row.child_id === childId ? { ...row, [key]: value } : row,
            ),
        );
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(teamUrl('attendances/daily'));
    };

    return (
        <>
            <Head title="Présence du jour" />
            <PageHeader
                title="Présence du jour"
                description="Cochez clairement les enfants présents et les repas servis."
            />
            <form onSubmit={submit} className="space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <label className="block max-w-xs text-sm font-medium text-slate-700">
                        Date de présence
                        <input
                            type="date"
                            value={data.attendance_date}
                            onChange={(e) => changeDate(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                        />
                    </label>
                    {errors.attendance_date ? (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.attendance_date}
                        </p>
                    ) : null}
                </div>
                {children.length > 0 ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-sm">
                                <thead className="bg-slate-50 text-left text-xs font-bold tracking-wide text-slate-500 uppercase">
                                    <tr>
                                        <th className="px-5 py-3">
                                            Nom complet
                                        </th>
                                        <th className="px-5 py-3">Classe</th>
                                        <th className="px-5 py-3 text-center">
                                            Présent
                                        </th>
                                        <th className="px-5 py-3 text-center">
                                            Repas servi
                                        </th>
                                        <th className="px-5 py-3">
                                            Observation
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {children.map((child) => {
                                        const row = data.attendances.find(
                                            (item) =>
                                                item.child_id === child.id,
                                        );

                                        return (
                                            <tr
                                                key={child.id}
                                                className={
                                                    row?.is_present
                                                        ? 'bg-emerald-50/40'
                                                        : undefined
                                                }
                                            >
                                                <td className="px-5 py-4 font-semibold text-slate-900">
                                                    {fullName(child)}
                                                </td>
                                                <td className="px-5 py-4">
                                                    {child.class_name || '—'}
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(
                                                            row?.is_present,
                                                        )}
                                                        onChange={(e) =>
                                                            updateRow(
                                                                child.id,
                                                                'is_present',
                                                                e.target
                                                                    .checked,
                                                            )
                                                        }
                                                        className="size-5 rounded border-slate-300 text-blue-700"
                                                    />
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(
                                                            row?.meal_served,
                                                        )}
                                                        onChange={(e) =>
                                                            updateRow(
                                                                child.id,
                                                                'meal_served',
                                                                e.target
                                                                    .checked,
                                                            )
                                                        }
                                                        className="size-5 rounded border-slate-300 text-blue-700"
                                                    />
                                                </td>
                                                <td className="px-5 py-4">
                                                    <input
                                                        value={row?.notes ?? ''}
                                                        onChange={(e) =>
                                                            updateRow(
                                                                child.id,
                                                                'notes',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Observation optionnelle"
                                                        className="w-full rounded-xl border border-slate-300 px-3 py-2"
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-end border-t border-slate-200 p-4">
                            <button
                                disabled={processing}
                                className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                            >
                                {processing ? 'Enregistrement…' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <EmptyState
                        title="Aucun enfant actif"
                        description="Ajoutez des enfants actifs avant de saisir les présences."
                    />
                )}
            </form>
        </>
    );
}
