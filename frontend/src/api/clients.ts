import * as v from 'valibot'

const Client = v.object({
	id: v.number(),
	name: v.string(),
	email: v.string()
})
export type Client = v.InferOutput<typeof Client>

const Clients = v.array(Client)

export async function getClients() {
	const response = await fetch('/clients')
	if (!response.ok) {
		throw new Error('Failed to fetch')
	}
	return v.parse(Clients, await response.json())
}
