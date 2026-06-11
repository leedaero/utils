import { useState, useRef } from 'react'
import EncoderTab from './EncoderTab'

export default function Base64Tab() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const encode = () => {
    try {
      const bytes = new TextEncoder().encode(input)
      const binary = Array.from(bytes).map(b => String.fromCharCode(b)).join('')
      setOutput(btoa(binary))
      setError(null)
    } catch {
      setError('Encoding failed')
    }
  }

  const decode = () => {
    try {
      const binary = atob(input)
      const bytes = new Uint8Array(binary.length).map((_, i) => binary.charCodeAt(i))
      setOutput(new TextDecoder().decode(bytes))
      setError(null)
    } catch {
      setError('Invalid Base64 string')
    }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const b64 = (reader.result as string).split(',')[1]
      setOutput(b64)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  return (
    <EncoderTab
      input={input}
      output={output}
      error={error}
      onInputChange={v => { setInput(v); setOutput(''); setError(null) }}
      onEncode={encode}
      onDecode={decode}
      extra={
        <>
          <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />
          <button
            onClick={() => fileRef.current?.click()}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            File → Base64
          </button>
        </>
      }
    />
  )
}
