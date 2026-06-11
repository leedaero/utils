import { useState } from 'react'
import EncoderTab from './EncoderTab'

function encodeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function decodeHtml(str: string): string {
  const txt = document.createElement('textarea')
  txt.innerHTML = str
  return txt.value
}

export default function HtmlEntityTab() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  return (
    <EncoderTab
      input={input}
      output={output}
      error={error}
      onInputChange={v => { setInput(v); setOutput(''); setError(null) }}
      onEncode={() => { setOutput(encodeHtml(input)); setError(null) }}
      onDecode={() => { setOutput(decodeHtml(input)); setError(null) }}
    />
  )
}
