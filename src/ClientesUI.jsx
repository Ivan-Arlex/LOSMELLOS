import React, { useState, useEffect } from 'react';
import './ClientesUI.css';

const API_URL = 'http://localhost:3001/api/clientes';

function ClientesUI({ isOpen, onClose, onRegistrarClienteClick }) {
    if (!isOpen) {
        return null;
    }

    // 1. ESTADOS
    const [clientes, setClientes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Función para exportar a Excel (CSV)
    const exportToExcel = (data) => {
        //Verificación inicial de datos
        if (!data || data.length === 0) {
            console.error('No hay datos para exportar.');
            return;
        }
        const SEPARATOR = ';';
        //Definición de encabezados
        const headers = ["Nombre", "Apellido", "Ciudad", "Cédula", "Celular"];

        //Mapeo y formateo de datos a filas
        const rows = data.map(cliente => [
            // Aseguramos que todos los campos sean tratados como Strings
            String(cliente.nombre || ''),
            String(cliente.apellido || ''),
            String(cliente.ciudad || ''),
            String(cliente.cedula || ''),
            String(cliente.celular || cliente.telefono || '')
        ]);

        //Construcción del contenido CSV línea por línea
        const csvLines = [];

        // Agregamos la cabecera
      csvLines.push(headers.join(SEPARATOR));

        // Agregamos las filas, encerrando cada campo en comillas dobles y escapando comillas internas
        rows.forEach(row => {
           csvLines.push(row.map(e => `"${String(e).replace(/"/g, '""')}"`).join(SEPARATOR));
        });

        const BOM = '\uFEFF';
        const csvContent = BOM + csvLines.join('\n');

        //Crear el Blob con el tipo MIME correcto forzando UTF-8
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        //Crear el enlace de descarga y simular el clic
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'Reporte_Clientes.csv');

        //Ejecutar descarga
        document.body.appendChild(link);
        link.click();

        // Limpieza
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log("Archivo CSV generado con éxito (BOM/UTF-8).");
    };

    // Función principal para obtener los datos de la API 
    const fetchClientes = async () => {
        setIsLoading(true);
        setError(null);
        let retries = 0;
        const maxRetries = 3;

        while (retries < maxRetries) {
            try {
                if (retries > 0) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
                }

                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: No se pudo obtener la lista de clientes.`);
                }

                const data = await response.json();
                setClientes(data);
                setIsLoading(false);
                return; // Éxito

            } catch (err) {
                console.error(`Intento ${retries + 1} fallido al conectar con el servidor:`, err);
                retries++;

                if (retries === maxRetries) {
                    setError('Error al cargar clientes después de varios intentos. Verifique que el servidor esté en línea y la ruta API sea correcta.');
                    setClientes([]);
                    setIsLoading(false);
                }
            }
        }
    };

    //Carga los datos al abrir el modal
    useEffect(() => {
        if (isOpen) {
            fetchClientes();
        }
    }, [isOpen]);

    //Manejador del botón "Exportar a Excel"
    const handleExportClick = () => {
        exportToExcel(clientes);
    };

    // Manejador del botón "Agregar Cliente"
    const SubmitRegistrarClick = (e) => {
        e.preventDefault();
        onRegistrarClienteClick();
    }
    return (
        <div className="modal-backdrop">

            <div className="modal-content">

                <button className="close-button" onClick={onClose}>&times;</button>
                <div className="modal-header">
                    <h2>CLIENTES</h2>
                </div>

                <div className='clientes-table-header'>
                    <div className='header-col nombre'>NOMBRE</div>
                    <div className='header-col apellido'>APELLIDO</div>
                    <div className='header-col ciudad'>CIUDAD</div>
                    <div className='header-col celular'>CELULAR</div>
                    <div className='header-col cedula'>CÉDULA</div>
                </div>

                <div className='modal-body'>

                    {clientes.map(cliente => (
                        <div key={cliente.id} className='clientes-table-row'>
                            <div className='row-col nombre'>{cliente.nombre}</div>
                            <div className='row-col apellido'>{cliente.apellido}</div>
                            <div className='row-col ciudad'>{cliente.ciudad}</div>
                            <div className='row-col celular'>{cliente.celular}</div>
                            <div className='row-col cedula'>{cliente.cedula}</div>
                        </div>
                    ))}

                </div>

                <div className='botom'>

                    <button
                        className='btn-registrar-cliente'
                        onClick={SubmitRegistrarClick}>
                        Agregar Cliente
                    </button>

                    <button
                        className='btn-imprimir-reporte'
                        onClick={handleExportClick}>

                        Imprimir Reporte
                    </button>
                </div>



            </div>{/*modal-content */}


        </div>// modal-backdrop
    );

}

export default ClientesUI;