import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useTheme } from '../../hooks/useTheme'

export default function AppLayout() {
  const { theme, toggle } = useTheme()

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center justify-end px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <button
            onClick={toggle}
            className="text-sm px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === 'dark' ? '☀ Light' : '☾ Dark'}
          </button>
        </header>
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
