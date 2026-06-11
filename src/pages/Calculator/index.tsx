import { useState, useRef } from 'react'
import { evaluate } from 'mathjs'

interface HistoryItem {
  expr: string
  result: string
}

export default function Calculator() {
  const [expr, setExpr] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const calculate = () => {
    if (!expr.trim()) return
    try {
      const val = evaluate(expr)
      const resultStr = String(val)
      setResult(resultStr)
      setError(null)
      setHistory(prev => [{ expr, result: resultStr }, ...prev].slice(0, 10))
    } catch {
      setError('Invalid expression')
      setResult(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate()
  }

  const reuse = (item: HistoryItem) => {
    setExpr(item.expr)
    setResult(null)
    setError(null)
    inputRef.current?.focus()
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Calculator</h2>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={expr}
          onChange={e => { setExpr(e.target.value); setResult(null); setError(null) }}
          onKeyDown={handleKeyDown}
          placeholder="e.g. (100 + 50) * 1.1"
          className="flex-1 font-mono text-sm px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={calculate}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          =
        </button>
      </div>

      {result !== null && (
        <div className="px-4 py-3 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xl font-bold text-blue-500">
          {result}
        </div>
      )}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {history.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 uppercase tracking-wide">History</span>
          {history.map((item, i) => (
            <button
              key={i}
              onClick={() => reuse(item)}
              className="flex justify-between items-center px-3 py-2 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
            >
              <span className="font-mono text-sm text-gray-600 dark:text-gray-400">{item.expr}</span>
              <span className="font-mono text-sm font-semibold">{item.result}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
