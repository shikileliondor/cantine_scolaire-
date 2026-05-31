import { Link, useForm } from '@inertiajs/react';
import { useTeamUrl } from '@/components/app/routes';

type ChildFormData = {
    first_name: string;
    last_name: string;
    matricule: string;
    gender: string;
    birth_date: string;
    class_name: string;
    parent_name: string;
    parent_phone: string;
    status: string;
    notes: string;
};

interface ChildFormProps {
    child?: Partial<ChildFormData> & { id?: number };
    submitLabel: string;
    method: 'post' | 'put';
    action: string;
}

function FieldError({ message }: { message?: string }) {
    return message ? (
        <p className="mt-1 text-sm text-red-600">{message}</p>
    ) : null;
}

export default function ChildForm({
    child = {},
    submitLabel,
    method,
    action,
}: ChildFormProps) {
    const teamUrl = useTeamUrl();
    const { data, setData, post, put, processing, errors } =
        useForm<ChildFormData>({
            first_name: child.first_name ?? '',
            last_name: child.last_name ?? '',
            matricule: child.matricule ?? '',
            gender: child.gender ?? '',
            birth_date: child.birth_date ?? '',
            class_name: child.class_name ?? '',
            parent_name: child.parent_name ?? '',
            parent_phone: child.parent_phone ?? '',
            status: child.status ?? 'active',
            notes: child.notes ?? '',
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
                    Prénom
                    <input
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    <FieldError message={errors.first_name} />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    Nom
                    <input
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    <FieldError message={errors.last_name} />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    Matricule
                    <input
                        value={data.matricule}
                        onChange={(e) => setData('matricule', e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    <FieldError message={errors.matricule} />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    Genre
                    <select
                        value={data.gender}
                        onChange={(e) => setData('gender', e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                    >
                        <option value="">Non renseigné</option>
                        <option value="male">Garçon</option>
                        <option value="female">Fille</option>
                    </select>
                    <FieldError message={errors.gender} />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    Date de naissance
                    <input
                        type="date"
                        value={data.birth_date}
                        onChange={(e) => setData('birth_date', e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    <FieldError message={errors.birth_date} />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    Classe
                    <input
                        value={data.class_name}
                        onChange={(e) => setData('class_name', e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    <FieldError message={errors.class_name} />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    Nom du parent
                    <input
                        value={data.parent_name}
                        onChange={(e) => setData('parent_name', e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    <FieldError message={errors.parent_name} />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    Contact parent
                    <input
                        value={data.parent_phone}
                        onChange={(e) =>
                            setData('parent_phone', e.target.value)
                        }
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    <FieldError message={errors.parent_phone} />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    Statut
                    <select
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                    >
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                    </select>
                    <FieldError message={errors.status} />
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
                    href={teamUrl('children')}
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
