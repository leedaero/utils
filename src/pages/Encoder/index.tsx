import { useState } from 'react'
import Base64Tab from './Base64Tab'
import UrlTab from './UrlTab'
import HtmlEntityTab from './HtmlEntityTab'
import JwtTab from './JwtTab'

const TABS = ['Base64', 'URL', 'HTML Entity', 'JWT'] as const
type Tab = typeof TABS[number]

const COMPONENTS: Record<Tab, React.ComponentType> = {
  Base64: Base64Tab,
  URL: UrlTab,
  'HTML Entity': HtmlEntityTab,
  JWT: JwtTab,
}

export default function Encoder() {
  const [active, setActive] = useState<Tab>('Base64')
  const Component = COMPONENTS[active]

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={
              `px-4 py-2 text-sm font-medium border-b-2 transition-colors ` +
              (active === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300')
            }
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex-1">
        <Component />
      </div>
    </div>
  )
}
