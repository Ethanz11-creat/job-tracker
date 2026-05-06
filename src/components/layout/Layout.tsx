import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div className="flex min-h-screen" style={{ background: '#0a0a0f' }}>
      <Sidebar />
      <main className="ml-[240px] flex-1 p-8 max-w-[1400px] animate-fade-in">
        <Outlet />
      </main>
    </div>
  )
}
