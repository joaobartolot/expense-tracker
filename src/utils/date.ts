export function todayISO() {
    return new Date().toISOString().slice(0, 10);
}

function dayKey(date: Date) {
    return date.toISOString().slice(0, 10);
}

export function formatDateLabel(input: string) {
    const date = new Date(`${input}T00:00:00`);
    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    if (dayKey(date) === dayKey(today)) {
        return 'Today';
    }

    if (dayKey(date) === dayKey(yesterday)) {
        return 'Yesterday';
    }

    return date.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    });
}

export function shiftDate(date: string, interval: 'monthly' | 'weekly') {
    const nextDate = new Date(`${date}T00:00:00`);

    if (interval === 'weekly') {
        nextDate.setDate(nextDate.getDate() + 7);
    } else {
        nextDate.setMonth(nextDate.getMonth() + 1);
    }

    return nextDate.toISOString().slice(0, 10);
}
