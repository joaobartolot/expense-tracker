import type { ReactNode } from 'react';

interface AppHeaderProps {
    eyebrow: string;
    title: string;
    description: string;
    meta?: ReactNode;
}

export function AppHeader({
    eyebrow,
    title,
    description,
    meta,
}: AppHeaderProps) {
    return (
        <header className="app-card overflow-hidden bg-slate-950 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-100">
                        {eyebrow}
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                        {title}
                    </h1>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                        {description}
                    </p>
                </div>
                {meta ? <div className="flex flex-wrap gap-3">{meta}</div> : null}
            </div>
        </header>
    );
}
