import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    tone?: 'blue' | 'green' | 'purple' | 'orange';
}

const tones: Record<NonNullable<StatCardProps['tone']>, string> = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    purple: 'bg-violet-50 text-violet-700 ring-violet-100',
    orange: 'bg-orange-50 text-orange-700 ring-orange-100',
};

export default function StatCard({
    title,
    value,
    description,
    icon: Icon,
    tone = 'blue',
}: StatCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
                <div
                    className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ring-1 ${tones[tone]}`}
                >
                    <Icon className="size-7" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-600">
                        {title}
                    </p>
                    <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                        {value}
                    </p>
                    {description ? (
                        <p className="mt-1 text-sm text-slate-500">
                            {description}
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
