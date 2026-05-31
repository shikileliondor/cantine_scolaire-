import type { ReactNode } from 'react';

interface EmptyStateProps {
    title: string;
    description?: string;
    actions?: ReactNode;
}

export default function EmptyState({
    title,
    description,
    actions,
}: EmptyStateProps) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <p className="text-base font-semibold text-slate-800">{title}</p>
            {description ? (
                <p className="mt-2 text-sm text-slate-500">{description}</p>
            ) : null}
            {actions ? (
                <div className="mt-5 flex justify-center">{actions}</div>
            ) : null}
        </div>
    );
}
