import Icon from '../../../components/ui/Icon';

const TONE = {
    primary: 'bg-primary-container/10 text-primary-container',
    secondary: 'bg-secondary-container/20 text-secondary',
    tertiary: 'bg-tertiary-fixed/60 text-on-tertiary-fixed',
    surface: 'bg-surface-container text-on-surface-variant',
};

/**
 * @param {{
 *   icon: string,
 *   label: string,
 *   value: string,
 *   change?: number,         // percent; positive = up
 *   hint?: string,           // small caption below value
 *   tone?: 'primary'|'secondary'|'tertiary'|'surface',
 * }} props
 */
export default function VendorStatCard({
                                           icon,
                                           label,
                                           value,
                                           change,
                                           hint,
                                           tone = 'primary',
                                       }) {
    const up = typeof change === 'number' && change >= 0;

    return (
        <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${TONE[tone]}`}>
                    <Icon name={icon} size={20} />
                </div>
                {typeof change === 'number' && (
                    <span
                        className={`inline-flex items-center gap-0.5 text-label-sm font-bold px-2 py-0.5 rounded-full ${
                            up
                                ? 'bg-primary-fixed/60 text-on-primary-fixed'
                                : 'bg-error-container/70 text-on-error-container'
                        }`}
                    >
                        <Icon name={up ? 'trending_up' : 'trending_down'} size={13} />
                        {up ? '+' : ''}{change.toFixed(1)}%
                    </span>
                )}
            </div>

            <div className="flex flex-col">
                <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                    {label}
                </span>
                <span className="text-headline-lg text-on-surface tracking-tight tabular-nums">
                    {value}
                </span>
                {hint && (
                    <span className="text-body-sm text-on-surface-variant mt-0.5">{hint}</span>
                )}
            </div>
        </div>
    );
}