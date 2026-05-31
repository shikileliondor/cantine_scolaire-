import type { PageProps } from '@inertiajs/core';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Banknote,
    CalendarCheck,
    Home,
    LogOut,
    Menu,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { useTeamUrl } from './routes';

const navigation = [
    { label: 'Tableau de bord', href: 'dashboard', icon: Home },
    { label: 'Enfants', href: 'children', icon: Users },
    { label: 'Paiements', href: 'payments', icon: Banknote },
    { label: 'Présences', href: 'attendances/daily', icon: CalendarCheck },
];

export default function Sidebar() {
    const teamUrl = useTeamUrl();
    const [open, setOpen] = useState(false);
    const page = usePage<PageProps>();
    const { auth } = page.props;
    const user = auth.user;

    const logout = () => router.post('/logout');

    const sidebar = (
        <aside className="flex h-full w-72 flex-col bg-slate-950 text-white shadow-2xl shadow-slate-950/20">
            <div className="flex h-20 items-center gap-3 px-6">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold ring-1 ring-white/15">
                    CS
                </div>
                <div>
                    <p className="text-lg font-bold">Cantine Scolaire</p>
                    <p className="text-xs text-slate-400">
                        Gestion quotidienne
                    </p>
                </div>
            </div>

            <nav className="flex-1 space-y-2 px-4 py-4">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const href = teamUrl(item.href);
                    const active =
                        page.url === href || page.url.startsWith(`${href}/`);

                    return (
                        <Link
                            key={item.href}
                            href={href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                active
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/25'
                                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <Icon className="size-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-white/10 p-4">
                <div className="mb-3 rounded-xl bg-white/5 p-3">
                    <p className="text-sm font-semibold">
                        {user?.name ?? 'Utilisateur'}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                        {user?.email ?? 'Administrateur'}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                    <LogOut className="size-4" />
                    Déconnexion
                </button>
            </div>
        </aside>
    );

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="fixed top-4 left-4 z-40 rounded-xl bg-slate-950 p-2 text-white shadow-lg lg:hidden"
                aria-label="Ouvrir le menu"
            >
                <Menu className="size-5" />
            </button>
            <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
                {sidebar}
            </div>
            {open ? (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-950/60"
                        onClick={() => setOpen(false)}
                        aria-label="Fermer le menu"
                    />
                    <div className="relative h-full w-72">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 z-10 rounded-lg bg-white/10 p-2 text-white"
                            aria-label="Fermer"
                        >
                            <X className="size-4" />
                        </button>
                        {sidebar}
                    </div>
                </div>
            ) : null}
        </>
    );
}
