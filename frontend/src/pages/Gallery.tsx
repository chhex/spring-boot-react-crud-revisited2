import { useSuspenseQuery } from '@tanstack/react-query'
import { getClients } from '@/api/clients'
import { ClientsTable } from '@/components/ClientsTable'
import { Head } from '@/components/Head'
import {Link} from 'react-router'


export function Gallery() {
	const { data } = useSuspenseQuery({
		queryFn: getClients,
		queryKey: ['clients']
	})

	return (
		<>
			<Head title="Clients – React Spring CRUD" />

			<div className="p-6">
				<h2 className="text-2xl font-semibold mb-4">Clients</h2>
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-2xl font-semibold text-gray-900">Clients</h2>
					<Link
						to="new"
						className="rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
					>
						+ Add Client
					</Link>
				</div>
				<ClientsTable clients={data} />
			</div>
		</>
	)
}
