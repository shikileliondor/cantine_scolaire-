import { Head } from '@inertiajs/react';
import PageHeader from '@/components/app/PageHeader';
import { useTeamUrl } from '@/components/app/routes';
import PaymentForm from './form';

type Child = {
    id: number;
    first_name?: string | null;
    last_name?: string | null;
    name?: string | null;
};

export default function CreatePayment({
    children = [],
}: {
    children?: Child[];
}) {
    const teamUrl = useTeamUrl();

    return (
        <>
            <Head title="Ajouter un paiement" />
            <PageHeader
                title="Ajouter un paiement"
                description="Enregistrez un encaissement de cantine."
            />
            <PaymentForm
                children={children}
                method="post"
                action={teamUrl('payments')}
                submitLabel="Enregistrer"
            />
        </>
    );
}
