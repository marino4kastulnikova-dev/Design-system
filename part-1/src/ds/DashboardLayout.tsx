// BaaS design system — DashboardLayout. Source: Figma page "dashboard-layout", component "DashboardLayout" (383:1457).
// Portal implementation, pending developer validation. Figma: a template; "component with slots (sidebar, header, content)".
import type { ReactNode } from 'react';

export function DashboardLayout({ sidebar, header, children }: { sidebar: ReactNode; header?: ReactNode; children?: ReactNode }) {
  return (
    <div className="baas-dashboard">
      {sidebar}
      <main className="baas-dashboard__content">
        {header ?? <div className="baas-dashboard__slot">Slot — page header</div>}
        {children ?? <div className="baas-dashboard__slot">Slot — page content</div>}
      </main>
    </div>
  );
}
