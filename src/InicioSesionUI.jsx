import React, { useState } from 'react';
import './InicioSesionUI.css';
import logoMellos from './assets/logo-los-mellos-360.jpg';

const API_URL = 'http://localhost:3001';

function InicioSesionUI({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');


  const handleSubmit = async (e) => { 
    e.preventDefault();
    setError(''); // Limpiar errores previos

    // Validación básica de campos vacíos
    if (usuario.length === 0 || contrasena.length === 0) {
      setError('Por favor, ingresa el usuario y la contraseña.');
      return;
    }

    try {
      // --- LÓGICA DE CONEXIÓN CON EL BACKEND (fetch) ---
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usuario: usuario,
          contrasena: contrasena
        }),
      });

      if (response.ok) {
        
        const data = await response.json();

        
        onLoginSuccess({ usuarioId: data.usuarioId, nombre: data.nombre, rol: data.rol});

      } else {
        // El backend respondió 401, 403, 500, etc.
        const errorData = await response.json();
        setError(errorData.error || 'Credenciales inválidas. Intente de nuevo.');
      }

    } catch (err) {
      // Error de conexión (servidor caído o URL incorrecta)
      console.error('Error al conectar con el servidor API:', err);
      setError('Error de conexión con el servidor. Verifique la API.');
    }
  };


  return (
    <div className="login-container">
      {/* SECCIÓN IZQUIERDA (AZUL) */}
      <div className="login-left">
        <h1 className="bienvenidos">Bienvenidos</h1>
        <h2 className="los-mellos">LOS MELLOS</h2>
        <h3 className="tres-sesenta">360°</h3>
        <p className="software">SOFTWARE EMPRESARIAL</p>
      </div>

      {/* SECCIÓN DERECHA (FORMULARIO) */}
      <div className="login-right">

        {/* LOGO Y TÍTULO */}
        <div className="logo-section">
   
          <img src={logoMellos} alt="Los Mellos 360° Logo" className="logo-img" />

          <p className="logo-description">LOS MELLOS 360 <br /> SOFTWARE EMPRESARIAL</p>
        </div>

        {error && (
        <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>
            {error}
        </p>
    )}

        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="form-title">Iniciar Sesión</h2>

          {/* ... (Resto del formulario: Usuario, Contraseña, Checkbox, Botón) ... */}

          {/* CAMPO USUARIO */}
          <div className="input-group">
            <label htmlFor="usuario" className="input-label">
              <span className="icon-user">👤</span> Usuario
            </label>
            <input
              type="text"
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          {/* CAMPO CONTRASEÑA */}
          <div className="input-group">
            <label htmlFor="contrasena" className="input-label">
              <span className="icon-key">🔑</span> Contraseña
            </label>
            <div className="password-wrapper">
              <input
                type={mostrarContrasena ? 'text' : 'password'}
                id="contrasena"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
              >
                {mostrarContrasena ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          {/* CHECKBOX */}
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Mantener la sesión iniciada</label>
          </div>

          {/* BOTÓN */}
          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default InicioSesionUI;