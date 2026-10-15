const COPY = {
    pending:   { tone: 'bg-tertiary-fixed text-on-tertiary-fixed',     text: 'Your application is pending review.' },
    approved:  { tone: 'bg-primary-fixed text-on-primary-fixed',       text: 'Your vendor account is approved.' },
    rejected:  { tone: 'bg-error-container text-on-error-container',   text: 'Your application was rejected.' },
    suspended: { tone: 'bg-surface-dim text-on-surface',               text: 'Your account is suspended.' },
};

export default function VendorStatusBanner({ status }) {
    const c = COPY[status] ?? COPY.pending;
    return (
        <div className={`rounded-lg px-space-md py-space-sm text-body-md ${c.tone}`}>
            {c.text}
        </div>
    );
}