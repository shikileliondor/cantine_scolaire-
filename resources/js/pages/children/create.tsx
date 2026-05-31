import { Head } from '@inertiajs/react';
import PageHeader from '@/components/app/PageHeader';
import { useTeamUrl } from '@/components/app/routes';
import ChildForm from './form';

export default function CreateChild() {
    const teamUrl = useTeamUrl();

    return (
        <>
            <Head title="Ajouter un enfant" />
            <PageHeader
                title="Ajouter un enfant"
                description="Enregistrez un enfant inscrit à la cantine."
            />
            <ChildForm
                method="post"
                action={teamUrl('children')}
                submitLabel="Enregistrer"
            />
        </>
    );
}
