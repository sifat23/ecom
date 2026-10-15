import { money } from '../data/dashboardMock';

/**
 * Responsive SVG area chart. Renders a smooth curve with gradient fill,
 * day labels, and value labels floating above each point.
 *
 * @param {{
 *   values: number[],
 *   labels: string[],
 * }} props
 */
export default function SalesSparkline({ values, labels }) {
    const W = 720;
    const H = 240;
    const pad = { top: 28, right: 24, bottom: 36, left: 24 };

    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;

    const max = Math.max(...values) * 1.15;
    const stepX = chartW / (values.length - 1);

    const points = values.map((v, i) => ({
        x: pad.left + i * stepX,
        y: pad.top + chartH - (v / max) * chartH,
        v,
    }));

    // Smooth cubic bezier through the points.
    let line = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cx = (prev.x + curr.x) / 2;
        line += ` C ${cx},${prev.y} ${cx},${curr.y} ${curr.x},${curr.y}`;
    }

    const area = `${line} L ${points[points.length - 1].x},${pad.top + chartH} L ${points[0].x},${pad.top + chartH} Z`;

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto"
            role="img"
            aria-label="Sales over the last 7 days"
        >
            <defs>
                <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#1b4d3e" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#1b4d3e" stopOpacity="0"    />
                </linearGradient>
            </defs>

            {/* Horizontal grid lines */}
            {[0.25, 0.5, 0.75, 1].map((f) => {
                const y = pad.top + chartH - chartH * f;
                return (
                    <line
                        key={f}
                        x1={pad.left}
                        x2={W - pad.right}
                        y1={y}
                        y2={y}
                        stroke="#e0e3e1"
                        strokeDasharray="3 4"
                        strokeWidth="1"
                    />
                );
            })}

            {/* Area + line */}
            <path d={area} fill="url(#salesFill)" />
            <path
                d={line}
                fill="none"
                stroke="#1b4d3e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Points + value labels */}
            {points.map((p, i) => (
                <g key={i}>
                    <circle
                        cx={p.x}
                        cy={p.y}
                        r="5"
                        fill="#ffffff"
                        stroke="#1b4d3e"
                        strokeWidth="2"
                    />
                    <text
                        x={p.x}
                        y={p.y - 12}
                        textAnchor="middle"
                        className="fill-on-surface font-sans"
                        style={{ fontSize: 11, fontWeight: 700 }}
                    >
                        {money(p.v).replace(/\.00$/, '')}
                    </text>
                    <text
                        x={p.x}
                        y={H - 12}
                        textAnchor="middle"
                        className="fill-on-surface-variant font-sans"
                        style={{ fontSize: 11, fontWeight: 500 }}
                    >
                        {labels[i]}
                    </text>
                </g>
            ))}
        </svg>
    );
}