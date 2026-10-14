import { useEffect, useState } from 'react';
import Icon from './Icon';

export default function ThemeToggle() {
    const [dark, setDark] = useState(
        () => localStorage.getItem('theme') === 'dark'
    );

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    }, [dark]);

    return (
        <button
            type="button"
            aria-label="Toggle dark mode"
            onClick={() => setDark((d) => !d)}
            className="w-11 h-6 rounded-full bg-surface-container-high relative p-0.5 flex items-center transition-colors focus:outline-none"
        >
      <span
          className={`w-5 h-5 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface-variant transition-transform ${
              dark ? 'translate-x-5' : 'translate-x-0'
          }`}
      >
        <Icon name={dark ? 'dark_mode' : 'light_mode'} size={13} />
      </span>
        </button>
    );
}