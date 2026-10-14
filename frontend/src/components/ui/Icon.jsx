/**
 * Material Symbols icon wrapper.
 * @param {{ name: string, size?: number, filled?: boolean, className?: string }} props
 */
export default function Icon({ name, size = 20, filled = false, className = '' }) {
    return (
        <span
            className={`material-symbols-outlined ${className}`}
            style={{
                fontSize: `${size}px`,
                fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
            }}
            aria-hidden="true"
        >
      {name}
    </span>
    );
}