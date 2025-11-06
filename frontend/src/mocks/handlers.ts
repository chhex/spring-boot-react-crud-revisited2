import {delay, HttpResponse, http} from 'msw'
import clients from './data/clients.json' with {type: 'json'}


export const handlers = [
	http.get('/clients', async () => {
		await delay('real')
		return HttpResponse.json(clients)
	}),
	http.get('/api/tenant', async () => {
    await delay('real')
    return HttpResponse.json({
      tenantDisplay: getMockTenantDisplay(),
      createdAt: new Date().toISOString(),
      clientCount: 3 // or compute from your mock clients.json length
    })
  })
]
// Persist a friendly token in *sessionStorage* to emulate a session-scoped tenant
function getMockTenantDisplay(): string {
  const k = 'mock-tenant-display'
  let val = sessionStorage.getItem(k)
  if (!val) {
    val = crypto.randomUUID().slice(0, 8)
    sessionStorage.setItem(k, val)
  }
  return val
}

 
