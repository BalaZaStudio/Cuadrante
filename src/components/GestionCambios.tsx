import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

// Define el tipo para un evento
interface Evento {
  id: string;
  empleado: string;
  nombreCompleto: string;
  empleo: string;
  fecha: string;
  tipo: string;
}

// Define el tipo para documentosCambios
interface DocumentosCambios {
  [key: string]: File | null; // Ajusta el tipo según lo que necesites
}

// Establece el elemento raíz para el modal
Modal.setAppElement('#root');

const GestionCambios = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [documentosCambios, setDocumentosCambios] = useState<DocumentosCambios>({});
  const [nuevoDocumento, setNuevoDocumento] = useState<File | null>(null); // Estado para almacenar el archivo
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null); // Estado para editar
  const [nuevaFecha, setNuevaFecha] = useState<string>(''); // Estado para la nueva fecha
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false); // Estado para controlar el modal de edición
  const [modalDocumentoIsOpen, setModalDocumentoIsOpen] = useState<boolean>(false); // Estado para el modal del documento
  const [documentoVisualizando, setDocumentoVisualizando] = useState<File | null>(null); // Estado para el documento a visualizar

  // Carga los eventos desde el localStorage al iniciar
  useEffect(() => {
    const eventosGuardados = localStorage.getItem('eventos');
    if (eventosGuardados) {
      setEventos(JSON.parse(eventosGuardados));
    }
  }, []);

  // Filtra solo los eventos de tipo "X"
  const eventosTipoX = eventos.filter(evento => evento.tipo === "X");

  // Función para eliminar un evento
  const eliminarEvento = (id: string) => {
    console.log(`Intentando eliminar el evento con ID: ${id}`);
    setEventos((prevEventos) => {
      const eventosActualizados = prevEventos.filter(evento => evento.id !== id);

      // Actualiza el localStorage
      localStorage.setItem('eventos', JSON.stringify(eventosActualizados));

      return eventosActualizados; // Devuelve el nuevo estado
    });

    // Elimina el documento relacionado, si es necesario
    setDocumentosCambios((prevDocumentos) => {
      const nuevosDocumentos = { ...prevDocumentos };
      delete nuevosDocumentos[id]; // Cambia 'id' a la clave correspondiente del documento
      localStorage.setItem('documentosCambios', JSON.stringify(nuevosDocumentos));
      return nuevosDocumentos;
    });
  };

  // Función para abrir el modal de edición
  const abrirModal = (evento: Evento) => {
    setEventoEditando(evento);
    setNuevaFecha(evento.fecha); // Carga la fecha actual para editar
    setModalIsOpen(true); // Abre el modal de edición
  };

  // Función para cerrar el modal de edición
  const cerrarModal = () => {
    setModalIsOpen(false);
    setEventoEditando(null);
  };

  // Función para abrir el modal de visualización del documento
  const abrirModalDocumento = (id: string) => {
    setDocumentoVisualizando(documentosCambios[id]);
    setModalDocumentoIsOpen(true); // Abre el modal de visualización del documento
  };

  // Función para cerrar el modal de visualización del documento
  const cerrarModalDocumento = () => {
    setModalDocumentoIsOpen(false);
    setDocumentoVisualizando(null);
  };

  // Función para guardar la nueva fecha
  const guardarFecha = () => {
    if (eventoEditando) {
      const eventosActualizados = eventos.map(evento => 
        evento.id === eventoEditando.id ? { ...evento, fecha: nuevaFecha } : evento
      );
      setEventos(eventosActualizados);
      localStorage.setItem('eventos', JSON.stringify(eventosActualizados));
      cerrarModal(); // Cierra el modal
      alert("Fecha actualizada con éxito.");
    }
  };

  // Función para guardar un nuevo documento
  const guardarDocumento = () => {
    if (nuevoDocumento && eventoEditando) {
      const nuevosDocumentos = { ...documentosCambios, [eventoEditando.id]: nuevoDocumento };
      setDocumentosCambios(nuevosDocumentos);
      localStorage.setItem('documentosCambios', JSON.stringify(nuevosDocumentos));
      setNuevoDocumento(null); // Reinicia el estado del documento
      alert("Documento adjuntado con éxito.");
    }
  };

  // Función para manejar el cambio de archivo
  const manejarArchivo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0] || null;
    setNuevoDocumento(archivo);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gestión de Cambios</h1>
      <ul style={styles.eventList}>
        {eventosTipoX.map(evento => (
          <li key={evento.id} style={styles.eventItem}>
            <span style={styles.eventText}>
              {evento.nombreCompleto} - {evento.empleo} - {evento.fecha}
            </span>
            <button style={styles.button} onClick={() => eliminarEvento(evento.id)}>Eliminar</button>
            <button style={styles.button} onClick={() => abrirModal(evento)}>Editar</button>
            <button style={styles.button} onClick={() => abrirModalDocumento(evento.id)}>Ver Documento</button>
          </li>
        ))}
      </ul>

      {/* Modal para editar el evento */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={cerrarModal}
        style={modalStyles}
        contentLabel="Editar Evento"
      >
        <h2 style={styles.editTitle}>Editar Evento: {eventoEditando?.nombreCompleto}</h2>
        <input
          type="date"
          value={nuevaFecha}
          onChange={(e) => setNuevaFecha(e.target.value)}
          style={styles.dateInput}
        />
        <button style={styles.button} onClick={guardarFecha}>Guardar Fecha</button>
        <h3 style={styles.editSubTitle}>Adjuntar Documento</h3>
        <input type="file" onChange={manejarArchivo} />
        <button style={styles.button} onClick={guardarDocumento}>Guardar Documento</button>
        <button style={styles.button} onClick={cerrarModal}>Cerrar</button>
      </Modal>

      {/* Modal para visualizar el documento */}
      <Modal
        isOpen={modalDocumentoIsOpen}
        onRequestClose={cerrarModalDocumento}
        style={modalStyles}
        contentLabel="Visualizar Documento"
      >
        <h2 style={styles.editTitle}>Documento Adjunto</h2>
        {documentoVisualizando ? (
          <div>
            <h3>{documentoVisualizando.name}</h3>
            <iframe
              src={URL.createObjectURL(documentoVisualizando)}
              style={styles.documentIframe}
              title="Document Viewer"
            />
          </div>
        ) : (
          <p>No hay documento adjunto.</p>
        )}
        <button style={styles.button} onClick={cerrarModalDocumento}>Cerrar</button>
      </Modal>
    </div>
  );
};

// Estilos para el componente
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  eventList: {
    listStyleType: 'none',
    padding: 0,
  },
  eventItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  eventText: {
    flex: 1,
    marginRight: '10px',
  },
  button: {
    padding: '5px 10px',
    marginLeft: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  },
  buttonHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)',
  },
  editSection: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  editTitle: {
    fontSize: '18px',
    marginBottom: '10px',
  },
  editSubTitle: {
    fontSize: '16px',
    marginTop: '15px',
    marginBottom: '10px',
  },
  dateInput: {
    marginRight: '10px',
  },
  documentIframe: {
    width: '100%',
    height: '400px',
    border: 'none',
  },
};

// Estilos para el modal
const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '400px',
  },
};

export default GestionCambios;
