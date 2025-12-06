<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import './RegistrarPedidoUI.css';

const API_BASE_URL = 'http://localhost:3001/api';

function RegistrarPedidoUI({ userData, isOpen, onClose }) {
    if (!isOpen) {
        return null;
    }
    const usuarioAuxiliarId = userData?.usuarioId;
    const [cedulaBusqueda, setCedulaBusqueda] = useState('');
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null); // Cliente encontrado de la DB
    const [productos, setProductos] = useState([]); // Lista de productos de la DB
    const [isLoading, setIsLoading] = useState(false); // Para manejar el estado de carga

    // --- ESTADOS DE ITEM DE PEDIDO ---
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [unidadesSeleccionadas, setUnidadesSeleccionadas] = useState('');
    const [empaqueSeleccionado, setEmpaqueSeleccionado] = useState('');
    const [nota, setNota] = useState('');
    const [pedidoItems, setPedidoItems] = useState([]);

    // --- ESTADOS DE UI Y ERRORES ---
    const [mostrarListaProductos, setMostrarListaProductos] = useState(false);
    const [errorBusqueda, setErrorBusqueda] = useState('');
    const [message, setMessage] = useState(null); // Estado para mensajes generales/de acción

    const opcionesUnidades = Array.from({ length: 12 }, (_, i) => i + 1);

    // ----------------------------------------------------------------------
    // 1. Carga Inicial de Productos (GET /api/productos)
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (!isOpen) return;

        const fetchProductos = async () => {
            setMessage(null);
            try {
                const response = await fetch(`${API_BASE_URL}/productos`);
                if (!response.ok) {
                    throw new Error('Error de servidor al cargar productos.');
                }
                const data = await response.json();
                setProductos(data);
            } catch (error) {
                setMessage({ type: 'error', text: '🛑 No se pudieron cargar los productos.' });
                console.error('Fetch Error Productos:', error);
            }
        };
        fetchProductos();
    }, [isOpen]);

    // ----------------------------------------------------------------------
    // 2. Búsqueda de Cliente (GET /api/clientes y filtro local)
    // ----------------------------------------------------------------------
    const buscarCliente = async () => {
=======
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
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
        const cedulaLimpia = cedulaBusqueda.trim();
        if (!cedulaLimpia) {
            setErrorBusqueda('Por favor ingrese una cédula.');
            setClienteSeleccionado(null);
            return;
        }
<<<<<<< HEAD

        setErrorBusqueda('');
        setMessage(null);
        setIsLoading(true);

        try {
            // Llamar al endpoint de todos los clientes
            const response = await fetch(`${API_BASE_URL}/clientes`);
            if (!response.ok) {
                throw new Error('Error de servidor al buscar clientes.');
            }
            const clientesDB = await response.json();

            // Filtrar por cédula (la cédula del cliente en la DB es 'cedula')
            const clienteEncontrado = clientesDB.find(
                c => c.cedula === cedulaLimpia
            );

            if (clienteEncontrado) {
                setClienteSeleccionado(clienteEncontrado);
                setErrorBusqueda('');
                setMessage({ type: 'success', text: `✅ Cliente encontrado: ${clienteEncontrado.nombre}` });
            } else {
                setErrorBusqueda(`Cliente con cédula ${cedulaLimpia} no encontrado.`);
                setClienteSeleccionado(null);
            }
        } catch (error) {
            setErrorBusqueda('🛑 Error de conexión al buscar cliente.');
            setClienteSeleccionado(null);
            console.error('Error de búsqueda:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Función auxiliar para limpiar los campos de ítem
    const clearItemFields = () => {
        setProductoSeleccionado('');
        setUnidadesSeleccionadas('');
        setEmpaqueSeleccionado('');
    };

    // ----------------------------------------------------------------------
    // 3. Agregar Ítem al Pedido
    // ----------------------------------------------------------------------
    const handleAgregarItem = () => {
        setMessage(null);

        if (!clienteSeleccionado) {
            setMessage({ type: 'error', text: '🛑 Error: Primero debe seleccionar un cliente.' });
            return;
        }
        if (!productoSeleccionado || !unidadesSeleccionadas) {
            setMessage({ type: 'error', text: '🛑 Error: Complete los campos de producto, unidades y empaque.' });
            return;
        }

        const cantidadNumerica = unidadesSeleccionadas === '+' ? 12 : Number(unidadesSeleccionadas);
        if (unidadesSeleccionadas === '+') {
            setMessage({ type: 'warning', text: 'Se ha seleccionado "más de 12". Por favor edite la cantidad manualmente en el resumen si es necesario.' });
        }


        // Obtener el ID y el precio del producto (CRÍTICO para el Backend)
        const productoObj = productos.find(p => p.nombre === productoSeleccionado);

        if (!productoObj) {
            setMessage({ type: 'error', text: 'Producto no válido en la lista de la API. Seleccione de la lista sugerida.' });
=======
        
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
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
            return;
        }

        const newItem = {
<<<<<<< HEAD
            id: Date.now(), // ID único para React Key
            productoId: productoObj.producto_id, // ID para el Backend
            productoNombre: productoSeleccionado, // Nombre para el display en Frontend
            cantidad: cantidadNumerica, // Usamos el valor numérico (o 12 si fue '+')
            precio: productoObj.precio, // Precio para el Backend
            empaque: productoObj.unidad_medida,
        };

        setPedidoItems([...pedidoItems, newItem]);
        clearItemFields(); // ✅ Aseguramos la limpieza del formulario de ítem
        setMessage({ type: 'success', text: `✅ Se agregó ${cantidadNumerica} ${empaqueSeleccionado} de ${productoSeleccionado} al pedido.` });
    };

    // Función para eliminar un item del pedido
    const handleEliminarItem = (id) => {
        setPedidoItems(pedidoItems.filter(item => item.id !== id));
        setMessage(null);
    };


    // ----------------------------------------------------------------------
    // 4. Guardar Pedido Completo (POST /api/pedidos)
    // ----------------------------------------------------------------------
    const handleGuardarPedido = async () => {
        // VALIDACIÓN: Evita guardar sin cliente o ítems (Correcta)
        if (!clienteSeleccionado || pedidoItems.length === 0) {
            setMessage({ type: 'error', text: 'Debe seleccionar un cliente y agregar al menos un ítem.' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        // Mapear los ítems al formato que espera el Backend
        const itemsParaAPI = pedidoItems.map(item => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precio: item.precio, // precio_unitario_venta
        }));

        const pedidoData = {
            clienteId: clienteSeleccionado.cliente_id, // Usamos el ID de la DB
            nota: nota,
            items: itemsParaAPI,
            usuarioAuxiliarId: usuarioAuxiliarId,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/pedidos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedidoData),
            });

            if (response.ok) {
                const result = await response.json();
                setMessage({ type: 'success', text: `✅ Pedido ${result.pedidoId} registrado con éxito.` });

                // Limpiar todo después de un registro exitoso
                setPedidoItems([]);
                setNota(''); // ✅ La nota se limpia solo al éxito.
                clearItemFields();
                setClienteSeleccionado(null);
                setCedulaBusqueda('');

                setTimeout(onClose, 500);

            } else {
                const errorData = await response.json();
                console.error('Error al guardar pedido:', errorData);
                // Si hay un error, el mensaje debe reflejarlo.
                setMessage({ type: 'error', text: errorData.error || '❌ Error al guardar pedido. Intente de nuevo.' });
            }
        } catch (error) {
            console.error('Error de conexión al guardar pedido:', error);
            setMessage({ type: 'error', text: '🛑 No se pudo conectar al servidor. Verifique la conexión de red o si el backend está corriendo.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Función para el display del cliente
    const clienteDisplay = clienteSeleccionado
        ? `${clienteSeleccionado.cedula} - ${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}`
        : '';

    // Lista de nombres de productos para el dropdown simulado
    const productosDisponibles = productos.map(p => p.nombre);

    return (
        <div className="modal-backdrop">
            <div className="modal-content-pedido">

                <button className="close-button" onClick={onClose}>&times;</button>
=======
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
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
                {/* Header */}
                <div className="modal-header-pedido">
                    <h2>REGISTRADOR PEDIDO</h2>
                </div>

<<<<<<< HEAD

=======
                
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513

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
<<<<<<< HEAD

=======
                    
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
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
<<<<<<< HEAD

                    {/* Columna Izquierda: PEDIDO y Botón Guardar */}
                    <div className="pedido-col-left">

=======
                    
                    {/* Columna Izquierda: PEDIDO y Botón Guardar */}
                    <div className="pedido-col-left">
                        
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
                        <div className="pedido-box">
                            <p className="box-title">PEDIDO</p>
                            <div className="pedido-items-list">
                                {pedidoItems.map((item, index) => (
                                    <p key={item.id} className="pedido-item-row">
<<<<<<< HEAD
                                        {`${item.cantidad} ${item.empaque} de ${item.productoNombre}`}
=======
                                        {`${item.unidades} ${item.empaque} ${item.producto}`}
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
                                    </p>
                                ))}
                                {pedidoItems.length === 0 && <p className="empty-message">El pedido está vacío.</p>}
                            </div>
                        </div>

                        {/* Botón Guardar Pedido */}
<<<<<<< HEAD
                        <button
                            className="btn-guardar-pedido"
=======
                        <button 
                            className="btn-guardar-pedido" 
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
                            onClick={handleGuardarPedido}
                            disabled={!clienteSeleccionado || pedidoItems.length === 0}
                        >
                            Guardar Pedido
                        </button>
                    </div>
<<<<<<< HEAD

                    {/* Columna Derecha: Selección de Producto y Cantidad */}
                    <div className="pedido-col-right">

                        <div className="input-group-select">
                            {/* Selector de Producto (Componente <select> nativo) */}
                            <select
                                value={productoSeleccionado} // El valor seleccionado
                                onChange={(e) => setProductoSeleccionado(e.target.value)} // Actualiza el estado al cambiar
                                className="product-select" // Clase opcional para estilos
                            >
                                {/* Opción por defecto (Placeholder) */}
                                <option value="" disabled>
                                    Selecciona un producto...
                                </option>

                                {/* Opciones generadas a partir del array de productos disponibles */}
                                {productosDisponibles.map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Dropdowns de Unidades y Empaque */}
                        <div className="selectors-row">
                            <select
                                value={unidadesSeleccionadas}
=======
                    
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
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
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
<<<<<<< HEAD
=======
                            
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
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
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
<<<<<<< HEAD

                    </div>

                </div>

=======
                        
                    </div>
                    
                </div>
                
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
            </div>
        </div>
    );
}

export default RegistrarPedidoUI;