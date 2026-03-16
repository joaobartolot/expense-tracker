import { Pencil, Trash2 } from 'lucide-react';
import { CategoryIcon } from '../common/CategoryIcon';
import { Modal } from '../common/Modal';
import { formatMoney } from '../../utils/currency';
import type {
    Account,
    Category,
    Currency,
    NormalizedTransaction,
} from '../../types/finance';

interface TransactionOverviewModalProps {
    transaction: NormalizedTransaction | null;
    accounts: Account[];
    categories: Category[];
    defaultCurrency: Currency;
    onClose: () => void;
    onEdit: (transaction: NormalizedTransaction) => void;
    onDelete: (transactionId: string) => void;
}

export function TransactionOverviewModal({
    transaction,
    accounts,
    categories,
    defaultCurrency,
    onClose,
    onEdit,
    onDelete,
}: TransactionOverviewModalProps) {
    const category = categories.find(
        (item) => item.id === transaction?.categoryId,
    );
    const account = accounts.find((item) => item.id === transaction?.accountId);

    return (
        <Modal
            open={Boolean(transaction)}
            title="Transaction overview"
            description="Review the transaction details, then choose whether to edit or delete it."
            onClose={onClose}
        >
            {transaction ? (
                <div className="space-y-4">
                    <div className="flex items-start gap-3 rounded-[24px] bg-slate-50 p-4">
                        <div className="rounded-2xl bg-white p-3 text-brand-500 shadow-sm">
                            <CategoryIcon
                                iconKey={category?.icon}
                                className="h-5 w-5"
                            />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">
                                {transaction.description}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                {category?.name ?? 'Uncategorized'} •{' '}
                                {account?.name ?? 'Unknown account'}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                                Converted amount
                            </p>
                            <p className="mt-2 font-semibold text-slate-900">
                                {formatMoney(transaction.converted, defaultCurrency)}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                                Original amount
                            </p>
                            <p className="mt-2 font-semibold text-slate-900">
                                {formatMoney(transaction.amount, transaction.currency)}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                                Date
                            </p>
                            <p className="mt-2 font-semibold text-slate-900">
                                {transaction.date}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                                Type
                            </p>
                            <p className="mt-2 font-semibold capitalize text-slate-900">
                                {transaction.type}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => onEdit(transaction)}
                            className="app-button-secondary"
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </button>
                        <button
                            type="button"
                            onClick={() => onDelete(transaction.id)}
                            className="rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm font-semibold text-rose-500 transition hover:bg-rose-50"
                        >
                            <Trash2 className="mr-2 inline h-4 w-4" />
                            Delete
                        </button>
                    </div>
                </div>
            ) : null}
        </Modal>
    );
}
