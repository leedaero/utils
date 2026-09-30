import { useCallback, useRef, useState } from 'react'
import JsonTree from './JsonTree'
import CopyButton from '../../components/ui/CopyButton'

interface Tab {
  id: string
  name: string
  input: string
}

function parseJson(text: string): { data: unknown; error: string | null } {
  if (!text.trim()) return { data: null, error: null }
  try {
    return { data: JSON.parse(text), error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

function createTab(n: number): Tab {
  return { id: `tab-${n}`, name: `JSON ${n}`, input: '' }
}

export default function JsonViewer() {
  const [tabs, setTabs] = useState<Tab[]>([createTab(1)])
  const [activeId, setActiveId] = useState('tab-1')
  const nextNumRef = useRef(2)

  const activeTab = tabs.find(t => t.id === activeId) ?? tabs[0]
  const { data, error } = parseJson(activeTab.input)

  const updateInput = (id: string, input: string) => {
    setTabs(prev => prev.map(t => (t.id === id ? { ...t, input } : t)))
  }

  const addTab = () => {
    const tab = createTab(nextNumRef.current)
    nextNumRef.current += 1
    setTabs(prev => [...prev, tab])
    setActiveId(tab.id)
  }

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const filtered = tabs.filter(t => t.id !== id)
    if (filtered.length > 0) {
      setTabs(filtered)
      if (id === activeId) setActiveId(filtered[filtered.length - 1].id)
      return
    }
    const tab = createTab(nextNumRef.current)
    nextNumRef.current += 1
    setTabs([tab])
    setActiveId(tab.id)
  }

  const prettify = useCallback(() => {
    const { data } = parseJson(activeTab.input)
    if (data !== null) updateInput(activeTab.id, JSON.stringify(data, null, 4))
  }, [activeTab.id, activeTab.input])

  const minify = useCallback(() => {
    const { data } = parseJson(activeTab.input)
    if (data !== null) updateInput(activeTab.id, JSON.stringify(data))
  }, [activeTab.id, activeTab.input])

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 overflow-x-auto shrink-0">
        {tabs.map(t => (
          <div
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={
              `flex items-center gap-2 px-3 py-1.5 text-sm font-medium border-b-2 cursor-pointer whitespace-nowrap transition-colors ` +
              (t.id === activeTab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300')
            }
          >
            <span>{t.name}</span>
            {tabs.length > 1 && (
              <button
                onClick={e => closeTab(t.id, e)}
                className="text-gray-400 hover:text-red-500 leading-none"
                aria-label={`${t.name} 닫기`}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addTab}
          className="px-2 py-1.5 text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          aria-label="새 탭"
        >
          +
        </button>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* 입력 영역 */}
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Input</span>
            <div className="flex gap-2">
              <button
                onClick={prettify}
                className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Prettify
              </button>
              <button
                onClick={minify}
                className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Minify
              </button>
              <CopyButton text={activeTab.input} />
            </div>
          </div>
          <textarea
            value={activeTab.input}
            onChange={e => updateInput(activeTab.id, e.target.value)}
            placeholder="Paste JSON here..."
            className="flex-1 font-mono text-sm p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 resize-none outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && (
            <p className="text-red-500 text-xs font-mono">{error}</p>
          )}
        </div>

        {/* 트리 뷰 영역 */}
        <div className="flex flex-col flex-1 gap-2">
          <span className="text-sm font-medium">Tree View</span>
          <div className="flex-1 overflow-auto rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 font-mono text-sm">
            {data !== null ? (
              <JsonTree data={data} />
            ) : (
              <span className="text-gray-400 text-sm">
                {error ? 'Invalid JSON' : 'Tree view will appear here'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
