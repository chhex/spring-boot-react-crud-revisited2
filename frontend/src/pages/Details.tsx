import { useSuspenseQuery } from '@tanstack/react-query'
import { Navigate, useParams, useNavigate } from 'react-router'
import { getClients } from '@/api/clients'
import { PageLayout } from '@/components/PageLayout';

function initials(name: string) {
	const p = name.trim().split(/\s+/);
	return ((p[0]?.[0] ?? '') + (p[1]?.[0] ?? '')).toUpperCase();
}
export function Details() {
	const { id } = useParams()

	const { data } = useSuspenseQuery({
		queryFn: getClients,
		queryKey: ['clients']
	})

	const client = data?.find(
		f => f.id.toString() === id
	)
	if (!client) {
		return <Navigate replace={true} to='/' />
	}
	const navigate = useNavigate();

	// simple color pick for avatar
	const colors = [
		'bg-indigo-600', 'bg-emerald-600', 'bg-rose-600',
		'bg-amber-600', 'bg-sky-600', 'bg-violet-600'
	];
	const color = colors[(client.name.length + (Number(id) || 0)) % colors.length];

	return (
		<PageLayout title={`Client: ${client.name}`} >
			<div className="mb-6 flex items-center justify-between">
				<h2 className="text-2xl font-semibold text-gray-900">Client Details</h2>
				<button
					onClick={() => navigate(-1)}
					className="rounded border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
				>
					← Back
				</button>
			</div>

			{/* Card */}
			<div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				{/* Avatar + name */}
				<div className="mb-6 flex items-center gap-3">
					<div className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${color}`}>
						<span className="text-base font-semibold">{initials(client.name)}</span>
					</div>
					<div>
						<div className="text-lg font-semibold text-gray-900">{client.name}</div>
						{client.email && <div className="text-sm text-gray-600">{client.email}</div>}
					</div>
				</div>

				{/* Form-like layout (read-only) */}
				<form className="grid gap-4">
					<div>
						<label htmlFor="id" className="mb-1 block text-sm font-medium text-gray-700">
							ID
						</label>
						<input
							id="id"
							name="id"
							type="text"
							value={client.id || ''}
							readOnly
							disabled
							className="bg-gray-100 cursor-not-allowed"
						/>
					</div>

					<div>
						<label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
							Name
						</label>
						<input
							id="name"
							value={client.name}
							readOnly
							className="w-full rounded border border-gray-300 bg-gray-100 px-3 py-2 text-gray-900"
						/>
					</div>

					<div>
						<label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							id="email"
							type="email"
							value={client.email ?? ''}
							readOnly
							className="w-full rounded border border-gray-300 bg-gray-100 px-3 py-2 text-gray-900"
						/>
					</div>

					{/* Actions (read-only for now) */}
					<div className="mt-2 flex justify-end gap-3">
						{/* Keep Edit disabled until the form exists */}
						<button
							disabled
							className="cursor-not-allowed rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white opacity-60"
							title="Edit coming soon"
						>
							Save
						</button>
						<button
							type="button"
							onClick={() => navigate(-1)}
							className="rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</PageLayout>
	);
}