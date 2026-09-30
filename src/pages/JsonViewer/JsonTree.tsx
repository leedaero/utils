import { useState } from 'react'

type Entry = [label: string, value: unknown]
type Container = { entries: Entry[]; open: string; close: string }

function tryParseNestedJson(value: string): unknown {
  const trimmed = value.trim()
  if (!trimmed || (trimmed[0] !== '{' && trimmed[0] !== '[')) return undefined
  try {
    const parsed = JSON.parse(trimmed)
    return parsed !== null && typeof parsed === 'object' ? parsed : undefined
  } catch {
    return undefined
  }
}

function containerOf(value: unknown): Container | null {
  if (Array.isArray(value)) {
    return { entries: value.map((v, i) => [String(i + 1), v] as Entry), open: '[', close: ']' }
  }
  if (value !== null && typeof value === 'object') {
    return { entries: Object.entries(value as Record<string, unknown>), open: '{', close: '}' }
  }
  return null
}

function PrimitiveValue({ value }: { value: unknown }) {
  if (value === null) return <span className="text-gray-400 italic">null</span>
  if (typeof value === 'boolean') return <span className="text-purple-600 dark:text-purple-400">{String(value)}</span>
  if (typeof value === 'number') return <span className="text-orange-600 dark:text-orange-400">{value}</span>
  return <span className="text-green-700 dark:text-green-400">&quot;{value as string}&quot;</span>
}

function JsonNode({ label, value, isLast }: { label?: string; value: unknown; isLast: boolean }) {
  const [expanded, setExpanded] = useState(true)

  const container = containerOf(value)
  const nestedFromString = container === null && typeof value === 'string' ? tryParseNestedJson(value) : undefined
  const nestedContainer = nestedFromString !== undefined ? containerOf(nestedFromString) : null
  const effective = container ?? nestedContainer

  if (!effective) {
    return (
      <div className="py-0.5">
        {label !== undefined && <span className="text-blue-600 dark:text-blue-400">{label}: </span>}
        <PrimitiveValue value={value} />
        {!isLast && <span className="text-gray-400">,</span>}
      </div>
    )
  }

  const { entries, open, close } = effective
  const count = entries.length

  const isEmpty = count === 0
  const showChildren = expanded && !isEmpty

  return (
    <div>
      <div
        className={
          'py-0.5 select-none rounded ' +
          (isEmpty ? '' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40')
        }
        onClick={isEmpty ? undefined : () => setExpanded(e => !e)}
      >
        <span className="inline-block w-3 text-gray-400">{isEmpty ? '' : expanded ? '▾' : '▸'}</span>
        {label !== undefined && <span className="text-blue-600 dark:text-blue-400">{label}: </span>}
        {nestedContainer && (
          <span className="mr-1 text-[10px] px-1 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 align-middle">
            JSON
          </span>
        )}
        <span className="text-gray-500">{open}</span>
        {!showChildren && (
          <>
            {!isEmpty && <span className="text-gray-400 text-xs"> …{count} </span>}
            <span className="text-gray-500">{close}</span>
            {!isLast && <span className="text-gray-400">,</span>}
          </>
        )}
      </div>
      {showChildren && (
        <div className="ml-1.5 pl-3 border-l border-gray-200 dark:border-gray-700">
          {entries.map(([k, v], i) => (
            <JsonNode key={k + i} label={k} value={v} isLast={i === entries.length - 1} />
          ))}
        </div>
      )}
      {showChildren && (
        <div className="py-0.5">
          <span className="text-gray-500">{close}</span>
          {!isLast && <span className="text-gray-400">,</span>}
        </div>
      )}
    </div>
  )
}

export default function JsonTree({ data }: { data: unknown }) {
  return (
    <div className="font-mono text-sm">
      <JsonNode value={data} isLast />
    </div>
  )
}
