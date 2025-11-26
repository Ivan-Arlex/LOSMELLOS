// index.js - SERVIDOR API EXPRESS CORREGIDO
import express from 'express';
import cors from 'cors';
import { createConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001; 

// Middleware
app.use(cors()); 
app.use(express.json()); 

let db;

// 1. Conexión a la Base de Datos MySQL
async function connectToDatabase() {
    try {
        db = await createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        console.log('✅ Conexión a la base de datos MySQL exitosa.');
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
        process.exit(1); 
    }
}

// ----------------------------------------------------
// ENPOINTS DEL API
// ----------------------------------------------------

// 2. GET: Listar todos los clientes 
// ADAPTADO: Usando la tabla 'Cliente' y las columnas en minúsculas.
app.get('/api/clientes', async (req, res) => {
    // Nota: El nuevo esquema no tiene 'Apellido', el nombre es completo en 'nombre'
    const query = `
        SELECT cliente_id, nombre, ciudad, telefono AS celular, cedula 
        FROM Cliente
    `;
    try {
        const [rows] = await db.execute(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener la lista de clientes:', error);
        res.status(500).json({ error: 'Error del servidor al obtener clientes' });
    }
});

// 3. POST: Registrar un nuevo cliente
// ADAPTADO: Usando la tabla 'Cliente' (no 'Clientes'). El apellido se asume parte del 'nombre'
app.post('/api/clientes', async (req, res) => {
    // Eliminamos 'apellido' porque no existe en la nueva tabla Cliente.
    const { nombre, ciudad, celular, cedula, apellido } = req.body; 
    
    // Concatenamos nombre y apellido para el campo 'nombre' si viene el apellido
    const nombreCompleto = apellido ? `${nombre} ${apellido}` : nombre;

    const query = `
        INSERT INTO Cliente (nombre, ciudad, telefono, cedula) 
        VALUES (?, ?, ?, ?)
    `;
    const values = [nombreCompleto, ciudad, celular, cedula];

    try {
        const [result] = await db.execute(query, values);
        res.status(201).json({ 
            message: 'Cliente registrado con éxito', 
            clienteId: result.insertId 
        });
    } catch (error) {
        console.error('Error al insertar cliente:', error);
        res.status(500).json({ error: 'Error del servidor al registrar el cliente', details: error.message });
    }
});


// ----------------------------------------------------
// ENPOINTS DE PEDIDOS Y PRODUCTOS
// ----------------------------------------------------

// 4. GET: Listar todos los productos
// ADAPTADO: Usando la tabla 'Producto', 'producto_id' y 'precio_venta_base'
app.get('/api/productos', async (req, res) => {
    const query = `
        SELECT producto_id, nombre, precio_venta_base AS precio, unidad_medida 
        FROM Producto 
        ORDER BY nombre
    `;
    try {
        const [rows] = await db.execute(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
        res.status(500).json({ error: 'Error del servidor al obtener productos' });
    }
});


// 5. POST: Registrar un Pedido Completo (Transacción)
// ADAPTADO: Usa 'cliente_id' (INT) en la tabla 'Pedido' y 'Detalle_Pedido'.
// ADAPTADO: Asigna valores fijos para nuevos campos (usuario_auxiliar_id, estado_pedido, tipo_entrega).
app.post('/api/pedidos', async (req, res) => {
    // Ahora esperamos 'clienteId' (el ID INT) del frontend en lugar de solo la cédula
    const { clienteId, nota, items } = req.body; 

    if (!items || items.length === 0 || !clienteId) {
        return res.status(400).json({ error: 'Faltan datos requeridos (Cliente ID o artículos).' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();
        
        // 1. Insertar la Cabecera del Pedido
        // Usamos NOW(), estado_pedido='Recibido', tipo_entrega='Urbana', y un usuario ID fijo (1)
        const pedidoQuery = `
            INSERT INTO Pedido (cliente_id, usuario_auxiliar_id, fecha_pedido, estado_pedido, tipo_entrega, notas_cliente) 
            VALUES (?, 1, NOW(), 'Recibido', 'Urbana', ?)
        `;
        const [pedidoResult] = await connection.execute(pedidoQuery, [clienteId, nota]);
        const pedidoId = pedidoResult.insertId;

        // 2. Insertar los Detalles del Pedido
        // NOTA: El nuevo esquema de detalle no tiene 'empaque'. Usamos 'cantidad_solicitada' y 'precio_unitario_venta'.
        const detalleQuery = `
            INSERT INTO Detalle_Pedido (pedido_id, producto_id, cantidad_solicitada, precio_unitario_venta) 
            VALUES (?, ?, ?, ?)
        `;

        for (const item of items) {
            // Buscamos el precio actual del producto (asumiendo que el item.precio viene del GET /api/productos)
            await connection.execute(detalleQuery, [
                pedidoId,
                item.productoId,
                item.cantidad,
                // item.precio viene del frontend y corresponde a precio_venta_base
                item.precio 
            ]);
        }

        await connection.commit();
        res.status(201).json({ message: 'Pedido registrado con éxito', pedidoId });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error al registrar el pedido:', error);
        // Aquí puede aparecer un error si las FK no coinciden, por ejemplo, si cliente_id no existe.
        res.status(500).json({ error: 'Error del servidor al registrar el pedido', details: error.message });

    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// 6. Inicializar Servidor
async function startServer() {
    await connectToDatabase();
    app.listen(port, () => {
        console.log(`🚀 Servidor API Express escuchando en http://localhost:${port}`);
    });
}

startServer();