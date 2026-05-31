import { usePage } from '@inertiajs/react';

type FlashProps = {
    flash?: {
        success?: string;
        error?: string;
        toast?: { message?: string; type?: string };
    };
};

export default function FlashMessage() {
    const { flash } = usePage<FlashProps>().props;
    const message = flash?.success ?? flash?.error ?? flash?.toast?.message;

    if (!message) {
        return null;
    }

    const isError = Boolean(flash?.error || flash?.toast?.type === 'error');

    return (
        <div
            className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
                isError
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
        >
            {message}
        </div>
    );
}
