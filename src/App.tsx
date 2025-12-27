import './index.css'
import { Header } from './components/layout/Header'
import { Home } from './components/layout/Home'
import { ToolPage } from './components/ToolPage'
import { Footer } from './components/layout/Footer'
import { About } from './components/About'
import { GlobalSearch } from './components/shared/GlobalSearch'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <GlobalSearch />
      <Header />
      <main className="flex-1 w-full max-w-screen-2xl mx-auto p-3 sm:p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tool/:id" element={<ToolPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
