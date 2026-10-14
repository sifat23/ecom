import { useEffect, useState } from 'react';

const pad = (n) => String(n).padStart(2, '0');

function split(totalSeconds) {
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return { d, h, m, s };
}

/** Real-time countdown. Re-renders every second until it hits 0. */
export default function CountdownTimer({ seconds = 0, className = '' }) {
    const [remaining, setRemaining] = useState(seconds);

    useEffect(() => {
        if (remaining <= 0) return;
        const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
        return () => clearInterval(id);
    }, [remaining]);

    const { d, h, m, s } = split(remaining);
    const cells = [
        { value: d, label: 'Days' },
        { value: h, label: 'Hrs' },
        { value: m, label: 'Mins' },
        { value: s, label: 'Secs' },
    ];

    return (
        <div className={`flex items-center gap-3 font-bold ${className}`}>
            {cells.map((cell, i) => (
                <div key={cell.label} className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
            <span className="text-headline-sm text-primary-container tabular-nums">
              {pad(cell.value)}
            </span>
                        <span className="text-body-sm text-[10px] text-on-surface-variant uppercase tracking-wider">
              {cell.label}
            </span>
                    </div>
                    {i < cells.length - 1 && (
                        <span className="text-on-surface-variant pb-3">:</span>
                    )}
                </div>
            ))}
        </div>
    );
}