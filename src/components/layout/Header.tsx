import { Bell, Plus } from 'lucide-react'
import { Button } from '../ui/button'

export function Header({ onAddClick }: { onAddClick?: () => void }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface-elevated px-6">
      <h1 className="text-xl font-heading font-semibold">求职申请管理看板</h1>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
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
