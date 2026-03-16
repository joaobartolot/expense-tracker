import type { LucideIcon } from 'lucide-react';
import {
    BriefcaseBusiness,
    Bus,
    HeartPulse,
    House,
    LaptopMinimal,
    PiggyBank,
    Receipt,
    ShoppingBag,
    Tag,
    UtensilsCrossed,
    Wallet,
} from 'lucide-react';

export interface CategoryIconOption {
    key: string;
    label: string;
    Icon: LucideIcon;
}

export const CATEGORY_ICON_OPTIONS: CategoryIconOption[] = [
    { key: 'utensils', label: 'Food', Icon: UtensilsCrossed },
    { key: 'house', label: 'Housing', Icon: House },
    { key: 'bus', label: 'Transport', Icon: Bus },
    { key: 'health', label: 'Health', Icon: HeartPulse },
    { key: 'salary', label: 'Salary', Icon: BriefcaseBusiness },
    { key: 'freelance', label: 'Freelance', Icon: LaptopMinimal },
    { key: 'wallet', label: 'Wallet', Icon: Wallet },
    { key: 'shopping', label: 'Shopping', Icon: ShoppingBag },
    { key: 'receipt', label: 'Bills', Icon: Receipt },
    { key: 'savings', label: 'Savings', Icon: PiggyBank },
    { key: 'tag', label: 'General', Icon: Tag },
];

export function getCategoryIcon(iconKey?: string) {
    return (
        CATEGORY_ICON_OPTIONS.find((option) => option.key === iconKey)?.Icon ??
        Tag
    );
}
