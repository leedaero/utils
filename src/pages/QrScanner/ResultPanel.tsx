import { BarcodeFormat } from '@zxing/browser'
import CopyButton from '../../components/ui/CopyButton'
import type { ScanResult } from './types'

function isUrl(text: string) {
  try {
    const u = new URL(text)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

function ResultCard({ result }: { result: ScanResult }) {
  const url = isUrl(result.text)
  return (
    <div className="flex flex-col gap-2 p-3 rounded border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wide text-blue-500">
          {BarcodeFormat[result.format]}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(result.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <p className="text-sm font-mono break-all whitespace-pre-wrap">{result.text}</p>
      <div className="flex gap-2">
        <CopyButton text={result.text} />
        {url && (
          <a
            href={result.text}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            링크 열기
          </a>
        )}
      </div>
    </div>
  )
}

export default function ResultPanel({ history }: { history: ScanResult[] }) {
  return (
    <div className="flex flex-col gap-2 h-full">
      <span className="text-sm font-medium">스캔 결과</span>
      <div className="flex-1 overflow-auto flex flex-col gap-2">
        {history.length === 0 ? (
          <span className="text-sm text-gray-400">아직 인식된 코드가 없습니다.</span>
        ) : (
          history.map((r, i) => <ResultCard key={r.timestamp + '-' + i} result={r} />)
        )}
      </div>
    </div>
  )
}
