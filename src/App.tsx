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
      <main style={{ padding: 'var(--spacing-lg)', maxWidth: '1400px', margin: '0 auto', width: '100%', flex: 1 }}>
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
