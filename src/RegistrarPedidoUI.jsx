import React, { useState } from 'react';
import './RegistrarPedidoUI.css';

// 1. Simulación de Base de Datos de Clientes y Productos
const clientesDB = [
    { id: 1, cedula: '76171782', nombre: 'Karen Yulisa Congolino' },
    { id: 2, cedula: '1263673373', nombre: 'Viviana Hurtado' },
    { id: 3, cedula: '67745226', nombre: 'Luis David Cabezas' },
];

const productosDisponibles = [
    'Mango', 'Pera', 'Mandarina', 'Remolacha', 'Sandía', 'Zámpote'
];

function RegistrarPedidoUI({ isOpen, onClose }) {
    if (!isOpen) {
        return null;
    }

    // --- Estados para Cliente y Búsqueda ---
    const [cedulaBusqueda, setCedulaBusqueda] = useState(''); // Valor inicial simulado
    const [clienteSeleccionado, setClienteSeleccionado] = useState(
        clientesDB.find(c => c.cedula === '') // Cliente simulado encontrado
    );
    const [errorBusqueda, setErrorBusqueda] = useState('');
    
    // --- Estados para Ítem de Pedido ---
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [unidadesSeleccionadas, setUnidadesSeleccionadas] = useState(''); // Variable para unidades (1-12)
    const [empaqueSeleccionado, setEmpaqueSeleccionado] = useState('');     // Variable para empaque (Cartones, Guacal)
    const [nota, setNota] = useState('');
    const [pedidoItems, setPedidoItems] = useState([]); // Lista de ítems en el pedido
    
    // --- Estados para manejar la visualización de la lista de productos ---
    const [mostrarListaProductos, setMostrarListaProductos] = useState(false);
    
    // Array para las opciones de unidades (1 a 12)
    const opcionesUnidades = Array.from({ length: 12 }, (_, i) => i + 1);


    // 2. Función de Búsqueda (Simulando la base de datos)
    const buscarCliente = () => {
        const cedulaLimpia = cedulaBusqueda.trim();
        if (!cedulaLimpia) {
            setErrorBusqueda('Por favor ingrese una cédula.');
            setClienteSeleccionado(null);
            return;
        }
        
        const clienteEncontrado = clientesDB.find(
            c => c.cedula === cedulaLimpia
        );

        if (clienteEncontrado) {
            setClienteSeleccionado(clienteEncontrado);
            setErrorBusqueda('');
        } else {
            setErrorBusqueda(`Cliente con cédula ${cedulaLimpia} no encontrado.`);
            setClienteSeleccionado(null);
        }
    };
    
    // Función para agregar un ítem al pedido
    const handleAgregarItem = () => {
        if (!clienteSeleccionado) {
            alert('Primero debe seleccionar un cliente.');
            return;
        }
        if (!productoSeleccionado || !unidadesSeleccionadas || !empaqueSeleccionado) {
            alert('Complete los campos de producto, unidades y empaque.');
            return;
        }

        const newItem = {
            id: Date.now(),
            producto: productoSeleccionado,
            unidades: unidadesSeleccionadas,
            empaque: empaqueSeleccionado,
        };
        
        setPedidoItems([...pedidoItems, newItem]);
        
        // Limpiar campos de ítem después de agregar
        setProductoSeleccionado('');
        setUnidadesSeleccionadas('');
        setEmpaqueSeleccionado('');
    };
    
    // Función para guardar el pedido completo (simulación)
    const handleGuardarPedido = () => {
        if (pedidoItems.length === 0) {
            alert('El pedido está vacío.');
            return;
        }
        
        console.log('Pedido Final a Guardar:', {
            cliente: clienteSeleccionado.nombre,
            cedula: clienteSeleccionado.cedula,
            items: pedidoItems,
            nota: nota 
        });
        
        alert(`Pedido de  ${clienteSeleccionado.nombre} guardado (simulado).`);
        onClose();
    };
    

    const clienteDisplay = clienteSeleccionado 
        ? `${clienteSeleccionado.cedula} - ${clienteSeleccionado.nombre}`
        : '';

    return (
        <div className="modal-backdrop">
            <div className="modal-content-pedido">
                
                 <button className="close-button" onClick={onClose}>&times;</button>
                {/* Header */}
                <div className="modal-header-pedido">
                    <h2>REGISTRADOR PEDIDO</h2>
                </div>

                

                {/* 1. Búsqueda y Display de Cliente */}
                <div className="cliente-inputs-row">
                    {/* Input de Cédula de Búsqueda */}
                    <div className="input-group-search">
                        <input
                            type="text"
                            placeholder="Cédula del Cliente"
                            value={cedulaBusqueda}
                            onChange={(e) => setCedulaBusqueda(e.target.value)}
                        />
                        <button className="search-icon-button" onClick={buscarCliente} type="button">
                            🔍
                        </button>
                    </div>
                    
                    {/* Input de Cédula y Nombre Encontrado (No editable) */}
                    <div className="input-group-search"><input
                        type="text"
                        value={clienteDisplay}
                        placeholder="Cliente"
                        readOnly
                        className="cliente-display-input"
                    />
                    </div>
                </div>
                {errorBusqueda && <p className="error-message">{errorBusqueda}</p>}

                <div className="pedido-main-layout">
                    
                    {/* Columna Izquierda: PEDIDO y Botón Guardar */}
                    <div className="pedido-col-left">
                        
                        <div className="pedido-box">
                            <p className="box-title">PEDIDO</p>
                            <div className="pedido-items-list">
                                {pedidoItems.map((item, index) => (
                                    <p key={item.id} className="pedido-item-row">
                                        {`${item.unidades} ${item.empaque} ${item.producto}`}
                                    </p>
                                ))}
                                {pedidoItems.length === 0 && <p className="empty-message">El pedido está vacío.</p>}
                            </div>
                        </div>

                        {/* Botón Guardar Pedido */}
                        <button 
                            className="btn-guardar-pedido" 
                            onClick={handleGuardarPedido}
                            disabled={!clienteSeleccionado || pedidoItems.length === 0}
                        >
                            Guardar Pedido
                        </button>
                    </div>
                    
                    {/* Columna Derecha: Selección de Producto y Cantidad */}
                    <div className="pedido-col-right">
                        
                        {/* Selector de Producto (Input con búsqueda simulada) */}
                        <div className="input-group-search">
                             <input 
                                 type="text" 
                                 placeholder="Frutas y verduras" 
                                 value={productoSeleccionado} 
                                 onChange={(e) => setProductoSeleccionado(e.target.value)}
                                 onFocus={() => setMostrarListaProductos(true)}
                                 onBlur={() => setTimeout(() => setMostrarListaProductos(false), 200)} // Pequeño retraso para permitir clic
                             />
                             
                             {/* Lista de Productos (Dropdown simulado) */}
                             {mostrarListaProductos && (
                                 <div className="product-dropdown-list">
                                     {productosDisponibles.filter(p => p.toLowerCase().includes(productoSeleccionado.toLowerCase())).map(p => (
                                         <div 
                                             key={p} 
                                             className="product-dropdown-item"
                                             onMouseDown={() => { // Usar onMouseDown para capturar el clic antes de onBlur
                                                 setProductoSeleccionado(p);
                                                 setMostrarListaProductos(false);
                                             }}
                                         >
                                             {p}
                                         </div>
                                     ))}
                                 </div>
                             )}
                        </div>
                        
                        {/* Dropdowns de Unidades y Empaque */}
                        <div className="selectors-row">
                            <select 
                                value={unidadesSeleccionadas} 
                                onChange={(e) => setUnidadesSeleccionadas(e.target.value)}
                                className="select-unidades"
                            >
                                <option value="" disabled>Unidades</option>
                                {/* Opciones del 1 al 12 */}
                                {opcionesUnidades.map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                                <option value="+">+</option> {/* Opción para más de 12 */}
                            </select>
                            
                            <select 
                                value={empaqueSeleccionado} 
                                onChange={(e) => setEmpaqueSeleccionado(e.target.value)}
                                className="select-empaque"
                            >
                                <option value="" disabled>Empaque</option>
                                <option value="Cartones">Cartones</option>
                                <option value="Guacal">Guacal</option>
                                <option value="Bolsas">Bolsas</option>
                            </select>
                        </div>

                        {/* Botón Agregar Ítem */}
                        <button className="btn-agregar-item" onClick={handleAgregarItem} type="button">
                            Agregar
                        </button>

                        {/* Área de Nota */}
                        <div className="nota-box">
                            <p className="box-title">Nota:</p>
                            <textarea value={nota} onChange={(e) => setNota(e.target.value)} rows="4" />
                        </div>
                        
                    </div>
                    
                </div>
                
            </div>
        </div>
    );
}

export default RegistrarPedidoUI;