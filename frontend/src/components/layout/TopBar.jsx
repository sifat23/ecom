import Icon from '../ui/Icon';
import { topBarItems } from '../../data/homeContent';

export default function TopBar() {
    return (
        <aside className="w-full bg-primary-container text-on-primary py-2 px-margin-mobile md:px-margin-tablet lg:px-margin">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-space-xs md:gap-space-lg text-center md:text-left">
                {topBarItems.map((item) => (
                    <div key={item.text} className="flex items-center gap-space-sm">
                        <Icon name={item.icon} size={16} className="text-on-primary-container" />
                        <span className="text-label-sm tracking-wide">{item.text}</span>
                    </div>
                ))}

                <div className="flex items-center gap-space-xs">
                    <div className="flex items-center text-tertiary-fixed-dim">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <Icon key={i} name={i < 4 ? 'star' : 'star_half'} size={15} filled={i < 4} />
                        ))}
                    </div>
                    <span className="text-label-sm text-on-primary">
            EXCELLENT 4.9 OUT OF 5
          </span>
                </div>
            </div>
        </aside>
    );
}