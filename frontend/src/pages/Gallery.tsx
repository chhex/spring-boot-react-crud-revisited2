import { useQuery } from '@tanstack/react-query';
import { getClients } from '@/api/clients';
import { ClientsTable } from '@/components/ClientsTable';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import { LoadingOrError } from '@/components/LoadingOrError';

export function Gallery() {
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  return (
    <PageLayout title="Clients – React Spring CRUD">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Clients</h2>
        {isLoading ? <p>Loading…</p> : isError ? <LoadingOrError error={new Error('Failed to load clients')} /> : <ClientsTable clients={data} />}
        <div className="mb-4 flex items-center justify-between">
          <Link
            to="new"
            className="rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            + Add Client
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}