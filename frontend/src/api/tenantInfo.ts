import * as v from 'valibot'

const TenantInfo = v.object({
	tenantDisplay: v.string(),
	clientCount: v.optional(v.number())
})
export type TenantInfo = v.InferOutput<typeof TenantInfo>

export async function getTenantInfo() {
	const res = await fetch('/tenantInfo', { credentials: 'include' })
	if (!res.ok) throw new Error(`Tenant load failed: ${res.status}`)
	return v.parse(TenantInfo, await res.json())
}