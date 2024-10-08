import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Evento {
  id: string;
  empleado: string;
  fecha: string;
  tipo: 'G' | 'X' | 'V' | 'B';
}

interface Empleado {
  id: number;
  nombre: string;
  apellidos: string;
  puesto: string;
  empleo: string;
  fechaAntiguedad: string;
}

const tiposEvento = {
  G: { nombre: 'G', color: 'bg-red-500' },
  X: { nombre: 'C', color: 'bg-yellow-500' },
  V: { nombre: 'V', color: 'bg-green-500' },
  B: { nombre: 'B', color: 'bg-purple-500' },
};

const Calendario: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [menuContextual, setMenuContextual] = useState<{ x: number; y: number; empleado: string; fecha: Date } | null>(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null); // Crear una referencia para el menú contextual

  const prioridadEmpleo: Record<string, number> = {
    'Cabo 1': 1,
    'Cabo': 2,
    'Soldado': 3,
  };

  const ordenarEmpleados = (empleados: Empleado[]) => {
    return empleados.sort((a, b) => {
      const prioridadA = prioridadEmpleo[a.empleo] || 4;
      const prioridadB = prioridadEmpleo[b.empleo] || 4;

      if (prioridadA === prioridadB) {
        return new Date(a.fechaAntiguedad).getTime() - new Date(b.fechaAntiguedad).getTime();
      }
      return prioridadA - prioridadB;
    });
  };

  useEffect(() => {
    const eventosGuardados = localStorage.getItem('eventos');
    if (eventosGuardados) {
      setEventos(JSON.parse(eventosGuardados));
    }

    const empleadosGuardados = localStorage.getItem('empleados');
    if (empleadosGuardados) {
      const empleadosCargados: Empleado[] = JSON.parse(empleadosGuardados);
      setEmpleados(ordenarEmpleados(empleadosCargados));
    }
  }, []);

  useEffect(() => {
    // Cerrar el menú contextual al hacer clic fuera de él
    const handleClickOutside = (event: MouseEvent) => {
      if (menuContextual && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuContextual(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuContextual]);

  const guardarEventos = (nuevosEventos: Evento[]) => {
    setEventos(nuevosEventos);
    localStorage.setItem('eventos', JSON.stringify(nuevosEventos));
  };

  const agregarEvento = (tipo: 'G' | 'X' | 'V' | 'B') => {
    if (menuContextual) {
      const fechaStr = menuContextual.fecha.toISOString().split('T')[0];
      const eventoExistente = eventos.find(e => e.empleado === menuContextual.empleado && e.fecha === fechaStr);

      // Solo permitir un evento por día
      if (!eventoExistente) {
        const nuevoEvento: Evento = {
          id: Date.now().toString(),
          empleado: menuContextual.empleado,
          fecha: fechaStr,
          tipo,
        };
        guardarEventos([...eventos, nuevoEvento]);
      }
      setMenuContextual(null);
    }
  };

  const eliminarEvento = (id: string) => {
    guardarEventos(eventos.filter(evento => evento.id !== id));
  };

  const diasEnMes = (fecha: Date) => {
    return new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
  };

  const cambiarMes = (incremento: number) => {
    setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + incremento, 1));
  };

  const handleContextMenu = (e: React.MouseEvent, empleado: string, fecha: Date) => {
    e.preventDefault();
    setMenuContextual({ x: e.clientX, y: e.clientY, empleado, fecha });

    // Obtener el evento correspondiente al empleado y fecha
    const fechaStr = fecha.toISOString().split('T')[0];
    const evento = eventos.find(e => e.empleado === empleado && e.fecha === fechaStr);
    setEventoSeleccionado(evento || null);
  };

  const getEventosDelDia = (empleado: string, fecha: Date) => {
    const fechaStr = fecha.toISOString().split('T')[0];
    return eventos.filter(e => e.empleado === empleado && e.fecha === fechaStr);
  };

  const obtenerDiaSemana = (fecha: Date) => {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return diasSemana[fecha.getDay()];
  };

  const esFinDeSemana = (fecha: Date) => {
    const dia = fecha.getDay();
    return dia === 0 || dia === 6;
  };

  return (
    <div className="max-w-full mx-auto overflow-hidden">
      <h2 className="text-lg font-bold mb-2 font-montserrat">Cuadrante Seguridad RT22</h2>
      <div className="mb-2 flex justify-between items-center">
        <button onClick={() => cambiarMes(-1)} className="p-1 bg-gray-300 rounded shadow-md hover:bg-gray-400 transform active:scale-95 transition-transform duration-150">
          <ChevronLeft size={20} />
        </button>
        <span className="font-bold text-base font-montserrat">
          {fechaActual.toLocaleString('default', { month: 'long', year: 'numeric' })
            .replace(/\b\w/g, char => char.toUpperCase()) // Capitaliza la primera letra de cada palabra
            .replace(/de /gi, '') // Elimina "de" de la cadena
          }
        </span>


        <button onClick={() => cambiarMes(1)} className="p-1 bg-gray-300 rounded shadow-md hover:bg-gray-400 transform active:scale-95 transition-transform duration-150">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-black p-1 text-xs" style={{ width: '50px' }}>Personal</th>
              {Array.from({ length: diasEnMes(fechaActual) }, (_, i) => {
                const fecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), i + 1);
                return (
                  <th
                    key={i}
                    className={`border border-black p-1 text-xs ${esFinDeSemana(fecha) ? 'bg-gray-300' : ''} text-center`}
                    style={{ width: '30px' }}
                  >
                    {`${i + 1} (${obtenerDiaSemana(fecha).slice(0, 3)})`}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {empleados.map(empleado => (
              <tr
                key={empleado.id}
                className={`${empleado.puesto === 'Comandante' ? 'bg-green-100' : empleado.puesto === 'Camaras' ? 'bg-yellow-100' : ''}`}
              >
                <td className="border border-black p-1 text-xs">{`${empleado.empleo} ${empleado.apellidos}`}</td>
                {Array.from({ length: diasEnMes(fechaActual) }, (_, i) => {
                  const fecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), i + 1);
                  const eventosDelDia = getEventosDelDia(empleado.nombre, fecha);
                  return (
                    <td
                      key={i}
                      className={`border border-black p-1 relative text-center ${esFinDeSemana(fecha) ? 'bg-gray-300' : ''}`}
                      style={{ width: '30px', height: '25px' }}
                      onContextMenu={(e) => handleContextMenu(e, empleado.nombre, fecha)}
                    >
                      {eventosDelDia.map(evento => (
                        <div
                          key={evento.id}
                          className={`${tiposEvento[evento.tipo].color} text-white text-xl font-bold`}
                          style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, opacity: 0.75, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                          {tiposEvento[evento.tipo].nombre}
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {menuContextual && (
        <div
          ref={menuRef}
          className="absolute z-10 bg-white border border-red-300 rounded shadow-lg"
          style={{ top: menuContextual.y, left: menuContextual.x }}
        >
          <ul className="p-2">
            <li>
              <button onClick={() => agregarEvento('G')} className="w-full text-left px-2 py-1 hover:bg-gray-100">Guardia</button>
            </li>
            <li>
              <button onClick={() => agregarEvento('X')} className="w-full text-left px-2 py-1 hover:bg-gray-100">Cambio</button>
            </li>
            <li>
              <button onClick={() => agregarEvento('V')} className="w-full text-left px-2 py-1 hover:bg-gray-100">Vacaciones</button>
            </li>
            <li>
              <button onClick={() => agregarEvento('B')} className="w-full text-left px-2 py-1 hover:bg-gray-100">Baja</button>
            </li>
            {eventoSeleccionado && (
              <li>
                <button onClick={() => eliminarEvento(eventoSeleccionado.id)} className="w-full text-left text-red-500 hover:bg-red-100">Eliminar Evento</button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Calendario;
