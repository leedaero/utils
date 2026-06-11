import CopyButton from '../../components/ui/CopyButton'

interface Props {
  inputLabel?: string
  outputLabel?: string
  input: string
  output: string
  error: string | null
  onInputChange: (v: string) => void
  onEncode: () => void
  onDecode: () => void
  extra?: React.ReactNode
}

export default function EncoderTab({
  inputLabel = 'Input',
  outputLabel = 'Output',
  input,
  output,
  error,
  onInputChange,
  onEncode,
  onDecode,
  extra,
}: Props) {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">{inputLabel}</label>
        <textarea
          value={input}
          onChange={e => onInputChange(e.target.value)}
          rows={6}
          className="font-mono text-sm p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 resize-none outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <button
          onClick={onEncode}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Encode
        </button>
        <button
          onClick={onDecode}
          className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
        >
          Decode
        </button>
        {extra}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{outputLabel}</label>
          <CopyButton text={output} />
        </div>
        <textarea
          value={output}
          readOnly
          rows={6}
          className="font-mono text-sm p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 resize-none outline-none"
        />
      </div>
    </div>
  )
}
