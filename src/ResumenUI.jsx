import React, { useState, useEffect } from 'react';
import './ResumenUI.css';


const API_URL = 'http://localhost:3001/api/resumen';

function ResumenUI({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }
  const [resumenData, setResumenData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  // Función para exportar los datos de la tabla a formato CSV (Excel)
const exportToCSV = () => {
    const data = resumenData; 
    const SEPARATOR = ';'; 
    //Verificación inicial de datos
    if (!data || data.length === 0) {
        console.error('No hay datos de resumen de productos para exportar.');
        return;
    }

    //Definición de encabezados
    const headers = ["Cantidad Total", "Empaque", "Producto"];

    //Mapeo y formateo de datos a filas
    const rows = data.map(item => {
        
        //Forzar conversión a número y usar 0 si falla
        const cantidadNumerica = parseFloat(item.cantidad) || 0;
        
        //Aplicar formato y reemplazar el punto decimal por coma
        const cantidadFormateada = cantidadNumerica.toFixed(2).replace('.', ',');
        
        return [
            // Cantidad (Ahora garantizamos que es un número antes de formatear)
            String(cantidadFormateada), 
            // Empaque
            String(item.empaque || ''),
            // Producto (Frutas y Verduras)
            String(item.producto || '')
        ];
    })

    //Construcción del contenido CSV línea por línea
    const csvLines = [];

    //Agregamos la cabecera SIN COMILLAS y usamos el SEPARATOR (;)
    csvLines.push(headers.join(SEPARATOR)); 

    // Agregamos las filas, encerrando cada campo en comillas dobles
    rows.forEach(row => {
        //Usamos el SEPARATOR (;) en el join. 
        // Encerrar en comillas ("") es esencial para manejar textos con espacios.
        csvLines.push(row.map(e => `"${String(e).replace(/"/g, '""')}"`).join(SEPARATOR));
    });

    //Creación del Blob
    const BOM = '\uFEFF'; // Byte Order Mark para forzar UTF-8 en Excel
    const csvContent = BOM + csvLines.join('\n');

    // Usamos 'application/csv' para mayor compatibilidad con Excel
    const blob = new Blob([csvContent], { type: 'application/csv;charset=utf-8;' }); 

    //Crear el enlace de descarga y simular el clic
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Reporte_Resumen_Productos.csv');

    // Ejecutar descarga y limpieza (como lo tenías)
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log("Archivo CSV de Resumen de Productos generado con éxito (separador: ;).");
};
  // Función principal para obtener los datos de la API
  const fetchData = async (retries = 3) => {
    setIsLoading(true);
    setError(null);

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        if (attempt > 0) {
            
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`Error en el servidor (código: ${response.status})`);
        }

        const data = await response.json();
        setResumenData(data);
        setIsLoading(false);
        return; // Éxito
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido al cargar datos.";
        console.error(`Intento ${attempt + 1} fallido:`, err);

        if (attempt === retries - 1) {
            // Último intento fallido
            setError(`Falló la carga después de ${retries} intentos: ${errorMessage}. Verifique la conexión al backend.`);
            setIsLoading(false);
            setResumenData([]);
        }
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  return (
    <div className="modal-backdrop">

      <div className="modal-content">

        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="modal-header">
          <h2>RESUMEN</h2>
        </div>

        <div className="summary-table">
          <div className="table-header-row">
            <div className="header-cell">Cantidad Total</div>
            <div className="header-cell">Empaques</div>
            <div className="header-cell">Frutas y Verduras</div>
          </div>
          <div className="modal-body">
              {resumenData.map((item, index) => (
                <div className="data-row" key={index}>
                  <div className="data-cell">{item.cantidad}</div>
                  <div className="data-cell">{item.empaque}</div>
                  <div className="data-cell">{item.producto}</div>
                </div>
              ))}
            </div>
        </div>

        <div className="modal-footer">
          <button className="print-button" translate="no"
           onClick={exportToCSV}
          >Imprimir Reporte</button>
        </div>

      </div>

    </div>

  );
}

export default ResumenUI;