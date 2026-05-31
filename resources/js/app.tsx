import { createInertiaApp } from '@inertiajs/react';
import type { ComponentType } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import CanteenLayout from '@/layouts/canteen-layout';
import SettingsLayout from '@/layouts/settings/layout';

type PageModule = { default: ComponentType };

const pages = import.meta.glob<PageModule>('./pages/**/*.tsx');

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    resolve: async (name) => {
        const page = pages[`./pages/${name}.tsx`];

        if (!page) {
            throw new Error(`Page not found: ${name}`);
        }

        const module = await page();

        return module.default;
    },
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
            case name.startsWith('teams/'):
                return [AppLayout, SettingsLayout];
            case name === 'dashboard':
            case name.startsWith('children/'):
            case name.startsWith('payments/'):
            case name.startsWith('attendances/'):
                return CanteenLayout;
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
