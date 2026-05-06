import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  KanbanSquare,
  CalendarDays,
  BarChart3,
  Search,
  Settings,
  Plus,
} from 'lucide-react'
import { cn } from '../../lib/utils'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '总览' },
  { to: '/companies', icon: Building2, label: '公司' },
  { to: '/applications', icon: Briefcase, label: '岗位' },
  { to: '/board', icon: KanbanSquare, label: '看板' },
  { to: '/calendar', icon: CalendarDays, label: '日历' },
  { to: '/gantt', icon: BarChart3, label: '甘特图' },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[240px] flex flex-col noise-bg"
      style={{ background: 'linear-gradient(180deg, #08080c 0%, #0c0c12 100%)' }}>
      {/* Decorative top line */}
      <div className="h-px w-full" style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.3) 50%, transparent 100%)'
      }} />

      {/* Header */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, rgba(201,169,110,0.2), rgba(201,169,110,0.05))',
              border: '1px solid rgba(201,169,110,0.25)'
            }}>
            <Briefcase className="h-4 w-4" style={{ color: '#c9a96e' }} strokeWidth={1.5} />
            <div className="absolute -inset-[1px] rounded-xl" style={{
              boxShadow: '0 0 12px rgba(201,169,110,0.15) inset'
            }} />
          </div>
          <div>
            <span className="text-[15px] font-heading tracking-wide" style={{ color: '#e8e6e1' }}>求职看板</span>
            <div className="text-[10px] tracking-[0.15em] uppercase font-medium" style={{ color: '#6b6558' }}>JobTracker</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 cursor-pointer group"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#6b6558'
          }}>
          <Search className="h-3.5 w-3.5 transition-colors group-hover:text-[#a09b8c]" strokeWidth={2} />
          <span className="text-xs flex-1">搜索...</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded border font-mono" style={{
            borderColor: 'rgba(255,255,255,0.08)',
            color: '#6b6558',
            background: 'rgba(255,255,255,0.02)'
          }}>⌘K</kbd>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/')
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group',
                isActive
                  ? 'font-medium'
                  : 'hover:text-[#e8e6e1]'
              )}
              style={{
                color: isActive ? '#c9a96e' : '#a09b8c',
                background: isActive ? 'rgba(201,169,110,0.08)' : 'transparent',
                border: isActive ? '1px solid rgba(201,169,110,0.2)' : '1px solid transparent',
              }}
            >
              <item.icon
                className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span className="font-body">{item.label}</span>
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full"
                  style={{ background: '#c9a96e', boxShadow: '0 0 6px rgba(201,169,110,0.5)' }} />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-3 space-y-1" style={{
        borderTop: '1px solid rgba(255,255,255,0.04)'
      }}>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 w-full group"
          style={{ color: '#a09b8c' }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#e8e6e1'
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#a09b8c'
            e.currentTarget.style.background = 'transparent'
          }}>
          <Settings className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" strokeWidth={1.5} />
          <span className="font-body">设置</span>
        </button>
        <button
          onClick={() => navigate('/applications')}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm w-full mt-3 transition-all duration-200 group relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(201,169,110,0.2), rgba(201,169,110,0.1))',
            border: '1px solid rgba(201,169,110,0.25)',
            color: '#c9a96e'
          }}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(201,169,110,0.3), rgba(201,169,110,0.15))'
            }} />
          <Plus className="h-4 w-4 relative z-10 transition-transform duration-200 group-hover:scale-110" strokeWidth={2} />
          <span className="font-body relative z-10">添加岗位</span>
        </button>
      </div>
    </aside>
  )
}
