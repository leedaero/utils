import { useRef, useState } from 'react'
import { decodeCanvas } from './decode'
import type { ScanResult } from './types'

export default function UploadTab({ onDetect }: { onDetect: (result: ScanResult) => void }) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const decodeFile = async (file: File) => {
    setError(null)
    const url = URL.createObjectURL(file)
    setPreview(url)
    const img = imgRef.current
    if (!img) return
    img.src = url
    if (!img.complete) {
      await new Promise(resolve => {
        img.onload = resolve
        img.onerror = resolve
      })
    }

    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx || canvas.width === 0) {
      setError('이미지를 디코딩할 수 없습니다.')
      return
    }
    ctx.drawImage(img, 0, 0)

    const result = decodeCanvas(canvas)
    if (result) {
      onDetect(result)
    } else {
      setError('이미지에서 QR/바코드를 찾을 수 없습니다.')
    }
  }

  const handleFile = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일을 선택해주세요.')
      return
    }
    decodeFile(file)
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault()
          setDragging(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
        className={
          `aspect-video rounded border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-colors ` +
          (dragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400')
        }
      >
        {!preview && (
          <span className="text-sm text-gray-400 text-center px-4">
            클릭하거나 이미지를 드래그해서 업로드하세요
          </span>
        )}
        <img
          ref={imgRef}
          alt="업로드한 이미지"
          className={preview ? 'max-w-full max-h-full object-contain' : 'hidden'}
        />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
