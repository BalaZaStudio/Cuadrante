import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Evento {
  id: string
  empleado: string
  fecha: string
  tipo: 'X' | 'G' | 'C' | 'V' | 'B'
}

interface Empleado {
  id: number
  nombre: string
  puesto: string
}

const tiposEvento = {
  X: { nombre: 'Ausencia', color: 'bg-red-500' },
  G: { nombre: 'Guardia', color: 'bg-blue-500' },
  C: { nombre: 'Cambio', color: 'bg-yellow-500' },
  V: { nombre: 'Vacaciones', color: 'bg-green-500' },
  B: { nombre: 'Baja', color: 'bg-purple-500' },
}

const Calendario: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [fechaActual, setFechaActual] = useState(new Date())
  const [menuContextual, setMenuContextual] = useState<{ x: number; y: number; empleado: string; fecha: Date } | null>(null)

  useEffect(() => {
    const eventosGuardados = localStorage.getItem('eventos')
    if (eventosGuardados) {
      setEventos(JSON.parse(eventosGuardados))
    }

    const empleadosGuardados = localStorage.getItem('empleados')
    if (empleadosGuardados) {
      setEmpleados(JSON.parse(empleadosGuardados))
    }
  }, [])

  const guardarEventos = (nuevosEventos: Evento[]) => {
    setEventos(nuevosEventos)
    localStorage.setItem('eventos', JSON.stringify(nuevosEventos))
  }

  const agregarEvento = (tipo: 'X' | 'G' | 'C' | 'V' | 'B') => {
    if (menuContextual) {
      const nuevoEvento = {
        id: Date.now().toString(),
        empleado: menuContextual.empleado,
        fecha: menuContextual.fecha.toISOString().split('T')[0],
        tipo
      }
      guardarEventos([...eventos, nuevoEvento])
      setMenuContextual(null)
    }
  }

  const eliminarEvento = (id: string) => {
    guardarEventos(eventos.filter(evento => evento.id !== id))
  }

  const diasEnMes = (fecha: Date) => {
    return new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate()
  }

  const cambiarMes = (incremento: number) => {
    setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + incremento, 1))
  }

  const handleContextMenu = (e: React.MouseEvent, empleado: string, fecha: Date) => {
    e.preventDefault()
    setMenuContextual({ x: e.clientX, y: e.clientY, empleado, fecha })
  }

  const getEventosDelDia = (empleado: string, fecha: Date) => {
    return eventos.filter(
      e => e.empleado === empleado && new Date(e.fecha).toDateString() === fecha.toDateString()
    )
  }

  return (
    <div className="max-w-full mx-auto overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Calendario de Eventos</h2>
      <div className="mb-4 flex justify-between items-center">
        <button onClick={() => cambiarMes(-1)} className="p-2 bg-gray-200 rounded">
          <ChevronLeft />
        </button>
        <span className="font-bold text-xl">
          {fechaActual.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={() => cambiarMes(1)} className="p-2 bg-gray-200 rounded">
          <ChevronRight />
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Empleado</th>
            {Array.from({ length: diasEnMes(fechaActual) }, (_, i) => (
              <th key={i} className="border p-2">{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {empleados.map(empleado => (
            <tr key={empleado.id}>
              <td className="border p-2 font-bold">{empleado.nombre}</td>
              {Array.from({ length: diasEnMes(fechaActual) }, (_, i) => {
                const fecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), i + 1)
                const eventosDelDia = getEventosDelDia(empleado.nombre, fecha)
                return (
                  <td
                    key={i}
                    className="border p-2 h-16 w-16 relative"
                    onContextMenu={(e) => handleContextMenu(e, empleado.nombre, fecha)}
                  >
                    {eventosDelDia.map(evento => (
                      <div
                        key={evento.id}
                        className={`${tiposEvento[evento.tipo].color} text-white p-1 mb-1 rounded text-xs flex justify-between items-center`}
                      >
                        <span>{evento.tipo}</span>
                        <button onClick={() => eliminarEvento(evento.id)} className="text-xs bg-red-700 px-1 rounded ml-1">
                          X
                        </button>
                      </div>
                    ))}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {menuContextual && (
        <div
          className="absolute bg-white border shadow-lg rounded p-2"
          style={{ top: menuContextual.y, left: menuContextual.x }}
        >
          {Object.entries(tiposEvento).map(([key, { nombre }]) => (
            <button
              key={key}
              onClick={() => agregarEvento(key as 'X' | 'G' | 'C' | 'V' | 'B')}
              className={`block w-full text-left p-1 hover:bg-gray-100 ${tiposEvento[key as 'X' | 'G' | 'C' | 'V' | 'B'].color} text-white mb-1 rounded`}
            >
              {nombre}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Calendario