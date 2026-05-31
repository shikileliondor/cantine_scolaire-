import { CalendarDays } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import FlashMessage from '@/components/app/FlashMessage';
import Sidebar from '@/components/app/Sidebar';

export default function CanteenLayout({ children }: PropsWithChildren) {
    const today = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date());

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Sidebar />
            <div className="lg:pl-72">
                <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
                    <div className="flex h-16 items-center justify-between px-6 lg:px-8">
                        <div className="pl-12 lg:pl-0">
                            <p className="text-sm font-semibold text-slate-500">
                                Administration
                            </p>
                        </div>
                        <div className="hidden items-center gap-2 text-sm font-medium text-slate-700 sm:flex">
                            <CalendarDays className="size-4 text-slate-500" />
                            <span className="capitalize">{today}</span>
                        </div>
                    </div>
                </header>
                <main className="p-5 lg:p-8">
                    <FlashMessage />
                    {children}
                </main>
            </div>
        </div>
    );
}
