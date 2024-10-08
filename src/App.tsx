import { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { Calendar, Users, Clock } from 'lucide-react'
import PantallaInicio from './components/PantallaInicio'
import GestionPersonal from './components/GestionPersonal'
import Calendario from './components/Calendario'
import GestionCambios from './components/GestionCambios'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn')
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = () => {
    setIsLoggedIn(true)
    localStorage.setItem('isLoggedIn', 'true')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.setItem('isLoggedIn', 'false')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {isLoggedIn ? (
        <div className="flex flex-col h-screen">
          <nav className="bg-blue-600 text-white p-4">
            <ul className="flex space-x-4 items-center">
              <li>
                <Link to="/personal" className="flex items-center">
                  <Users className="mr-2" /> Personal
                </Link>
              </li>
              <li>
                <Link to="/calendario" className="flex items-center">
                  <Calendar className="mr-2" /> Calendario
                </Link>
              </li>
              <li>
                <Link to="/cambios" className="flex items-center">
                  <Clock className="mr-2" /> Cambios
                </Link>
              </li>
              <li className="ml-auto">
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </nav>
          <main className="flex-grow p-4">
            <Routes>
              <Route path="/" element={<Navigate to="/personal" replace />} />
              <Route path="/personal" element={<GestionPersonal />} />
              <Route path="/calendario" element={<Calendario />} />
              <Route path="/cambios" element={<GestionCambios />} />
            </Routes>
          </main>
        </div>
      ) : (
        <PantallaInicio onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App