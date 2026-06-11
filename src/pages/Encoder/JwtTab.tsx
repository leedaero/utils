import { useState } from 'react'
import CopyButton from '../../components/ui/CopyButton'

interface JwtParts {
  header: object
  payload: object
  signature: string
  expiry: string | null
}

function decodeJwt(token: string): JwtParts {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('JWT must have 3 parts')

  const decode = (part: string) => {
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    const padding = (4 - (base64.length % 4)) % 4
    const padded = base64 + '='.repeat(padding)
    const binary = atob(padded)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return JSON.parse(new TextDecoder().decode(bytes))
  }

  const header = decode(parts[0])
  const payload = decode(parts[1])
  const exp = (payload as Record<string, unknown>).exp
  const expiry = exp
    ? new Date(Number(exp) * 1000).toLocaleString()
    : null

  return { header, payload, signature: parts[2], expiry }
}

export default function JwtTab() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<JwtParts | null>(null)
  const [error, setError] = useState<string | null>(null)

  const decode = () => {
    try {
      setResult(decodeJwt(input.trim()))
      setError(null)
    } catch (e) {
      setError((e as Error).message)
      setResult(null)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">JWT Token</label>
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); setResult(null); setError(null) }}
          rows={4}
          placeholder="Paste JWT token here..."
          className="font-mono text-sm p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 resize-none outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={decode}
        className="self-start px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
      >
        Decode
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {result && (
        <div className="flex flex-col gap-3">
          {(['header', 'payload'] as const).map(key => (
            <div key={key} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">{key}</span>
                <CopyButton text={JSON.stringify(result[key], null, 2)} />
              </div>
              <pre className="font-mono text-xs p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 overflow-auto">
                {JSON.stringify(result[key], null, 2)}
              </pre>
            </div>
          ))}
          {result.expiry && (
            <p className="text-sm text-gray-500">
              Expires: <span className="font-medium text-gray-700 dark:text-gray-300">{result.expiry}</span>
            </p>
          )}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Signature</span>
            <code className="font-mono text-xs p-2 rounded bg-gray-100 dark:bg-gray-800 break-all">
              {result.signature}
            </code>
          </div>
        </div>
      )}
    </div>
  )
}
