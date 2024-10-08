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
  G: { nombre: 'G', color: 'bg-red-800' },
  X: { nombre: 'C', color: 'bg-yellow-800' },
  V: { nombre: 'V', color: 'bg-green-800' },
  B: { nombre: 'B', color: 'bg-purple-800' },
};

const Calendario: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [menuContextual, setMenuContextual] = useState<{ x: number; y: number; empleado: string; fecha: Date } | null>(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
  const [filaActiva, setFilaActiva] = useState<number | null>(null);
  const [columnaActiva, setColumnaActiva] = useState<number | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

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

    const menuWidth = 200;
    const menuX = e.clientX - menuWidth + 100;
    const menuY = e.clientY;

    const adjustedX = menuX < 0 ? 0 : menuX;

    setMenuContextual({ x: adjustedX, y: menuY, empleado, fecha });

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
    <div className="flex flex-col items-center mx+1 p-1" style={{ maxWidth: '1900px', width: '100%' }}>
      <h2 className="text-lg font-bold mb-2 font-montserrat ml-1 text-center">Cuadrante Seguridad RT22</h2>
      <div className="mb-2 flex justify-between items-center ml-1 w-full">
        <button onClick={() => cambiarMes(-1)} className="p-4 bg-gray-300 rounded shadow-md hover:bg-gray-400 transform active:scale-95 transition-transform duration-150">
          <ChevronLeft size={20} />
        </button>
        <span className="font-bold text-base font-montserrat text-center">
          {fechaActual.toLocaleString('default', { month: 'long', year: 'numeric' })
            .replace(/\b\w/g, char => char.toUpperCase()) // Capitaliza la primera letra de cada palabra
            .replace(/de /gi, '') // Elimina "de" de la cadena
          }
        </span>
        <button onClick={() => cambiarMes(1)} className="p-5 bg-gray-300 rounded shadow-md hover:bg-gray-400 transform active:scale-95 transition-transform duration-150">
          <ChevronRight size={10} />
        </button>
      </div>

      <div className="flex-grow overflow-hidden min-w-full">
        <table className="min-w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border border-black p+2 text-xs" style={{ width: '100px', height: '30px' }}>Personal</th>
              {Array.from({ length: diasEnMes(fechaActual) }, (_, i) => {
                const fecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), i + 1);
                return (
                  <th
                    key={i}
                    className={`border border-black text-center ${esFinDeSemana(fecha) ? 'bg-gray-300' : ''}`}
                    style={{ width: '8px', height: '20px' }} // Ajusta el tamaño de las celdas
                  >
                    {`${i + 1} (${obtenerDiaSemana(fecha).slice(0, 3)})`}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado, empleadoIndex) => (
              <tr
                key={empleado.id}
                className={`${empleado.puesto === 'Comandante' ? 'bg-green-100' : empleado.puesto === 'Camaras' ? 'bg-yellow-100' : ''}`}
                onMouseEnter={() => setFilaActiva(empleadoIndex)}
                onMouseLeave={() => setFilaActiva(null)}
              >
                <td className="border border-black p-1" style={{ width: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {`${empleado.empleo} ${empleado.apellidos}`}
                </td>
                {Array.from({ length: diasEnMes(fechaActual) }, (_, i) => {
                  const fecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), i + 1);
                  const eventosDelDia = getEventosDelDia(empleado.nombre, fecha);
                  const esCeldaActiva = filaActiva === empleadoIndex && columnaActiva === i;

                  return (
                    <td
                      key={i}
                      className={`border border-black relative ${esFinDeSemana(fecha) ? 'bg-gray-300' : ''} ${esCeldaActiva ? 'bg-yellow-400' : columnaActiva === i ? 'bg-yellow-200' : ''} ${filaActiva === empleadoIndex ? 'bg-yellow-200' : ''}`}
                      onMouseEnter={() => setColumnaActiva(i)}
                      onMouseLeave={() => setColumnaActiva(null)}
                      onContextMenu={(e) => handleContextMenu(e, empleado.nombre, fecha)}
                      style={{ width: '8px', height: '10px' }} // Ajusta el tamaño de las celdas
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
          className="absolute z-10 bg-white border border-gray-300 rounded shadow-md"
          style={{ left: menuContextual.x, top: menuContextual.y }}
        >
          <div className="p-2">
            <h4 className="text-m font-bold">Opciones:</h4>
            {eventoSeleccionado ? (
              <div className="flex flex-col items-start">
                <button onClick={() => eliminarEvento(eventoSeleccionado.id)} className="text-red-500">Eliminar</button>
              </div>
            ) : (
              <div className="flex flex-col">
                <button onClick={() => agregarEvento('G')} className="mb-2 text-red-500">Guardia</button>
                <button onClick={() => agregarEvento('X')} className="mb-2 text-yellow-500">Cambio</button>
                <button onClick={() => agregarEvento('V')} className="mb-2 text-green-500">Vacaciones</button>
                <button onClick={() => agregarEvento('B')} className="text-purple-500">Baja</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;