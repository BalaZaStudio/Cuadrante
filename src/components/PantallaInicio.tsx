import React from 'react'
import { Calendar } from 'lucide-react'

interface PantallaInicioProps {
  onLogin: () => void
}

const PantallaInicio: React.FC<PantallaInicioProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-6xl text-blue-600 mb-8">
        <Calendar />
      </div>
      <h1 className="text-4xl font-bold mb-8">Gestión de Personal y Horarios</h1>
      <button
        onClick={onLogin}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Entrar en la aplicación
      </button>
    </div>
  )
}

export default PantallaInicio