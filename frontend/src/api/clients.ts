import * as v from 'valibot';

const ClientSchema = v.object({
  id: v.number(),
  name: v.string(),
  email: v.string(),
});
export type Client = v.InferOutput<typeof ClientSchema>;

const ClientsSchema = v.array(ClientSchema);

const ClientUpsertSchema = v.object({
  name: v.string(),
  email: v.pipe(v.string(), v.email()),
});
export type ClientUpsert = v.InferOutput<typeof ClientUpsertSchema>;

const API = '/api';

async function requestJson<TSchema extends v.GenericSchema>(
  schema: TSchema,
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<v.InferOutput<TSchema>> {
  const r = await fetch(input, { credentials: 'include', ...init });

  if (!r.ok) {
    let message = `Request failed (${r.status})`;

    // Try to extract ProblemDetail detail/title from JSON
    try {
      const err: any = await r.json();
      if (typeof err?.detail === 'string' && err.detail.trim()) {
        message = err.detail;
      } else if (typeof err?.title === 'string' && err.title.trim()) {
        message = err.title;
      }
    } catch {
      // If it's not JSON, try plain text (sometimes useful)
      try {
        const text = await r.text();
        if (text.trim()) message = text;
      } catch {
        // ignore
      }
    }

    throw new Error(message);
  }

  const data: unknown = await r.json();
  return v.parse(schema, data);
}


export function getClients() {
  return requestJson(ClientsSchema, `${API}/clients`);
}

export function getClient(id: number) {
  return requestJson(ClientSchema, `${API}/clients/${id}`);
}

export function createClient(input: ClientUpsert) {
  v.parse(ClientUpsertSchema, input);
  return requestJson(ClientSchema, `${API}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export function updateClient(id: number, input: ClientUpsert) {
  v.parse(ClientUpsertSchema, input);
  return requestJson(ClientSchema, `${API}/clients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export async function deleteClient(id: number) {
  const r = await fetch(`${API}/clients/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!r.ok) throw new Error(`Delete failed (${r.status})`);
}