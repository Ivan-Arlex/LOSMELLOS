import React from 'react';
import './ResumenUI.css';

function ResumenUI({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  const resumenData = [
    { cantidad: 15, empaque: "Cartones", producto: "Mango", cliente: 'Karen'},
    { cantidad: 9, empaque: "Bultos", producto: "Papa", cliente: 'Viviana'},
    { cantidad: 40, empaque: "Bandejas", producto: "Fresa", cliente: 'Luis'},
  ];

  return (
    <div className="modal-backdrop">

      <div className="modal-content">

        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="modal-header">
          <h2>RESUMEN</h2>
        </div>

        <div className="modal-body">
          <div className="summary-table">

            <div className="table-header-row">
              <div className="header-cell">Cantidad</div>
              <div className="header-cell">Empaques</div>
              <div className="header-cell">Frutas y Verduras</div>
              <div className="header-cell">Cliente</div>
            </div>

            {resumenData.map((item, index) => (
              <div className="data-row" key={index}>
                <div className="data-cell">{item.cantidad}</div>
                <div className="data-cell">{item.empaque}</div>
                <div className="data-cell">{item.producto}</div>
                <div className="data-cell">{item.cliente}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="print-button" translate="no">Imprimir Reporte</button>
        </div>

      </div>

    </div>

  );
}

export default ResumenUI;