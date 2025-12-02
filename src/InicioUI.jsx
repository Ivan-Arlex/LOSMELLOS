import React, { useState } from 'react';
import './InicioUI.css'

// Importa las imágenes
import ciudad from './assets/fondo-principal.jpg'; 
import logoMellos from './assets/logo-los-mellos-360.jpg'; 
import imgVerduras from './assets/productos-frescos-1.jpg'; 
import imgChontaduro from './assets/productos-frescos-2.jpg'; 
import imgFrutas from './assets/productos-frescos-3.jpg';

// Iconos (usando emojis o podrías usar una librería como React Icons)
const IconMenu = () => '☰';
const IconUser = () => '👤';
const IconLocation = () => '📍';
const IconBell = () => '🔔';
const IconCog = () => '⚙️'; 
const IconResumen = () => '📄'; 
const IconRegistrarPedido = () => '📝'; 
const IconClientes = () => '👥'; 
const IconAgregarCliente = () => '➕'; 
const IconSalir = () => '➡️'; 

function InicioUI({  userData, onResumenClick, onRegistrarPedido, onClientesClick, onRegistrarClienteClick, onLogoutClick}) { 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userName = userData?.nombre || "Usuario Desconocido";
  const userRole = userData?.rol || "Rol no asignado";
  const appName = "Los Mellos 360°";
  const locations = ["Buenaventura", "El Charco", "Bahía Solano", "Iscuandé"];

  const handleMenuItemClick = (item) => {
    setIsSidebarOpen(false); // Cierra el menú siempre al hacer clic

   switch (item) {
      case 'Resumen':
        // Llama a la función pasada por App.jsx (Abre el modal)
        if (onResumenClick) onResumenClick();
        break;

      case 'Registrar Pedido':
        if(onRegistrarPedido) onRegistrarPedido();
         break;

      case 'Clientes':
        if(onClientesClick) onClientesClick();
        break;

      case 'Registrar Cliente':
        if(onRegistrarClienteClick) onRegistrarClienteClick();
        break;
      
      case 'Salir':
       // Llama a la función pasada por App.jsx (Cierra sesión)
        if (onLogoutClick) onLogoutClick();
        break;

      default:
        // Comportamiento por defecto para otros botones
       console.log(`Funcionalidad aún no implementada para: ${item}`);
    }
  };

  return (
    <div className="inicio-container">
      {/* BACKGROUND DE CIUDAD */}
      <div className="background-overlay" style={{ backgroundImage: `url(${ciudad})` }}></div>

      {/* BARRA SUPERIOR (NAVBAR) */}
      <nav className="navbar">
        <div className="navbar-left">
          <button className="menu-button" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <IconMenu />
          </button>
          <div className="user-info">
            <IconUser />
            <span>{userName}</span>
            <span className="user-role">{userRole}</span>
          </div>
        </div>
        <div className="navbar-center">
          <span className="navbar-app-name">{appName}</span>
        </div>
        <div className="navbar-right">
          <button className="navbar-icon-button"><IconBell /></button>
          <button className="navbar-icon-button"><IconCog /></button>
        </div>
      </nav>

      {/* SIDEBAR (MENÚ DESPLEGABLE) */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="sidebar-item" onClick={() => handleMenuItemClick('Resumen')}>
          <IconResumen /> Resumen
        </button>
        <button className="sidebar-item" onClick={() => handleMenuItemClick('Registrar Pedido')}>
          <IconRegistrarPedido /> Registrar Pedido
        </button>
        <button className="sidebar-item" onClick={() => handleMenuItemClick('Clientes')}>
          <IconClientes /> Clientes
        </button>
        <button className="sidebar-item" onClick={() => handleMenuItemClick('Registrar Cliente')}>
          <IconAgregarCliente /> Agregar Cliente
        </button>
        <button className="sidebar-item logout-item" onClick={() => handleMenuItemClick('Salir')}>
          <IconSalir /> Salir
        </button>
      </div>

      {/* Contenido Principal */}
      <div className="main-content">
        {/* SECCIÓN DE UBICACIONES */}
        <div className="location-bar">
          {locations.map((loc, index) => (
            <button key={index} className="location-button">
              <IconLocation /> {loc}
            </button>
          ))}
        </div>

        {/* TÍTULOS Y LOGO CENTRAL */}
        <div className="center-section">
          <h1 className="title-left">Frutas y <br/> Verduras</h1>
          <div className="main-logo-container">
            {/* ¡ACTUALIZACIÓN! Usamos el logo en la sección central */}
            <img src={logoMellos} alt="Logo Mellos Grande" className="main-logo" />
            
            {/* EL PLACEHOLDER DE TEXTO YA NO ES NECESARIO */}
            {/* <div className="main-logo-placeholder">LM 360</div> */}
            
            <p className="main-logo-description">{appName} <br/> SOFTWARE EMPRESARIAL</p>
          </div>
          <h1 className="title-right">Todo el Pacífico <br/> Colombiano</h1>
        </div>

        {/* IMÁGENES DE PRODUCTOS */}
        <div className="product-images">
          {/* Los placeholders para las imágenes de productos se manejan en InicioUI.css */}
          <div className="image-card">
            <img src={imgVerduras} alt="Productos Frescos 1" className="product-img-content" />
            </div>
            <div className="image-card">
                <img src={imgChontaduro} alt="Productos Frescos 2" className="product-img-content" />
            </div>
            <div className="image-card">
                <img src={imgFrutas} alt="Productos Frescos 3" className="product-img-content" />
            </div>
        </div>
      </div>
    </div>
  );
}

export default InicioUI;