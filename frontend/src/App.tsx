import { Route, Routes } from 'react-router'
import Layout from './pages/Layout'
import Home from './pages/Home'
import About from './pages/About'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}

export default App
