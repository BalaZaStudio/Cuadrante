import React from 'react'
import { Calendar } from 'lucide-react'

interface PantallaInicioProps {
  onLogin: () => void
}

const PantallaInicio: React.FC<PantallaInicioProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 text-white">
      <div className="text-6xl mb-8">
        <Calendar className="text-white drop-shadow-lg" />
      </div>
      <h1 className="text-4xl font-bold mb-8 font-montserrat drop-shadow-lg">
        Gestion Seguridad RT22
      </h1>
      <button
        onClick={onLogin}
        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 drop-shadow-lg"
      >
        Entrar en la aplicación
      </button>
    </div>
  )
}

export default PantallaInicio
