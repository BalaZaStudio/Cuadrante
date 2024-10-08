import React, { useState, useEffect } from 'react'

interface Empleado {
  id: number
  nombre: string
  apellidos: string
  puesto: string
  empleo: 'Cabo 1' | 'Cabo' | 'Soldado' // Especificar las opciones posibles
  fechaAntiguedad: string
}

const GestionPersonal: React.FC = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [puesto, setPuesto] = useState('')
  const [empleo, setEmpleo] = useState<'Cabo 1' | 'Cabo' | 'Soldado' | ''>('') // Especificar el tipo aquí
  const [fechaAntiguedad, setFechaAntiguedad] = useState('')
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
    if (nombre && apellidos && puesto && empleo && fechaAntiguedad) {
      const nuevoEmpleado = { 
        id: Date.now(), 
        nombre, 
        apellidos, 
        puesto, 
        empleo,
        fechaAntiguedad 
      }
      guardarEmpleados([...empleados, nuevoEmpleado])
      setNombre('')
      setApellidos('')
      setPuesto('')
      setEmpleo('')
      setFechaAntiguedad('')
    }
  }

  const eliminarEmpleado = (id: number) => {
    guardarEmpleados(empleados.filter(emp => emp.id !== id))
  }

  const editarEmpleado = (id: number) => {
    const empleado = empleados.find(emp => emp.id === id)
    if (empleado) {
      setNombre(empleado.nombre)
      setApellidos(empleado.apellidos)
      setPuesto(empleado.puesto)
      setEmpleo(empleado.empleo)
      setFechaAntiguedad(empleado.fechaAntiguedad)
      setEditando(id)
    }
  }

  const actualizarEmpleado = () => {
    if (editando !== null && nombre && apellidos && puesto && empleo && fechaAntiguedad) {
      guardarEmpleados(empleados.map(emp =>
        emp.id === editando ? { ...emp, nombre, apellidos, puesto, empleo, fechaAntiguedad } : emp
      ))
      setNombre('')
      setApellidos('')
      setPuesto('')
      setEmpleo('')
      setFechaAntiguedad('')
      setEditando(null)
    }
  }

  const ordenarEmpleados = (empleados: Empleado[]) => {
    const prioridadEmpleo: { [key: string]: number } = { 'Cabo 1': 1, 'Cabo': 2, 'Soldado': 3 }
    return empleados.sort((a, b) => {
      // Comparar prioridad de empleo
      if (prioridadEmpleo[a.empleo] !== prioridadEmpleo[b.empleo]) {
        return prioridadEmpleo[a.empleo] - prioridadEmpleo[b.empleo]
      }
      // Comparar fecha de antigüedad
      return new Date(a.fechaAntiguedad).getTime() - new Date(b.fechaAntiguedad).getTime()
    })
  }

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-100 to-gray-200 p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 font-montserrat">Gestión de Personal</h2>
      <div className="mb-6 flex flex-col sm:flex-row items-center">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          className="mb-2 sm:mb-0 sm:mr-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        <input
          type="text"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
          placeholder="Apellidos"
          className="mb-2 sm:mb-0 sm:mr-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        <select
          value={puesto}
          onChange={(e) => setPuesto(e.target.value)}
          className="mb-2 sm:mb-0 sm:mr-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="">Seleccione puesto</option>
          <option value="Comandante">Comandante</option>
          <option value="Camaras">Camaras</option>
        </select>
        <select
          value={empleo}
          onChange={(e) => setEmpleo(e.target.value as 'Cabo 1' | 'Cabo' | 'Soldado')} // Asegurarse de que el valor sea del tipo correcto
          className="mb-2 sm:mb-0 sm:mr-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="">Seleccione empleo</option>
          <option value="Cabo 1">Cabo 1</option>
          <option value="Cabo">Cabo</option>
          <option value="Soldado">Soldado</option>
        </select>
        <input
          type="date"
          value={fechaAntiguedad}
          onChange={(e) => setFechaAntiguedad(e.target.value)}
          className="mb-2 sm:mb-0 sm:mr-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        {editando === null ? (
          <button onClick={agregarEmpleado} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all">
            Agregar
          </button>
        ) : (
          <button onClick={actualizarEmpleado} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-all">
            Actualizar
          </button>
        )}
      </div>
      <ul>
        {ordenarEmpleados(empleados).map(emp => (
          <li key={emp.id} className="bg-white p-4 mb-2 rounded shadow flex justify-between items-center">
            <div>
              <span className="font-bold">{emp.empleo} {emp.apellidos}</span> - {emp.puesto} - {new Date(emp.fechaAntiguedad).toLocaleDateString()}
            </div>
            <div>
              <button onClick={() => editarEmpleado(emp.id)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600">
                Editar
              </button>
              <button onClick={() => eliminarEmpleado(emp.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
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
