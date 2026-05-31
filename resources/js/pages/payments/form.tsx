import { Link, useForm } from '@inertiajs/react';
import { formatCurrency, fullName } from '@/components/app/formatters';
import { useTeamUrl } from '@/components/app/routes';

type Child = {
    id: number;
    first_name?: string | null;
    last_name?: string | null;
    name?: string | null;
};
type PaymentFormData = {
    child_id: string | number;
    amount: string | number;
    payment_date: string;
    payment_type: string;
    payment_method: string;
    period_label: string;
    reference: string;
    notes: string;
};

interface PaymentFormProps {
    children?: Child[];
    payment?: Partial<PaymentFormData> & {
        id?: number;
        amount?: string | number;
        child_id?: string | number;
    };
    action: string;
    method: 'post' | 'put';
    submitLabel: string;
}

function FieldError({ message }: { message?: string }) {
    return message ? (
        <p className="mt-1 text-sm text-red-600">{message}</p>
    ) : null;
}

export default function PaymentForm({
    children = [],
    payment = {},
    action,
    method,
    submitLabel,
}: PaymentFormProps) {
    const teamUrl = useTeamUrl();
    const { data, setData, post, put, processing, errors } =
        useForm<PaymentFormData>({
            child_id: payment.child_id ? String(payment.child_id) : '',
            amount: payment.amount ? String(payment.amount) : '',
            payment_date:
                payment.payment_date ?? new Date().toISOString().slice(0, 10),
            payment_type: payment.payment_type ?? 'daily',
            payment_method: payment.payment_method ?? 'cash',
            period_label: payment.period_label ?? '',
            reference: payment.reference ?? '',
            notes: payment.notes ?? '',
        });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (method === 'post') {
            post(action);
        } else {
            put(action);
        }
    };

    return (
        <form
            onSubmit={submit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <div className="grid gap-5 md:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                    Enfant
                    <select
                        value={data.child_id}
                        onChange={(e) => setData('child_id', e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                    >
                        <option value="">Sélectionner un enfant</option>
                        {children.map((child) => (
                            <option key={child.id} value={child.id}>
                                {fullName(child)}
                            </option>
                        ))}
                    </select>
                    <FieldError message={errors.child_id} />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    Montant
                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={data.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        placeholder={formatCurrency(0)}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    <FieldError message={errors.amount} />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    Date
                    <input
                        type="date"
                        value={data.payment_date}
                        onChange={(e) =>
                            setData('payment_date', e.target.value)
                        }
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    <FieldError message={errors.payment_date} />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    Type
                    <select
                        value={data.payment_type}
                        onChange={(e) =>
                            setData('payment_type', e.target.value)
                        }
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                    >
                        <option value="daily">Journalier</option>
                        <option value="weekly">Hebdomadaire</option>
                        <option value="monthly">Mensuel</option>
                        <option value="custom">Personnalisé</option>
                    </select>
                    <FieldError message={errors.payment_type} />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    Mode
                    <select
                        value={data.payment_method}
                        onChange={(e) =>
                            setData('payment_method', e.target.value)
                        }
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                    >
                        <option value="cash">Espèces</option>
                        <option value="mobile_money">Mobile Money</option>
                        <option value="bank_transfer">Virement</option>
                        <option value="other">Autre</option>
                    </select>
                    <FieldError message={errors.payment_method} />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    Période
                    <input
                        value={data.period_label}
                        onChange={(e) =>
                            setData('period_label', e.target.value)
                        }
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    <FieldError message={errors.period_label} />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    Référence
                    <input
                        value={data.reference}
                        onChange={(e) => setData('reference', e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    <FieldError message={errors.reference} />
                </label>
                <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                    Notes
                    <textarea
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        rows={4}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    <FieldError message={errors.notes} />
                </label>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
                <Link
                    href={teamUrl('payments')}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    Retour
                </Link>
                <button
                    disabled={processing}
                    className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                >
                    {processing ? 'Enregistrement…' : submitLabel}
                </button>
            </div>
        </form>
    );
}
