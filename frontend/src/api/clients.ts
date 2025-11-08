import * as v from 'valibot';

const Client = v.object({ id: v.number(), name: v.string(), email: v.string() });
export type Client = v.InferOutput<typeof Client>;
const Clients = v.array(Client);

// Write DTO (what your form sends)
const ClientUpsert = v.object({
  name: v.string(),
  email: v.string()
});
export type ClientUpsert = v.InferOutput<typeof ClientUpsert>;

const API = '/api';

export async function getClients() {
  const r = await fetch(`${API}/clients`, { credentials: 'include' });
  if (!r.ok) throw new Error('Failed to fetch clients');
  return v.parse(Clients, await r.json());
}

export async function getClient(id: number) {
  const r = await fetch(`${API}/clients/${id}`, { credentials: 'include' });
  if (!r.ok) throw new Error(`Client ${id} not found`);
  return v.parse(Client, await r.json());
}

export async function createClient(input: ClientUpsert) {
  // optional client-side shape check
  v.parse(ClientUpsert, input);

  const r = await fetch(`${API}/clients`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  if (r.status === 409) throw new Error('Email already exists');
  if (!r.ok) throw new Error('Create failed');
  return v.parse(Client, await r.json());
}

export async function updateClient(id: number, input: ClientUpsert) {
  v.parse(ClientUpsert, input);

  const r = await fetch(`${API}/clients/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  if (r.status === 409) throw new Error('Email already exists');
  if (!r.ok) throw new Error('Update failed');
  return v.parse(Client, await r.json());
}

export async function deleteClient(id: number) {
  const r = await fetch(`${API}/clients/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!(r.ok || r.status === 204)) throw new Error('Delete failed');
}