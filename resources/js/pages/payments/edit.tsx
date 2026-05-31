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
type Payment = {
    id: number;
    child_id?: number | string;
    amount?: number | string;
    payment_date?: string;
    payment_type?: string;
    payment_method?: string;
    period_label?: string;
    reference?: string;
    notes?: string;
};

export default function EditPayment({
    payment,
    children = [],
}: {
    payment: Payment;
    children?: Child[];
}) {
    const teamUrl = useTeamUrl();

    return (
        <>
            <Head title="Modifier un paiement" />
            <PageHeader
                title="Modifier un paiement"
                description="Mettez à jour les informations du paiement."
            />
            <PaymentForm
                children={children}
                payment={payment}
                method="put"
                action={teamUrl(`payments/${payment.id}`)}
                submitLabel="Enregistrer"
            />
        </>
    );
}
