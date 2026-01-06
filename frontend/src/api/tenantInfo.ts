import * as v from 'valibot'

const TenantInfoSchema = v.object({
	tenantDisplay: v.string(),
	clientCount: v.optional(v.number())
})
export type TenantInfo = v.InferOutput<typeof TenantInfoSchema>

export async function getTenantInfo() {
	const res = await fetch('/api/tenantInfo', { credentials: 'include' })
	if (!res.ok) throw new Error(`Tenant load failed: ${res.status}`)
	const data : unknown = await res.json()
	return v.parse(TenantInfoSchema, data)
}