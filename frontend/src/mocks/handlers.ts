import { delay, HttpResponse, http } from 'msw';
import seed from './data/clients.json' with { type: 'json' };

type Client = { id: number; name: string; email: string };

const KEY = 'mock.clients.v1';
let nextId = 1000;

const norm = (s?: string | null) => (s ?? '').trim().toLowerCase();

function hydrate(): Client[] {
  const list = (seed as { name: string; email: string }[]).map((c, i) => ({ id: i + 1, ...c }));
  sessionStorage.setItem(KEY, JSON.stringify(list));
  nextId = Math.max(1000, list.reduce((m, c) => Math.max(m, c.id), 0) + 1);
  return list;
}
function load(): Client[] {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return hydrate();
    const list = JSON.parse(raw) as Client[];
    nextId = Math.max(1000, list.reduce((m, c) => Math.max(m, c.id), 0) + 1);
    return list;
  } catch { return hydrate(); }
}
function save(list: Client[]) { sessionStorage.setItem(KEY, JSON.stringify(list)); }

let clients = load();

export const handlers = [
  // LIST
  http.get('/api/clients', async () => {
    await delay('real');
    return HttpResponse.json(clients);
  }),

  // GET by id
  http.get('/api/clients/:id', async ({ params }) => {
    await delay('real');
    const id = Number(params['id']);
    const c = clients.find(x => x.id === id);
    return c
      ? HttpResponse.json(c)
      : HttpResponse.json({ error: 'not_found' }, { status: 404 });
  }),

  // CREATE
  http.post('/api/clients', async ({ request }) => {
    await delay('real');
    const body = (await request.json()) as Partial<Client>;
    const name = (body.name ?? '').toString().trim();
    const email = (body.email ?? '').toString().trim();

    // simple validation
    if (!name) {
      return HttpResponse.json(
        { error: 'validation', fields: { name: 'Name is required' } },
        { status: 400 }
      );
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return HttpResponse.json(
        { error: 'validation', fields: { email: 'Invalid email format' } },
        { status: 400 }
      );
    }
    // duplicate check (case-insensitive)
    if (clients.some(c => norm(c.email) === norm(email))) {
      return HttpResponse.json(
        { error: 'duplicate', field: 'email', message: 'Email already exists' },
        { status: 409 }
      );
    }

    const created: Client = { id: nextId++, name, email };
    clients = [...clients, created];
    save(clients);
    return HttpResponse.json(created, { status: 201 });
  }),

  // UPDATE
  http.put('/api/clients/:id', async ({ params, request }) => {
    await delay('real');
    const id = Number(params['id']);
    const existing = clients.find(c => c.id === id);
    if (!existing) return HttpResponse.json({ error: 'not_found' }, { status: 404 });

    const body = (await request.json()) as Partial<Client>;
    const name = (body.name ?? '').toString().trim();
    const email = (body.email ?? '').toString().trim();

    if (!name) {
      return HttpResponse.json(
        { error: 'validation', fields: { name: 'Name is required' } },
        { status: 400 }
      );
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return HttpResponse.json(
        { error: 'validation', fields: { email: 'Invalid email format' } },
        { status: 400 }
      );
    }
    if (clients.some(c => c.id !== id && norm(c.email) === norm(email))) {
      return HttpResponse.json(
        { error: 'duplicate', field: 'email', message: 'Email already exists' },
        { status: 409 }
      );
    }

    const updated: Client = { ...existing, name, email };
    clients = clients.map(c => (c.id === id ? updated : c));
    save(clients);
    return HttpResponse.json(updated);
  }),

  // DELETE
  http.delete('/api/clients/:id', async ({ params }) => {
    await delay('real');
    const id = Number(params['id']);
    const before = clients.length;
    clients = clients.filter(c => c.id !== id);
    if (clients.length === before) {
      return HttpResponse.json({ error: 'not_found' }, { status: 404 });
    }
    save(clients);
    return HttpResponse.json({ ok: true });
  }),

  // Tenant info (mock)
  http.get('/api/tenantInfo', async () => {
    await delay('real');
    const key = 'mock.tenantDisplay';
    const tenantDisplay =
      sessionStorage.getItem(key) ||
      (() => { const v = Math.random().toString(36).slice(2, 10); sessionStorage.setItem(key, v); return v; })();
    return HttpResponse.json({
      tenantDisplay,
      createdAt: null,
      clientCount: clients.length,
    });
  }),
];