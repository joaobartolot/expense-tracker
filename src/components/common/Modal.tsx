import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    open: boolean;
    title: string;
    description?: string;
    onClose: () => void;
    children: ReactNode;
}

export function Modal({
    open,
    title,
    description,
    onClose,
    children,
}: ModalProps) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/45 p-4 backdrop-blur-sm">
            <div
                className="absolute inset-0"
                aria-hidden="true"
                onClick={onClose}
            />
            <div className="relative z-10 mx-auto flex min-h-full items-center justify-center">
                <div className="app-card w-full max-w-2xl p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                            {title}
                        </h2>
                        {description ? (
                            <p className="mt-1 text-sm text-slate-500">
                                {description}
                            </p>
                        ) : null}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl border border-app-line p-2 text-slate-500 transition hover:text-slate-900"
                        aria-label="Close modal"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                {children}
                </div>
            </div>
        </div>
    );
}
