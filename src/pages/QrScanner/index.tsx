import { useState } from 'react'
import CameraTab from './CameraTab'
import UploadTab from './UploadTab'
import ResultPanel from './ResultPanel'
import type { ScanResult } from './types'

const TABS = ['카메라', '이미지 업로드'] as const
type Tab = typeof TABS[number]

export default function QrScanner() {
  const [active, setActive] = useState<Tab>('카메라')
  const [history, setHistory] = useState<ScanResult[]>([])

  const handleDetect = (result: ScanResult) => {
    setHistory(prev => [result, ...prev].slice(0, 20))
  }

  return (
    <div className="flex gap-4 h-full">
      <div className="flex flex-col flex-1 gap-4">
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={
                `px-4 py-2 text-sm font-medium border-b-2 transition-colors ` +
                (active === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300')
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {active === '카메라' ? (
          <CameraTab onDetect={handleDetect} />
        ) : (
          <UploadTab onDetect={handleDetect} />
        )}
      </div>

      <div className="w-80 shrink-0">
        <ResultPanel history={history} />
      </div>
    </div>
  )
}
