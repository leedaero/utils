import { NavLink } from 'react-router-dom'

const tools = [
  { path: '/', label: 'JSON Viewer', icon: '{}' },
  { path: '/calc', label: 'Calculator', icon: '±' },
  { path: '/encode', label: 'Encoder', icon: '⇄' },
]

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 h-full bg-gray-900 dark:bg-gray-950 border-r border-gray-700 flex flex-col">
      <div className="px-4 py-5 text-lg font-bold text-white tracking-tight">
        DevUtils
      </div>
      <nav className="flex flex-col gap-1 px-2">
        {tools.map(t => (
          <NavLink
            key={t.path}
            to={t.path}
            end={t.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ` +
              (isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white')
            }
          >
            <span className="font-mono text-base w-5 text-center">{t.icon}</span>
            {t.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
