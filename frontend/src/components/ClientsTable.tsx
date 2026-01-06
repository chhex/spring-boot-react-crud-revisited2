// src/components/ClientsTable.tsx
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteClient, type Client as ClientType } from '@/api/clients';
import { useState } from 'react';


export function ClientsTable({ clients }: { clients: ClientType[] }) {
  const qc = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const del = useMutation({
    mutationFn: async (id: number) => {
      setDeletingId(id);
      return deleteClient(id);
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['clients'] });
      const prevClients = qc.getQueryData<ClientType[]>(['clients']);
      // optimistic remove
      qc.setQueryData<ClientType[]>(['clients'], (old = []) => old.filter(c => c.id !== id));
      // optimistic tenantInfo-- (optional, see next block)
      const prevTenant = qc.getQueryData<any>(['tenantInfo']);
      if (prevTenant) {
        qc.setQueryData(['tenantInfo'], { ...prevTenant, clientCount: Math.max(0, (prevTenant.clientCount ?? 0) - 1) });
      }
      return { prevClients, prevTenant };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prevClients) qc.setQueryData(['clients'], ctx.prevClients);
      if (ctx?.prevTenant) qc.setQueryData(['tenantInfo'], ctx.prevTenant);
    },
    onSettled: () => {
      setDeletingId(null);
      qc.invalidateQueries({ queryKey: ['clients'] });
      qc.invalidateQueries({ queryKey: ['tenantInfo'] }); // <-- important
    },
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-gray-100 text-left font-semibold text-gray-800">
          <tr>
            <th className="border-b border-gray-300 px-6 py-3">Name</th>
            <th className="border-b border-gray-300 px-6 py-3">Email</th>
            <th className="border-b border-gray-300 px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c, idx) => {
            const isThisDeleting = deletingId === c.id;
            return (
              <tr
                key={c.id}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
              >
                <td className="border-b border-gray-200 px-6 py-3 text-gray-900">{c.name}</td>
                <td className="border-b border-gray-200 px-6 py-3 text-gray-700">{c.email}</td>
                <td className="border-b border-gray-200 px-6 py-3 text-right">
                  <Link
                    to={`${c.id}`}
                    className="text-indigo-600 hover:text-indigo-900 font-medium mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    className="text-red-600 hover:text-red-700 font-medium disabled:opacity-60"
                    onClick={() => del.mutate(c.id)}
                    disabled={del.isPending}
                    title="Delete"
                  >
                    {isThisDeleting ? 'Deleting…' : 'Delete'}
                  </button>
                </td>
              </tr>
            );
          })}
          {clients.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-6 text-gray-600">
                No clients yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}