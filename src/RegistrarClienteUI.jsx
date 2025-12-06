import React, { useState } from 'react';
import './RegistrarClienteUI.css';

import iconoUsuario from './assets/Icono-usuario.jpg';
const API_URL = 'http://localhost:3001/api/clientes';

function RegistrarClienteUI({ isOpen, onClose }) {
    if (!isOpen) {
        return null;
    }

    const [nombre, setnombre] = useState('');
    const [apellido, setapellido] = useState('');
    const [ciudad, setciudad] = useState('');
    const [celular, setcelular] = useState('');
    const [cedula, setcedula] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const clearForm = () => {
        setnombre('');
        setapellido('');
        setciudad('');
        setcelular('');
        setcedula('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validar campos
        if (!nombre.trim() || !apellido.trim() || !celular.trim() || !cedula.trim()) {
            setMessage({ type: 'error', text: '⚠️ Por favor, complete todos los campos obligatorios (Nombre, Apellido, Celular, Cédula).' });
            return;
        }

        // 2. Crear el objeto de datos
        const datosCliente = {
            nombre,
            apellido,
            ciudad,
            celular,
            cedula
        };

        setMessage(null);
        setIsLoading(true);

        try {
            // 3. Llamada a la API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                   
                },
                body: JSON.stringify(datosCliente),
            });

            if (response.ok) {
                // Registro exitoso
                const result = await response.json();
                console.log('Cliente registrado con éxito:', result);
                setMessage({ type: 'success', text: '✅ ¡Cliente registrado correctamente!' });

                // Limpiar formulario y cerrar modal después de un tiempo
                clearForm();
                setTimeout(onClose, 2000);

            } else {
                // Error del servidor (ej. cédula duplicada, error de validación)
                const errorData = await response.json();
                console.error('Error al registrar:', errorData);
                setMessage({ type: 'error', text: errorData.error || '❌ Error al registrar el cliente. Intente de nuevo.' });
            }
        } catch (err) {
            // Error de red (el servidor no responde)
            console.error('Error de conexión:', err);
            setMessage({ type: 'error', text: '🛑 No se pudo conectar al servidor. Verifique la conexión de red.' });
        } finally {
            setIsLoading(false);
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

                    {/*Mensaje de estado (Éxito o Error) */}
                    {message && (
                        <div className={`status-message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='registro-form'>

                        <div className='columna-izquierda'>

                            {/* Icono de Usuario (Imagen) */}
                            <div className='icono-usuario-container'>
                                <img src={iconoUsuario} alt="Icono de Usuario" className="icono-usuario-img" />
                            </div>
                            <button
                                className='btn-agregar-cliente'
                                type="submit"
                                disabled={isLoading}>
                                {isLoading ? 'Registrando...' : 'Agregar Cliente'}
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