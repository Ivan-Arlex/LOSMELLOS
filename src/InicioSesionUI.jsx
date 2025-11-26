import React, { useState } from 'react';
import './InicioSesionUI.css';

// ¡ACTUALIZACIÓN! Importa el logo
import logoMellos from './assets/logo-los-mellos-360.jpg'; 
// Si tu logo se llama 'logo.png', usa:
// import logoMellos from './assets/logo.png'; 

function InicioSesionUI({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

   const handleSubmit = (e) => {
    e.preventDefault();
    
    // --- LÓGICA DE VALIDACIÓN (Simulada) ---
    // Simulación: Si ambos campos tienen texto, consideramos el login exitoso.
    if (usuario.length > 0 && contrasena.length > 0) {
        
        // ¡CLAVE! Pulsa el botón del Padre para cambiar la vista
        onLoginSuccess(); 

    } else {
        console.error('Por favor, ingresa usuario y contraseña.');
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
          {/* ¡ACTUALIZACIÓN! Ahora usamos la etiqueta de imagen */}
          <img src={logoMellos} alt="Los Mellos 360° Logo" className="logo-img" />
          
          {/* EL PLACEHOLDER DE TEXTO YA NO ES NECESARIO */}
          {/* <div className="logo-placeholder">
            <span className="logo-text">LM 360</span>
          </div> */}

          <p className="logo-description">LOS MELLOS 360 <br/> SOFTWARE EMPRESARIAL</p>
        </div>

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