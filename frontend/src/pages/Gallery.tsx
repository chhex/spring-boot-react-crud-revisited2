import { useSuspenseQuery } from '@tanstack/react-query'
import { getClients } from '@/api/clients'
import { ClientsTable } from '@/components/ClientsTable'
import { Link } from 'react-router'
import { PageLayout } from '@/components/PageLayout'


export function Gallery() {
	const { data } = useSuspenseQuery({
		queryFn: getClients,
		queryKey: ['clients']
	})

	return (
		<>
			<PageLayout title='Clients – React Spring CRUD'>
				<div className="p-6">
					<h2 className="text-2xl font-semibold mb-4">Clients</h2>
					<ClientsTable clients={data} />
					<div className="mb-4 flex items-end justify-end">
						<Link
							to="new"
							className="rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
						>
							+ Add Client
						</Link>
					</div>
				</div>
			</PageLayout>
		</>
	)
}
