import { useState, useCallback } from 'react'
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite'
import 'react-json-view-lite/dist/index.css'
import CopyButton from '../../components/ui/CopyButton'

function parseJson(text: string): { data: unknown; error: string | null } {
  if (!text.trim()) return { data: null, error: null }
  try {
    return { data: JSON.parse(text), error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export default function JsonViewer() {
  const [input, setInput] = useState('')
  const { data, error } = parseJson(input)

  const prettify = useCallback(() => {
    const { data } = parseJson(input)
    if (data !== null) setInput(JSON.stringify(data, null, 4))
  }, [input])

  const minify = useCallback(() => {
    const { data } = parseJson(input)
    if (data !== null) setInput(JSON.stringify(data))
  }, [input])

  return (
    <div className="flex gap-4 h-full">
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
            <CopyButton text={input} />
          </div>
        </div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
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
            <JsonView
              data={data as object}
              shouldExpandNode={allExpanded}
              style={defaultStyles}
            />
          ) : (
            <span className="text-gray-400 text-sm">
              {error ? 'Invalid JSON' : 'Tree view will appear here'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
