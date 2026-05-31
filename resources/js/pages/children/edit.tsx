import { Head } from '@inertiajs/react';
import PageHeader from '@/components/app/PageHeader';
import { useChildrenRoutes } from '@/components/app/routes';
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
    const childrenRoutes = useChildrenRoutes();

    return (
        <>
            <Head title="Modifier un enfant" />
            <PageHeader
                title="Modifier un enfant"
                description="Mettez à jour les informations de l'enfant."
            />
            <ChildForm
                method="put"
                action={childrenRoutes.update(child.id)}
                child={child}
                submitLabel="Enregistrer"
            />
        </>
    );
}
