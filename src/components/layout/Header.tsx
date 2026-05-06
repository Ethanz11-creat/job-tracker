import { Bell, Plus } from 'lucide-react'
import { Button } from '../ui/button'

export function Header({ onAddClick }: { onAddClick?: () => void }) {
  return (
    <header className="flex h-16 items-center justify-between px-6 animate-fade-in"
      style={{
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
      <h1 className="text-xl font-heading">求职申请管理看板</h1>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" strokeWidth={1.5} style={{ color: '#a09b8c' }} />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full" style={{
            background: '#ef4444',
            boxShadow: '0 0 6px rgba(239,68,68,0.4)'
          }} />
        </Button>
        {onAddClick && (
          <Button onClick={onAddClick} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            添加岗位
          </Button>
        )}
      </div>
    </header>
  )
}
