import React, { useState, useEffect } from 'react'

interface Empleado {
  id: number
  nombre: string
  puesto: string
}

const GestionPersonal: React.FC = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [nombre, setNombre] = useState('')
  const [puesto, setPuesto] = useState('')
  const [editando, setEditando] = useState<number | null>(null)

  useEffect(() => {
    const empleadosGuardados = localStorage.getItem('empleados')
    if (empleadosGuardados) {
      setEmpleados(JSON.parse(empleadosGuardados))
    }
  }, [])

  const guardarEmpleados = (nuevosEmpleados: Empleado[]) => {
    setEmpleados(nuevosEmpleados)
    localStorage.setItem('empleados', JSON.stringify(nuevosEmpleados))
  }

  const agregarEmpleado = () => {
    if (nombre && puesto) {
      const nuevoEmpleado = { id: Date.now(), nombre, puesto }
      guardarEmpleados([...empleados, nuevoEmpleado])
      setNombre('')
      setPuesto('')
    }
  }

  const eliminarEmpleado = (id: number) => {
    guardarEmpleados(empleados.filter(emp => emp.id !== id))
  }

  const editarEmpleado = (id: number) => {
    const empleado = empleados.find(emp => emp.id === id)
    if (empleado) {
      setNombre(empleado.nombre)
      setPuesto(empleado.puesto)
      setEditando(id)
    }
  }

  const actualizarEmpleado = () => {
    if (editando !== null && nombre && puesto) {
      guardarEmpleados(empleados.map(emp =>
        emp.id === editando ? { ...emp, nombre, puesto } : emp
      ))
      setNombre('')
      setPuesto('')
      setEditando(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Gestión de Personal</h2>
      <div className="mb-4">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          className="mr-2 p-2 border rounded"
        />
        <input
          type="text"
          value={puesto}
          onChange={(e) => setPuesto(e.target.value)}
          placeholder="Puesto"
          className="mr-2 p-2 border rounded"
        />
        {editando === null ? (
          <button onClick={agregarEmpleado} className="bg-green-500 text-white px-4 py-2 rounded">
            Agregar
          </button>
        ) : (
          <button onClick={actualizarEmpleado} className="bg-yellow-500 text-white px-4 py-2 rounded">
            Actualizar
          </button>
        )}
      </div>
      <ul>
        {empleados.map(emp => (
          <li key={emp.id} className="bg-white p-4 mb-2 rounded shadow flex justify-between items-center">
            <div>
              <span className="font-bold">{emp.nombre}</span> - {emp.puesto}
            </div>
            <div>
              <button onClick={() => editarEmpleado(emp.id)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                Editar
              </button>
              <button onClick={() => eliminarEmpleado(emp.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GestionPersonal