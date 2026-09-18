import jsQR from 'jsqr'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { BarcodeFormat, DecodeHintType } from '@zxing/library'
import type { ScanResult } from './types'

const POSSIBLE_FORMATS = [
  BarcodeFormat.QR_CODE,
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
  BarcodeFormat.CODE_93,
  BarcodeFormat.CODABAR,
  BarcodeFormat.ITF,
  BarcodeFormat.DATA_MATRIX,
  BarcodeFormat.PDF_417,
]

const hints = new Map()
hints.set(DecodeHintType.POSSIBLE_FORMATS, POSSIBLE_FORMATS)

// jsQR is used first for QR codes since it is more reliable than @zxing's QR
// detector for common QR sizes; @zxing covers everything else (1D barcodes,
// DataMatrix, PDF417) as a fallback.
const zxingReader = new BrowserMultiFormatReader(hints)

export function decodeCanvas(canvas: HTMLCanvasElement): ScanResult | null {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  const { width, height } = canvas
  if (width === 0 || height === 0) return null

  const imageData = ctx.getImageData(0, 0, width, height)
  const qr = jsQR(imageData.data, width, height)
  if (qr?.data) {
    return { text: qr.data, format: BarcodeFormat.QR_CODE, timestamp: Date.now() }
  }

  try {
    const result = zxingReader.decodeFromCanvas(canvas)
    return { text: result.getText(), format: result.getBarcodeFormat(), timestamp: Date.now() }
  } catch {
    return null
  }
}
