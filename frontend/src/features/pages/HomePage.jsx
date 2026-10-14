import { useGetHealthQuery } from '../../store/api/apiSlice';

export default function HomePage() {
    const { data, isLoading, isError } = useGetHealthQuery();

    return (
        <div className="mx-auto max-w-7xl px-4 py-16">
            <h1 className="text-3xl font-bold text-slate-900">
                Phase 0 — Foundation Online
            </h1>
            <p className="mt-2 text-slate-600">
                Tailwind v4 is active. Redux Toolkit is wired. RTK Query is talking to the API.
            </p>

            <div className="mt-8 rounded-card border border-slate-200 bg-white p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                    API health
                </h2>

                {isLoading && <p className="mt-2 text-slate-500">Checking…</p>}

                {isError && (
                    <p className="mt-2 font-mono text-sm text-red-600">
                        ✗ Could not reach <code>/api/health</code>
                    </p>
                )}

                {data && (
                    <pre className="mt-2 overflow-x-auto rounded bg-slate-50 p-3 font-mono text-xs text-slate-800">
            {JSON.stringify(data, null, 2)}
          </pre>
                )}
            </div>
        </div>
    );
}