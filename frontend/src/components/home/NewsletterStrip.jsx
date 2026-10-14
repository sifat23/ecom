import { useState } from 'react';
import Icon from '../ui/Icon';

export default function NewsletterStrip() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        if (!email) return;
        // TODO Phase 8: wire to POST /api/newsletter/subscribe
        setSubmitted(true);
        setEmail('');
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <section className="w-full py-10 bg-background">
            <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-tablet">
                <div className="flex flex-col md:flex-row items-center gap-4 bg-surface-container-lowest p-3 sm:p-4 rounded-2xl shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                        <Icon name="mail" size={24} />
                    </div>

                    <form
                        onSubmit={onSubmit}
                        className="flex flex-1 flex-col sm:flex-row items-center gap-2 w-full"
                    >
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={submitted ? 'Thanks for subscribing!' : 'Enter your email'}
                            className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary-container text-body-md"
                        />
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary-container text-on-primary font-semibold hover:bg-primary transition-all duration-200 whitespace-nowrap shadow-sm"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}