import React, { useState } from 'react';
// Importa los componentes
import InicioSesionUI from './InicioSesionUI';
import InicioUI from './InicioUI';
import ResumenUI from './ResumenUI';
import RegistrarPedidoUI from './RegistrarPedidoUI';
import ClientesUI from './ClientesUI';
import RegistrarClienteUI from './RegistrarClienteUI';

function App() {
  const [vistaActual, setVistaActual] = useState('login');
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [mostrarRegistrarPedido, setRegistrarPedido] = useState(false);
  const [mostrarClientes, setMostrarClientes] = useState(false);
  const [mostraRegistroCliente, setmostraRegistroCliente] = useState(false);

  const [userData, setUserData] = useState(null);


  const handleLoginSuccess = (data) => {
    setUserData(data);
    setVistaActual('inicio');
    console.log(`Inicio de sesión simulado exitoso para: ${data.usuarioId}`);
  };

  // Lógica para abrir/cerrar ResumenUI
  const openResumenModal = () => setMostrarResumen(true);
  const closeResumenModal = () => setMostrarResumen(false);

  //Logica para abrir/cerrar RegistrarPedido
  const opeRegistrarpedido = () => setRegistrarPedido(true);
  const closeRegistrarPedido = () => setRegistrarPedido(false);

  //Logica para abrir/cerrar ClientesUi
  const opeClientes = () => setMostrarClientes(true);
  const closeClientes = () => setMostrarClientes(false);

  const NuevoRegistroCliente = () => {
    closeClientes();
    opeRegistrarCliente();
  }

  // Logica para abrir/cerrar RegistrarClienteUI
  const opeRegistrarCliente = () => setmostraRegistroCliente(true);
  const closeRegistrarCliente = () => setmostraRegistroCliente(false);

  // Lógica para simular el "Salir" del InicioUI
  const handleLogout = () => {
    setVistaActual('login');
  };



  if (vistaActual === 'login') {

    return (
      <InicioSesionUI onLoginSuccess={handleLoginSuccess} />
    );
  }

  else if (vistaActual === 'inicio') {
    // Muestra la interfaz de Inicio (Home)
    return (
      <>
        <InicioUI
          userData={userData}
          onResumenClick={openResumenModal}
          onRegistrarPedido={opeRegistrarpedido}
          onClientesClick={opeClientes}
          onRegistrarClienteClick={opeRegistrarCliente}
          onLogoutClick={handleLogout}
        />

        <ResumenUI
          isOpen={mostrarResumen}
          onClose={closeResumenModal}
        />

        <RegistrarPedidoUI
          userData={userData}
          isOpen={mostrarRegistrarPedido}
          onClose={closeRegistrarPedido}
        />

        <ClientesUI
          isOpen={mostrarClientes}
          onClose={closeClientes} onRegistrarClienteClick={NuevoRegistroCliente}
        />

        <RegistrarClienteUI
          isOpen={mostraRegistroCliente}
          onClose={closeRegistrarCliente}
        />
      </>
    );
  }
}

export default App;