// src/pages/Details.tsx
import {useEffect, useMemo, useState} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {Navigate, useNavigate, useParams} from 'react-router-dom';
import {getClient, updateClient} from '@/api/clients';
import {PageLayout} from '@/components/PageLayout';

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? '') + (p[1]?.[0] ?? '')).toUpperCase();
}

export function ClientDetails() {
  const {id} = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const clientId = Number(id);
  const badId = !Number.isFinite(clientId);

  const {data: client, isLoading, isError} = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => getClient(clientId),
    enabled: !badId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // local editable state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [err, setErr] = useState<string | null>(null);

  // sync state when client arrives
  useEffect(() => {
    if (client) {
      setName(client.name ?? '');
      setEmail(client.email ?? '');
    }
  }, [client]);

  const unchanged = useMemo(
    () => !!client && name === (client.name ?? '') && email === (client.email ?? ''),
    [name, email, client]
  );

  const mut = useMutation({
    mutationFn: () => updateClient(clientId, {name, email}),
    onError: (e: any) => setErr(e?.message ?? 'Update failed'),
    onSuccess: () => {
      qc.invalidateQueries({queryKey: ['clients']});
      qc.invalidateQueries({queryKey: ['client', clientId]});
      navigate('/clients', {replace: true});
    },
  });

  if (badId) return <Navigate to="/" replace />;
  if (isLoading) return <PageLayout title="Loading…"><p>Loading…</p></PageLayout>;
  if (isError || !client) return <Navigate to="/" replace />;

  // avatar color
  const colors = ['bg-indigo-600','bg-emerald-600','bg-rose-600','bg-amber-600','bg-sky-600','bg-violet-600'];
  const color = colors[(client.name.length + clientId) % colors.length];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    mut.mutate();
  };

  return (
    <PageLayout title={`Client: ${client.name}`}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Edit Client</h2>
        <button
          onClick={() => navigate(-1)}
          className="rounded border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
        >
          ← Back
        </button>
      </div>

      <div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {/* Avatar + current name */}
        <div className="mb-6 flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${color}`}>
            <span className="text-base font-semibold">{initials(client.name)}</span>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">{client.name}</div>
            {client.email && <div className="text-sm text-gray-600">{client.email}</div>}
          </div>
        </div>

        {/* Editable form */}
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="id" className="mb-1 block text-sm font-medium text-gray-700">ID</label>
            <input
              id="id"
              name="id"
              type="text"
              value={String(client.id)}
              readOnly
              disabled
              className="w-full rounded border border-gray-200 bg-gray-100 px-3 py-2 text-gray-900 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
            />
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/clients')}
              className="rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mut.isPending || unchanged}
              className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {mut.isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}