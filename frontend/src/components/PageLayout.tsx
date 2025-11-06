import type { ReactNode } from 'react'
import { Head } from '@/components/Head' // your existing title helper
import { TenantBadge } from '@/components/TenantBadge'


interface PageLayoutProps {
  title: string
  children: ReactNode
}

export function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-200 text-gray-900 flex flex-col">
      <Head title={title} />
      <main className="flex-1 container mx-auto p-6">{children}</main>

      <footer className="text-sm text-gray-500 text-center py-4 flex items-center justify-center gap-3">
        © {new Date().getFullYear()} Christoph Henrici · Spring + React CRUD Demo
        <span className="hidden sm:inline">·</span>
        <TenantBadge />
      </footer>
    </div>
  )
}
