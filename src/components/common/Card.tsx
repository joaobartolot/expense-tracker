import type { ReactNode } from 'react';

interface CardProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    children: ReactNode;
}

export function Card({ title, subtitle, actions, children }: CardProps) {
    return (
        <section className="app-card p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <h2 className="app-section-title">{title}</h2>
                    {subtitle ? (
                        <p className="mt-1 app-section-copy">{subtitle}</p>
                    ) : null}
                </div>
                {actions}
            </div>
            {children}
        </section>
    );
}
