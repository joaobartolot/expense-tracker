import { useEffect, useMemo, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
    ArrowUpDown,
    Flag,
    LayoutDashboard,
    Repeat,
    Settings,
    Tags,
} from 'lucide-react';
import { financeActions } from '../state/actions';
import { todayISO } from '../utils/date';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { useFinanceState } from '../hooks/useFinanceState';
import { useDashboardData } from '../hooks/useDashboardData';
import { formatMoney } from '../utils/currency';
import type {
    Category,
    Goal,
    RecurringRule,
    Transaction,
} from '../types/finance';
import { HomePage } from './pages/HomePage';
import { TransactionsPage } from './pages/TransactionsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { RecurringPage } from './pages/RecurringPage';
import { GoalsPage } from './pages/GoalsPage';
import { SettingsPage } from './pages/SettingsPage';

type ViewId =
    | 'home'
    | 'transactions'
    | 'categories'
    | 'recurring'
    | 'goals'
    | 'settings';

interface ViewDefinition {
    id: ViewId;
    label: string;
    Icon: LucideIcon;
}

type SwipeIntent = 'undecided' | 'horizontal' | 'vertical';

const views: ViewDefinition[] = [
    { id: 'home', label: 'Home', Icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', Icon: ArrowUpDown },
    { id: 'categories', label: 'Categories', Icon: Tags },
    { id: 'recurring', label: 'Recurring', Icon: Repeat },
    { id: 'goals', label: 'Goals', Icon: Flag },
    { id: 'settings', label: 'Settings', Icon: Settings },
];

export function DashboardPage() {
    const { rates, status: exchangeRateStatus } = useExchangeRates();
    const { state, dispatch } = useFinanceState();
    const [activeView, setActiveView] = useState<ViewId>('home');
    const [isDesktop, setIsDesktop] = useState(() =>
        typeof window !== 'undefined'
            ? window.matchMedia('(min-width: 1024px)').matches
            : false,
    );
    const [isDragging, setIsDragging] = useState(false);
    const [isSnapAnimating, setIsSnapAnimating] = useState(false);
    const pagerRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const indicatorRef = useRef<HTMLSpanElement | null>(null);
    const containerWidthRef = useRef(0);
    const activeIndexRef = useRef(0);
    const snapTimeoutRef = useRef<number | null>(null);
    const gestureRef = useRef({
        pointerId: null as number | null,
        startX: 0,
        startY: 0,
        lastX: 0,
        previousX: 0,
        lastMoveAt: 0,
        previousMoveAt: 0,
        offset: 0,
        intent: 'undecided' as SwipeIntent,
        isTracking: false,
    });

    const {
        defaultCurrency,
        budgetCycleStartDay,
        normalizedTransactions,
        currentBudgetCycleLabel,
        currentCycleSpent,
        currentCycleEarned,
        spendingByCategory,
        recentTransactionGroups,
        netWorthTrend,
    } = useDashboardData(state, rates);

    const totalBalance = useMemo(
        () =>
            normalizedTransactions.reduce(
                (sum, transaction) =>
                    sum +
                    (transaction.type === 'income'
                        ? transaction.converted
                        : -transaction.converted),
                0,
            ),
        [normalizedTransactions],
    );
    const activeIndex = views.findIndex((view) => view.id === activeView);

    function addTransaction(transaction: Omit<Transaction, 'id'>) {
        dispatch({
            type: financeActions.addTransaction,
            payload: { id: crypto.randomUUID(), ...transaction },
        });
    }

    function updateTransaction(transaction: Transaction) {
        dispatch({
            type: financeActions.updateTransaction,
            payload: transaction,
        });
    }

    function deleteTransaction(transactionId: string) {
        dispatch({
            type: financeActions.deleteTransaction,
            payload: transactionId,
        });
    }

    function addAccount(accountName: string) {
        dispatch({
            type: financeActions.addAccount,
            payload: {
                id: crypto.randomUUID(),
                name: accountName,
                type: 'bank',
            },
        });
    }

    function addCategory(category: Omit<Category, 'id'>) {
        dispatch({
            type: financeActions.addCategory,
            payload: { id: crypto.randomUUID(), ...category },
        });
    }

    function updateCategory(category: Category) {
        dispatch({
            type: financeActions.updateCategory,
            payload: category,
        });
    }

    function deleteCategory(categoryId: string) {
        dispatch({
            type: financeActions.deleteCategory,
            payload: categoryId,
        });
    }

    function addGoal(goal: Omit<Goal, 'id'>) {
        dispatch({
            type: financeActions.addGoal,
            payload: { id: crypto.randomUUID(), ...goal },
        });
    }

    function contributeToGoal(goalId: string, amount: number) {
        const expenseCategoryId =
            state.categories.find((category) => category.type === 'expense')
                ?.id ?? state.categories[0]?.id;
        const accountId = state.accounts[0]?.id;

        if (!expenseCategoryId || !accountId) {
            return;
        }

        dispatch({
            type: financeActions.contributeGoal,
            payload: {
                goalId,
                amount,
                transaction: {
                    id: crypto.randomUUID(),
                    description: 'Goal contribution',
                    amount,
                    currency: defaultCurrency,
                    type: 'expense',
                    date: todayISO(),
                    categoryId: expenseCategoryId,
                    accountId,
                },
            },
        });
    }

    function addRecurringRule(rule: Omit<RecurringRule, 'id'>) {
        dispatch({
            type: financeActions.addRecurringRule,
            payload: { id: crypto.randomUUID(), ...rule },
        });
    }

    function updateRecurringRule(rule: RecurringRule) {
        dispatch({
            type: financeActions.updateRecurringRule,
            payload: rule,
        });
    }

    function deleteRecurringRule(ruleId: string) {
        dispatch({
            type: financeActions.deleteRecurringRule,
            payload: ruleId,
        });
    }

    function setBudgetCycleStartDay(day: number) {
        dispatch({
            type: financeActions.setBudgetCycleStartDay,
            payload: day,
        });
    }

    function renderPage(viewId: ViewId) {
        if (viewId === 'home') {
            return (
                <HomePage
                    balance={totalBalance}
                    defaultCurrency={defaultCurrency}
                    accounts={state.accounts}
                    categories={state.categories}
                    currentBudgetCycleLabel={currentBudgetCycleLabel}
                    currentCycleSpent={currentCycleSpent}
                    currentCycleEarned={currentCycleEarned}
                    recentTransactionGroups={recentTransactionGroups}
                    spendingByCategory={spendingByCategory}
                    netWorthTrend={netWorthTrend}
                    transactionCount={state.transactions.length}
                    recurringCount={state.recurringRules.length}
                    onCreateTransaction={addTransaction}
                    onUpdateTransaction={updateTransaction}
                    onDeleteTransaction={deleteTransaction}
                />
            );
        }

        if (viewId === 'transactions') {
            return (
                <TransactionsPage
                    accounts={state.accounts}
                    categories={state.categories}
                    defaultCurrency={defaultCurrency}
                    transactions={normalizedTransactions}
                    onCreateTransaction={addTransaction}
                    onUpdateTransaction={updateTransaction}
                    onDeleteTransaction={deleteTransaction}
                />
            );
        }

        if (viewId === 'categories') {
            return (
                <CategoriesPage
                    accounts={state.accounts}
                    categories={state.categories}
                    defaultCurrency={defaultCurrency}
                    transactions={state.transactions}
                    normalizedTransactions={normalizedTransactions}
                    recurringRules={state.recurringRules}
                    spendingByCategory={spendingByCategory}
                    onAddAccount={addAccount}
                    onCreateCategory={addCategory}
                    onUpdateCategory={updateCategory}
                    onDeleteCategory={deleteCategory}
                />
            );
        }

        if (viewId === 'recurring') {
            return (
                <RecurringPage
                    accounts={state.accounts}
                    categories={state.categories}
                    defaultCurrency={defaultCurrency}
                    recurringRules={state.recurringRules}
                    onCreateRecurringRule={addRecurringRule}
                    onUpdateRecurringRule={updateRecurringRule}
                    onDeleteRecurringRule={deleteRecurringRule}
                    onRunDueEntries={() =>
                        dispatch({ type: financeActions.applyRecurringDue })
                    }
                />
            );
        }

        if (viewId === 'goals') {
            return (
                <GoalsPage
                    goals={state.goals}
                    currency={defaultCurrency}
                    onAddGoal={addGoal}
                    onContributeGoal={contributeToGoal}
                />
            );
        }

        return (
            <SettingsPage
                defaultCurrency={defaultCurrency}
                budgetCycleStartDay={budgetCycleStartDay}
                exchangeRateStatus={exchangeRateStatus}
                onChangeDefaultCurrency={(currency) =>
                    dispatch({
                        type: financeActions.setDefaultCurrency,
                        payload: currency,
                    })
                }
                onChangeBudgetCycleStartDay={setBudgetCycleStartDay}
            />
        );
    }

    function applySwipePosition(offset: number, index = activeIndexRef.current) {
        const width =
            containerWidthRef.current || pagerRef.current?.offsetWidth || 1;
        const progress = Math.min(
            views.length - 1,
            Math.max(0, index - offset / width),
        );

        if (trackRef.current) {
            trackRef.current.style.transform = `translate3d(${Math.round(
                -index * width + offset,
            )}px, 0, 0)`;
        }

        if (indicatorRef.current) {
            indicatorRef.current.style.transform = `translate3d(${progress * 100}%, 0, 0)`;
        }
    }

    function finishSwipe(nextIndex: number) {
        gestureRef.current.offset = 0;
        setIsDragging(false);
        setIsSnapAnimating(true);
        setActiveView(views[nextIndex].id);
    }

    function jumpToView(viewId: ViewId) {
        gestureRef.current.offset = 0;
        setIsDragging(false);
        setIsSnapAnimating(false);
        setActiveView(viewId);
    }

    function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
        if (isDesktop || event.touches.length !== 1) {
            return;
        }

        const target = event.target as HTMLElement | null;

        if (
            target?.closest(
                'button, input, select, textarea, a, [role="button"], [role="dialog"]',
            )
        ) {
            return;
        }

        const touch = event.touches[0];
        gestureRef.current = {
            pointerId: touch.identifier,
            startX: touch.clientX,
            startY: touch.clientY,
            lastX: touch.clientX,
            previousX: touch.clientX,
            lastMoveAt: performance.now(),
            previousMoveAt: performance.now(),
            offset: 0,
            intent: 'undecided',
            isTracking: true,
        };
    }

    function handleTouchMove(event: React.TouchEvent<HTMLDivElement>) {
        const gesture = gestureRef.current;

        if (
            isDesktop ||
            !gesture.isTracking ||
            event.touches.length !== 1 ||
            event.touches[0].identifier !== gesture.pointerId
        ) {
            return;
        }

        const touch = event.touches[0];
        const deltaX = touch.clientX - gesture.startX;
        const deltaY = touch.clientY - gesture.startY;

        if (gesture.intent === 'undecided') {
            if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
                return;
            }

            gesture.intent =
                Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';

            if (gesture.intent === 'vertical') {
                gesture.isTracking = false;
                return;
            }

            setIsDragging(true);
        }

        if (gesture.intent !== 'horizontal') {
            return;
        }

        event.preventDefault();

        const atFirstView = activeIndexRef.current === 0;
        const atLastView = activeIndexRef.current === views.length - 1;
        const resistedOffset =
            (atFirstView && deltaX > 0) || (atLastView && deltaX < 0)
                ? deltaX * 0.35
                : deltaX;

        gesture.offset = resistedOffset;
        gesture.previousX = gesture.lastX;
        gesture.previousMoveAt = gesture.lastMoveAt;
        gesture.lastX = touch.clientX;
        gesture.lastMoveAt = performance.now();
        applySwipePosition(resistedOffset);
    }

    function handleTouchEnd() {
        const gesture = gestureRef.current;

        if (!gesture.isTracking && gesture.intent !== 'horizontal') {
            return;
        }

        const width = containerWidthRef.current || pagerRef.current?.offsetWidth || 1;
        const elapsed = Math.max(1, gesture.lastMoveAt - gesture.previousMoveAt);
        const velocity = (gesture.lastX - gesture.previousX) / elapsed;
        const travelledRatio = Math.abs(gesture.offset) / width;
        let nextIndex = activeIndexRef.current;

        if (
            travelledRatio > 0.18 ||
            (Math.abs(gesture.offset) > 24 && Math.abs(velocity) > 0.45)
        ) {
            if (gesture.offset < 0) {
                nextIndex = Math.min(views.length - 1, activeIndexRef.current + 1);
            } else if (gesture.offset > 0) {
                nextIndex = Math.max(0, activeIndexRef.current - 1);
            }
        }

        gestureRef.current = {
            pointerId: null,
            startX: 0,
            startY: 0,
            lastX: 0,
            previousX: 0,
            lastMoveAt: 0,
            previousMoveAt: 0,
            offset: 0,
            intent: 'undecided',
            isTracking: false,
        };

        finishSwipe(nextIndex);
    }

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1024px)');
        const syncDesktop = (matches: boolean) => {
            setIsDesktop(matches);
            setIsDragging(false);
            setIsSnapAnimating(false);
        };

        syncDesktop(mediaQuery.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            syncDesktop(event.matches);
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    useEffect(() => {
        if (!pagerRef.current) {
            return;
        }

        const updateWidth = () => {
            containerWidthRef.current = pagerRef.current?.offsetWidth ?? 0;
            applySwipePosition(0);
        };

        updateWidth();

        const observer = new ResizeObserver(updateWidth);
        observer.observe(pagerRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        activeIndexRef.current = activeIndex;
        applySwipePosition(0, activeIndex);
    }, [activeIndex]);

    useEffect(() => {
        if (!isSnapAnimating) {
            if (snapTimeoutRef.current !== null) {
                window.clearTimeout(snapTimeoutRef.current);
                snapTimeoutRef.current = null;
            }

            return;
        }

        snapTimeoutRef.current = window.setTimeout(() => {
            setIsSnapAnimating(false);
            snapTimeoutRef.current = null;
        }, 320);

        return () => {
            if (snapTimeoutRef.current !== null) {
                window.clearTimeout(snapTimeoutRef.current);
                snapTimeoutRef.current = null;
            }
        };
    }, [isSnapAnimating]);

    return (
        <div className="min-h-screen">
            <div className="mx-auto flex max-w-7xl gap-6 px-4 py-4 sm:px-6 sm:py-6">
                <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-72 shrink-0 lg:flex lg:flex-col">
                    <div className="app-card flex h-full flex-col bg-slate-950 p-6 text-white">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-100">
                                Expense Tracker
                            </p>
                            <h1 className="mt-3 text-2xl font-semibold tracking-tight">
                                Finance, split into clear pages.
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-slate-300">
                                Each area now has its own page component, with the
                                main balance surfaced near the top instead of at
                                the bottom.
                            </p>
                        </div>

                        <div className="mt-6 rounded-[24px] bg-white/10 p-4">
                            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                                Total balance
                            </p>
                            <p className="mt-2 text-2xl font-semibold">
                                {formatMoney(totalBalance, defaultCurrency)}
                            </p>
                        </div>

                        <nav className="mt-8 space-y-2">
                            {views.map(({ id, label, Icon }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setActiveView(id)}
                                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                                        activeView === id
                                            ? 'bg-white text-slate-950'
                                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </button>
                            ))}
                        </nav>

                        <div className="mt-auto grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-white/10 p-4">
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                                    Accounts
                                </p>
                                <p className="mt-2 text-lg font-semibold text-white">
                                    {state.accounts.length}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-4">
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                                    Categories
                                </p>
                                <p className="mt-2 text-lg font-semibold text-white">
                                    {state.categories.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="min-w-0 flex-1 pb-24 lg:pb-0">
                    {isDesktop ? (
                        renderPage(activeView)
                    ) : (
                        <div
                            ref={pagerRef}
                            className="overflow-hidden"
                            style={{ touchAction: 'pan-y pinch-zoom' }}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onTouchCancel={handleTouchEnd}
                        >
                            <div
                                ref={trackRef}
                                className={`grid auto-cols-[100%] grid-flow-col items-start ${
                                    isDragging || !isSnapAnimating
                                        ? ''
                                        : 'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]'
                                }`}
                            >
                                {views.map((view) => (
                                    <section
                                        key={view.id}
                                        className="min-w-0"
                                        aria-hidden={view.id !== activeView}
                                    >
                                        {renderPage(view.id)}
                                    </section>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <nav className="fixed inset-x-0 bottom-4 z-20 px-4 lg:hidden">
                <div className="mx-auto max-w-2xl rounded-[28px] border border-app-line bg-white/95 p-2 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.35)] backdrop-blur">
                    <div className="relative flex items-center">
                        <span
                            ref={indicatorRef}
                            className={`pointer-events-none absolute inset-y-0 left-0 w-[calc(100%/6)] rounded-[20px] bg-brand-50 ${
                                isDragging || !isSnapAnimating
                                    ? ''
                                    : 'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]'
                            }`}
                        />
                        {views.map(({ id, label, Icon }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => jumpToView(id)}
                                aria-label={label}
                                className={`relative z-10 flex min-w-0 flex-1 basis-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-[20px] px-2 py-2 text-[10px] font-medium leading-tight transition-colors sm:px-3 ${
                                    activeView === id
                                        ? 'text-brand-600'
                                        : 'text-slate-500'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="sr-only">{label}</span>
                                <span className="hidden w-full truncate text-center sm:block">
                                    {label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </nav>
        </div>
    );
}
