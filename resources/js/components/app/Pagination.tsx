import { Link } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links?: PaginationLink[];
}

export default function Pagination({ links = [] }: PaginationProps) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav className="mt-5 flex flex-wrap items-center justify-end gap-2">
            {links.map((link, index) => {
                const label = link.label
                    .replace('&laquo;', '‹')
                    .replace('&raquo;', '›');

                return link.url ? (
                    <Link
                        key={`${label}-${index}`}
                        href={link.url}
                        className={`rounded-lg border px-3 py-2 text-sm transition ${
                            link.active
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: label }}
                    />
                ) : (
                    <span
                        key={`${label}-${index}`}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400"
                        dangerouslySetInnerHTML={{ __html: label }}
                    />
                );
            })}
        </nav>
    );
}
