import { useState } from 'react'
import EncoderTab from './EncoderTab'

export default function UrlTab() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const encode = () => {
    try {
      setOutput(encodeURIComponent(input))
      setError(null)
    } catch {
      setError('Encoding failed')
    }
  }

  const decode = () => {
    try {
      setOutput(decodeURIComponent(input))
      setError(null)
    } catch {
      setError('Invalid URL-encoded string')
    }
  }

  return (
    <EncoderTab
      input={input}
      output={output}
      error={error}
      onInputChange={v => { setInput(v); setOutput(''); setError(null) }}
      onEncode={encode}
      onDecode={decode}
    />
  )
}
