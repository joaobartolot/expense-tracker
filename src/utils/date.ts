export function todayISO() {
    return formatISODate(new Date());
}

function dayKey(date: Date) {
    return formatISODate(date);
}

function pad(value: number) {
    return String(value).padStart(2, '0');
}

export function formatISODate(date: Date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseISODate(input: string) {
    const [year, month, day] = input.split('-').map(Number);

    return new Date(year, month - 1, day);
}

function getCycleAnchor(year: number, monthIndex: number, cycleStartDay: number) {
    const lastDayOfMonth = new Date(year, monthIndex + 1, 0).getDate();

    return new Date(year, monthIndex, Math.min(cycleStartDay, lastDayOfMonth));
}

function shiftMonth(date: Date, monthDelta: number, cycleStartDay: number) {
    return getCycleAnchor(
        date.getFullYear(),
        date.getMonth() + monthDelta,
        cycleStartDay,
    );
}

function formatBudgetCycleLabel(start: Date, endInclusive: Date) {
    const startLabel = start.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
    });
    const endLabel = endInclusive.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
    });

    return `${startLabel} - ${endLabel}`;
}

export function getBudgetCycleBounds(
    referenceDate: Date,
    cycleStartDay: number,
) {
    const reference = new Date(
        referenceDate.getFullYear(),
        referenceDate.getMonth(),
        referenceDate.getDate(),
    );
    let startDate = getCycleAnchor(
        reference.getFullYear(),
        reference.getMonth(),
        cycleStartDay,
    );

    if (reference < startDate) {
        startDate = shiftMonth(startDate, -1, cycleStartDay);
    }

    const endExclusiveDate = shiftMonth(startDate, 1, cycleStartDay);
    const endInclusiveDate = new Date(endExclusiveDate);

    endInclusiveDate.setDate(endInclusiveDate.getDate() - 1);

    return {
        start: formatISODate(startDate),
        endExclusive: formatISODate(endExclusiveDate),
        startDate,
        endExclusiveDate,
        endInclusiveDate,
        label: formatBudgetCycleLabel(startDate, endInclusiveDate),
    };
}

export function formatDateLabel(input: string) {
    const date = parseISODate(input);
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
    const nextDate = parseISODate(date);

    if (interval === 'weekly') {
        nextDate.setDate(nextDate.getDate() + 7);
    } else {
        nextDate.setMonth(nextDate.getMonth() + 1);
    }

    return formatISODate(nextDate);
}
