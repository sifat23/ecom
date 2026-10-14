import { Link } from 'react-router-dom';

const VARIANTS = {
    primary:
        'bg-primary-container text-on-primary hover:bg-primary shadow-sm hover:shadow-md',
    secondary:
        'bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-sm',
    ghost:
        'text-on-surface-variant hover:text-on-surface hover:bg-surface-container',
    icon:
        'w-10 h-10 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container',
};

const SIZES = {
    sm: 'px-4 py-2 text-label-md',
    md: 'px-6 py-3 text-label-lg',
    lg: 'px-7 py-3.5 text-label-lg',
};

export default function Button({
                                   as,
                                   to,
                                   variant = 'primary',
                                   size = 'md',
                                   className = '',
                                   children,
                                   ...rest
                               }) {
    const cls = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 ${VARIANTS[variant]} ${SIZES[size] ?? ''} ${className}`;

    if (as === Link || to) {
        return <Link to={to} className={cls} {...rest}>{children}</Link>;
    }
    return <button className={cls} {...rest}>{children}</button>;
}