import { createElement } from 'react';
import { getCategoryIcon } from '../../utils/categoryIconData';

interface CategoryIconProps {
    iconKey?: string;
    className?: string;
}

export function CategoryIcon({ iconKey, className }: CategoryIconProps) {
    return createElement(getCategoryIcon(iconKey), { className });
}
