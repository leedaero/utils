import type { BarcodeFormat } from '@zxing/browser'

export interface ScanResult {
  text: string
  format: BarcodeFormat
  timestamp: number
}
