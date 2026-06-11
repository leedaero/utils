import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/Layout/AppLayout'
import JsonViewer from './pages/JsonViewer'
import Calculator from './pages/Calculator'
import Encoder from './pages/Encoder'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<JsonViewer />} />
          <Route path="calc" element={<Calculator />} />
          <Route path="encode" element={<Encoder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
