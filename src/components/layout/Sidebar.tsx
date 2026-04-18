import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  KanbanSquare,
  CalendarDays,
  BarChart3,
} from 'lucide-react'
import { cn } from '../../lib/utils'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '首页总览' },
  { to: '/companies', icon: Building2, label: '公司视图' },
  { to: '/applications', icon: Briefcase, label: '岗位列表' },
  { to: '/board', icon: KanbanSquare, label: '宏观看板' },
  { to: '/calendar', icon: CalendarDays, label: '日历' },
  { to: '/gantt', icon: BarChart3, label: '甘特图' },
]

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-surface-elevated">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Briefcase className="h-6 w-6 text-primary mr-3" />
        <span className="text-lg font-heading font-semibold tracking-tight">
          JobTracker
        </span>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-gray-100 hover:text-text'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
