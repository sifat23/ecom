import { forwardRef } from 'react';

export default function AuthFormShell({
                                          title,
                                          subtitle,
                                          children,
                                          footer,
                                          maxWidth = 'max-w-md',
                                      }) {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-margin-mobile py-12 bg-background">
            <div className={`w-full ${maxWidth}`}>
                <div className="rounded-2xl bg-surface-container-lowest shadow-sm p-6 sm:p-10">
                    <h1 className="text-headline-lg text-on-surface font-bold tracking-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-2 text-body-md text-on-surface-variant">{subtitle}</p>
                    )}
                    <div className="mt-6">{children}</div>
                </div>
                {footer && (
                    <div className="mt-6 text-center text-body-sm text-on-surface-variant">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

export function FieldError({ children }) {
    if (!children) return null;
    return <p className="mt-1 text-[12px] text-error">{children}</p>;
}

export const FormInput = forwardRef(function FormInput(
    {
        label,
        error,
        className = '',
        name,
        onChange,
        onBlur,
        onAnimationStart,
        ...rest
    },
    ref
) {
    const handleAnimationStart = (e) => {
        // Chrome/Edge autofill fires this animation but skips React's onChange.
        // Synthesize a change event so RHF syncs the autofilled value.
        if (e.animationName === 'onAutoFillStart' && onChange) {
            onChange({ target: { name, value: e.target.value } });
        }
        onAnimationStart?.(e);
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-label-md text-on-surface font-semibold mb-1.5">
                    {label}
                </label>
            )}
            <input
                {...rest}
                ref={ref}
                name={name}
                onChange={onChange}
                onBlur={onBlur}
                onAnimationStart={handleAnimationStart}
                className={`w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface placeholder:text-on-surface-variant border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-colors text-body-md ${
                    error ? 'ring-2 ring-error/40' : ''
                }`}
            />
            <FieldError>{error}</FieldError>
        </div>
    );
});