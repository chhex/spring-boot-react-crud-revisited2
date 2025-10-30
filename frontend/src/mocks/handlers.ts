import {delay, HttpResponse, http} from 'msw'
import clients from './data/clients.json' with {type: 'json'}

export const handlers = [
	http.get('/clients', async () => {
		await delay('real')
		return HttpResponse.json(clients)
	})
]
