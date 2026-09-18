import { useEffect, useRef, useState } from 'react'
import { BrowserCodeReader } from '@zxing/browser'
import { decodeCanvas } from './decode'
import type { ScanResult } from './types'

const SCAN_INTERVAL_MS = 300

export default function CameraTab({ onDetect }: { onDetect: (result: ScanResult) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<number | null>(null)
  const lastRef = useRef<{ text: string; at: number }>({ text: '', at: 0 })

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [deviceId, setDeviceId] = useState<string>('')
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    BrowserCodeReader.listVideoInputDevices()
      .then(list => {
        setDevices(list)
        if (list.length > 0) setDeviceId(list[0].deviceId)
      })
      .catch(() => setError('카메라 목록을 불러올 수 없습니다.'))

    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current)
      streamRef.current?.getTracks().forEach(track => track.stop())
    }
  }, [])

  const scanFrame = () => {
    const video = videoRef.current
    if (!video || video.readyState < video.HAVE_CURRENT_DATA) return

    if (!canvasRef.current) canvasRef.current = document.createElement('canvas')
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const result = decodeCanvas(canvas)
    if (!result) return

    const now = Date.now()
    if (result.text === lastRef.current.text && now - lastRef.current.at < 2000) return
    lastRef.current = { text: result.text, at: now }
    onDetect(result)
  }

  const start = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: 'environment' },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      intervalRef.current = window.setInterval(scanFrame, SCAN_INTERVAL_MS)
      setRunning(true)
    } catch {
      setError('카메라에 접근할 수 없습니다. 권한을 확인해주세요.')
    }
  }

  const stop = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setRunning(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <select
          value={deviceId}
          onChange={e => setDeviceId(e.target.value)}
          disabled={running}
          className="flex-1 text-sm px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {devices.length === 0 && <option value="">카메라를 찾을 수 없음</option>}
          {devices.map(d => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label || `카메라 ${d.deviceId.slice(0, 6)}`}
            </option>
          ))}
        </select>
        {running ? (
          <button
            onClick={stop}
            className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
          >
            중지
          </button>
        ) : (
          <button
            onClick={start}
            className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            스캔 시작
          </button>
        )}
      </div>

      <div className="relative aspect-video rounded border border-gray-300 dark:border-gray-600 bg-black overflow-hidden">
        <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
        {!running && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
            스캔 시작을 눌러 카메라를 켜주세요
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
