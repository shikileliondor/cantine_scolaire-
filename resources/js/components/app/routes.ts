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
