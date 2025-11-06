import { getTenantInfo} from '@/api/tenantInfo'
import { useSuspenseQuery } from '@tanstack/react-query'

export function TenantBadge() {
 const { data } = useSuspenseQuery({
		queryFn: getTenantInfo,
		queryKey: ['tenantInfo']
	})
  if (!data?.tenantDisplay) return null
  return (
    <span className="text-xs text-gray-500">
      Workspace: <span className="font-mono">{data.tenantDisplay}</span>
      {typeof data.clientCount === 'number' && <> · {data.clientCount} clients</>}
    </span>
  )
}