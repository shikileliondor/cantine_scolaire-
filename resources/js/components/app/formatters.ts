export function formatCurrency(
    value: number | string | null | undefined,
): string {
    const amount = Number(value ?? 0);

    return (
        new Intl.NumberFormat('fr-FR', {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
        }).format(Number.isFinite(amount) ? amount : 0) + ' FCFA'
    );
}

export function formatDate(value: string | null | undefined): string {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
}

export function fullName(
    person:
        | {
              first_name?: string | null;
              last_name?: string | null;
              name?: string | null;
          }
        | null
        | undefined,
): string {
    if (!person) {
        return '—';
    }

    return (
        [person.first_name, person.last_name].filter(Boolean).join(' ') ||
        person.name ||
        '—'
    );
}

export function labelFromValue(value: string | null | undefined): string {
    if (!value) {
        return '—';
    }

    const labels: Record<string, string> = {
        active: 'Actif',
        inactive: 'Inactif',
        daily: 'Journalier',
        weekly: 'Hebdomadaire',
        monthly: 'Mensuel',
        custom: 'Personnalisé',
        cash: 'Espèces',
        mobile_money: 'Mobile Money',
        bank_transfer: 'Virement',
        other: 'Autre',
        male: 'Garçon',
        female: 'Fille',
    };

    return labels[value] ?? value;
}
