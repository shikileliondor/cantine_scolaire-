import { Head } from '@inertiajs/react';
import PageHeader from '@/components/app/PageHeader';
import { useTeamUrl } from '@/components/app/routes';
import ChildForm from './form';

type Child = {
    id: number;
    first_name?: string;
    last_name?: string;
    matricule?: string;
    gender?: string;
    birth_date?: string;
    class_name?: string;
    parent_name?: string;
    parent_phone?: string;
    status?: string;
    notes?: string;
};

export default function EditChild({ child }: { child: Child }) {
    const teamUrl = useTeamUrl();

    return (
        <>
            <Head title="Modifier un enfant" />
            <PageHeader
                title="Modifier un enfant"
                description="Mettez à jour les informations de l'enfant."
            />
            <ChildForm
                method="put"
                action={teamUrl(`children/${child.id}`)}
                child={child}
                submitLabel="Enregistrer"
            />
        </>
    );
}
