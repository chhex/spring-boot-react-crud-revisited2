// src/components/ClientTable.tsx
import { Link } from 'react-router';
import type {Client as ClientType} from '@/api/clients'

export function ClientsTable({ clients }: { clients: ClientType[] }) {
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
          {clients.map((c, idx) => (
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
                  disabled
                  className="cursor-not-allowed text-gray-400"
                  title="Delete (disabled for now)"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}