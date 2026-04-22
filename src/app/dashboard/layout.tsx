import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100dvh-64px)]">
      {/* Sidebar — desktop only */}
      <DashboardSidebar />

      {/* Main content */}
      <main className="flex-1 bg-ui-bg overflow-y-auto px-4 sm:px-8 py-5 sm:py-8 pb-28 sm:pb-8">
        {children}
      </main>

      {/* Bottom nav — mobile only */}
      <MobileBottomNav />
    </div>
  )
}
