import { Head } from '@inertiajs/react';
import PageHeader from '@/components/app/PageHeader';
import { useChildrenRoutes } from '@/components/app/routes';
import ChildForm from './form';

export default function CreateChild() {
    const childrenRoutes = useChildrenRoutes();

    return (
        <>
            <Head title="Ajouter un enfant" />
            <PageHeader
                title="Ajouter un enfant"
                description="Enregistrez un enfant inscrit à la cantine."
            />
            <ChildForm
                method="post"
                action={childrenRoutes.store()}
                submitLabel="Enregistrer"
            />
        </>
    );
}
