import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/Layout/AppLayout'
import JsonViewer from './pages/JsonViewer'
import Calculator from './pages/Calculator'
import Encoder from './pages/Encoder'

const QrScanner = lazy(() => import('./pages/QrScanner'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<JsonViewer />} />
          <Route path="calc" element={<Calculator />} />
          <Route path="encode" element={<Encoder />} />
          <Route
            path="qr"
            element={
              <Suspense fallback={<div className="p-4 text-sm text-gray-400">Loading...</div>}>
                <QrScanner />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
