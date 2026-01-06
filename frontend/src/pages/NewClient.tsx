// src/pages/NewClient.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/api/clients';
import { PageLayout } from '@/components/PageLayout';
import type { TenantInfo } from '@/api/tenantInfo';

export function NewClient() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [err, setErr] = useState<string | null>(null);

  type NewClientInput = { name: string; email: string };

  const mut = useMutation({
    mutationFn: (input: NewClientInput) => createClient(input),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['tenantInfo'] });
      const prevTenant = qc.getQueryData<TenantInfo>(['tenantInfo']);
      if (prevTenant) {
        qc.setQueryData(['tenantInfo'], {
          ...prevTenant,
          clientCount: (prevTenant.clientCount ?? 0) + 1,
        });
      }
      return { prevTenant };
    },
    onError: (e: unknown, _vars, ctx) => {
      setErr(e instanceof Error ? e.message : 'Create failed');
      if (ctx?.prevTenant) qc.setQueryData(['tenantInfo'], ctx.prevTenant);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] });
      qc.invalidateQueries({ queryKey: ['tenantInfo'] });
      navigate('/clients', { replace: true });
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    mut.mutate({ name, email });
  };

  return (
    <PageLayout title="New Client">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">New Client</h2>
        <button
          onClick={() => navigate(-1)}
          className="rounded border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
        >
          ← Back
        </button>
      </div>

      {/* Card */}
      <div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              name="name"
              placeholder="Chris Example"
              className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="chris@example.com"
              className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
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
              disabled={mut.isPending}
              className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              title="Save"
            >
              {mut.isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}