import React, { useState } from 'react';
import './ClientesUI.css';

function ClientesUI({ isOpen, onClose, onRegistrarClienteClick }) {
    if (!isOpen) {
        return null;
    }

    const SubmitRegistrarClick = (e) => {

        e.preventDefault();
        onRegistrarClienteClick();

    }

    const [clientes] = useState([
        { id: 1, nombre: 'Karen Yulisa', apellido: 'Congolino', ciudad: 'Buenaventura', celular: '3105232526', cedula: '76171782' },
        { id: 2, nombre: 'Viviana', apellido: 'Hurtado', ciudad: 'Cali', celular: '3050232655', cedula: '1263673373' },
        { id: 3, nombre: 'Luis David', apellido: 'cabezas', ciudad: 'Cali', celular: '3125469857', cedula: '67745226' },
        { id: 4, nombre: 'Olga Zulay', apellido: 'Riascos', ciudad: 'Cali', celular: '3001234567', cedula: '676276273' },
        { id: 5, nombre: 'Juan', apellido: 'Gómez', ciudad: 'Bogotá', celular: '3209876543', cedula: '67272727' },
        { id: 6, nombre: 'Ana', apellido: 'López', ciudad: 'Medellín', celular: '3114567890', cedula: '715662626' },
        { id: 7, nombre: 'Luz', apellido: 'Riascos', ciudad: 'Barranquilla', celular: '3151122334', cedula: '67272727' },
        { id: 8, nombre: 'Valeria', apellido: 'Valoi', ciudad: 'Cartagena', celular: '3016789012', cedula: '671766226' },
        { id: 9, nombre: 'Jenifer', apellido: 'Buenaventura', ciudad: 'Pereira', celular: '3187654321', cedula: '87877811' },
    ]);

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
                        onClick={onClose}>
                        Imprimir Reporte
                    </button>
                </div>



            </div>{/*modal-content */}


        </div>// modal-backdrop
    );

}

export default ClientesUI;