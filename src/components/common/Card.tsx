import type { ReactNode } from 'react';

interface CardProps {
    title: string;
    actions?: ReactNode;
    children: ReactNode;
}

export function Card({ title, actions, children }: CardProps) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">
                    {title}
                </h2>
                {actions}
            </div>
            {children}
        </section>
    );
}
