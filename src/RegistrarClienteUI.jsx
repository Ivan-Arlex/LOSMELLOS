import React, { useState } from 'react';
import './RegistrarClienteUI.css';

import iconoUsuario from './assets/Icono-usuario.jpg';

function RegistrarClienteUI({ isOpen, onClose }) {
    if (!isOpen) {
        return null;
    }

    const [nombre, setnombre] = useState('');
    const [apellido, setapellido] = useState('');
    const [ciudad, setciudad] = useState('');
    const [celular, setcelular] = useState('');
    const [cedula, setcedula] = useState('');


    const handleSubmit = (e) => {

        e.preventDefault();


        // --- 1. Lógica de Validación (Ahora con acceso directo a las variables) ---
        if (
            nombre.trim().length > 0 &&
            apellido.trim().length > 0 &&
            celular.trim().length > 0 &&
            cedula.trim().length > 0
        ) {

            // Crear el objeto final de datos para enviar o procesar
            const datosFinales = { nombre, apellido, ciudad, celular, cedula };

            console.log('✅ Cliente a registrar:', datosFinales);
            alert('✅ ¡Cliente registrado correctamente!');

            setnombre('');
            setapellido('');
            setciudad('');
            setcelular('');
            setcedula('');

            onClose();

        } else {
            alert('⚠️ Faltan campos obligatorios por llenar.');
        }
    };

    return (
        <div className="modal-backdrop">

            <div className="modal-content">

                
                <button className="close-button" onClick={onClose}>&times;</button>
                <div className="modal-header">
                    <h2>Registro Cliente</h2>
                </div>

                <div className='modal-body'>

                    <form onSubmit={handleSubmit} className='registro-form'>

                        <div className='columna-izquierda'>

                            {/* Icono de Usuario (Imagen) */}
                            <div className='icono-usuario-container'>
                                <img src={iconoUsuario} alt="Icono de Usuario" className="icono-usuario-img" />
                            </div>

                            <button
                                className='btn-agregar-cliente'
                                onClick={handleSubmit}>
                                Agregar Cliente
                            </button>
                        </div>
                        <div className='columna-derecha'>

                            <div className='campo-input'>
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={nombre}
                                    onChange={(e) => setnombre(e.target.value)}
                                    required
                                />
                            </div>

                            <div className='campo-input'>
                                <input
                                    type="text"
                                    placeholder="Apellido"
                                    value={apellido}
                                    onChange={(e) => setapellido(e.target.value)}
                                    required
                                />
                            </div>

                            <div className='campo-input'>
                                <input
                                    type="text"
                                    placeholder="Ciudad"
                                    value={ciudad}
                                    onChange={(e) => setciudad(e.target.value)}
                                />
                            </div>

                            <div className='campo-input'>
                                <input
                                    type="text"
                                    placeholder="Celular"
                                    value={celular}
                                    onChange={(e) => setcelular(e.target.value)}
                                    required
                                />
                            </div>

                            <div className='campo-input'>
                                <input
                                    type="text"
                                    placeholder="Cédula"
                                    value={cedula}
                                    onChange={(e) => setcedula(e.target.value)}
                                    required
                                />
                            </div>

                        </div>

                    </form>

                </div>


            </div>{/*"modal-content"*/}

        </div>
    );
}

export default RegistrarClienteUI;