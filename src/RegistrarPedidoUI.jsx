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
        const cedulaLimpia = cedulaBusqueda.trim();
        if (!cedulaLimpia) {
            setErrorBusqueda('Por favor ingrese una cédula.');
            setClienteSeleccionado(null);
            return;
        }

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
            return;
        }

        const newItem = {
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

                                        {`${item.cantidad} ${item.empaque} de ${item.productoNombre}`}

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