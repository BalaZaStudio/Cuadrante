import React, { useState, useEffect } from 'react'

interface Cambio {
  id: number
  empleado: string
  fechaOriginal: string
  fechaNueva: string
  motivo: string
}

const GestionCambios: React.FC = () => {
  const [cambios, setCambios] = useState<Cambio[]>([])
  const [empleado, setEmpleado] = useState('')
  const [fechaOriginal, setFechaOriginal] = useState('')
  const [fechaNueva, setFechaNueva] = useState('')
  const [motivo, setMotivo] = useState('')

  useEffect(() => {
    const cambiosGuardados = localStorage.getItem('cambios')
    if (cambiosGuardados) {
      setCambios(JSON.parse(cambiosGuardados))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cambios', JSON.stringify(cambios))
  }, [cambios])

  const agregarCambio = () => {
    if (empleado && fechaOriginal && fechaNueva && motivo) {
      setCambios([...cambios, {
        id: Date.now(),
        empleado,
        fechaOriginal,
        fechaNueva,
        motivo
      }])
      setEmpleado('')
      setFechaOriginal('')
      setFechaNueva('')
      setMotivo('')
    }
  }

  const eliminarCambio = (id: number) => {
    setCambios(cambios.filter(cambio => cambio.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Gestión de Cambios</h2>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <input
          type="text"
          value={empleado}
          onChange={(e) => setEmpleado(e.target.value)}
          placeholder="Empleado"
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={fechaOriginal}
          onChange={(e) => setFechaOriginal(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={fechaNueva}
          onChange={(e) => setFechaNueva(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Motivo del cambio"
          className="p-2 border rounded"
        />
        <button onClick={agregarCambio} className="bg-green-500 text-white px-4 py-2 rounded col-span-2">
          Registrar Cambio
        </button>
      </div>
      <ul>
        {cambios.map(cambio => (
          <li key={cambio.id} className="bg-white p-4 mb-2 rounded shadow flex justify-between items-center">
            <div>
              <span className="font-bold">{cambio.empleado}</span>
              <br />
              Fecha original: {cambio.fechaOriginal} → Nueva fecha: {cambio.fechaNueva}
              <br />
              Motivo: {cambio.motivo}
            </div>
            <button onClick={() => eliminarCambio(cambio.id)} className="bg-red-500 text-white px-2 py-1 rounded">
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GestionCambios