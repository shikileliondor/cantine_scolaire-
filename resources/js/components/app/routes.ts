import type { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';

export function useTeamUrl(): (path?: string) => string {
    const { currentTeam } = usePage<PageProps>().props;
    const slug =
        typeof currentTeam === 'object' && currentTeam && 'slug' in currentTeam
            ? String(currentTeam.slug)
            : '';

    return (path = ''): string => {
        const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

        return slug
            ? `/${slug}/${normalizedPath}`.replace(/\/$/, '')
            : `/${normalizedPath}`.replace(/\/$/, '') || '/';
    };
}

type ChildrenRoutes = {
    index: () => string;
    create: () => string;
    store: () => string;
    edit: (childId: number) => string;
    update: (childId: number) => string;
    destroy: (childId: number) => string;
};

export function useChildrenRoutes(): ChildrenRoutes {
    const teamUrl = useTeamUrl();

    return {
        index: (): string => teamUrl('children'),
        create: (): string => teamUrl('children/create'),
        store: (): string => teamUrl('children'),
        edit: (childId: number): string => teamUrl(`children/${childId}/edit`),
        update: (childId: number): string => teamUrl(`children/${childId}`),
        destroy: (childId: number): string => teamUrl(`children/${childId}`),
    };
}
